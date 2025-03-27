import os
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    filters,
    CallbackContext,
    ConversationHandler
)
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()
TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN_DAILY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY_DAILY")

# Conversation states
PLANNING, REVIEW_SUGGESTIONS, FINALIZING = range(3)

class DailyTaskBot:
    def __init__(self):
        self.user_plans = {}  # Stores user_id: {tasks: [], suggestions: [], selected: []}
        
        self.application = Application.builder().token(TELEGRAM_TOKEN).build()
        
        conv_handler = ConversationHandler(
            entry_points=[CommandHandler('start', self.start)],
            states={
                PLANNING: [
                    MessageHandler(filters.TEXT & ~filters.COMMAND, self.receive_tasks)
                ],
                REVIEW_SUGGESTIONS: [
                    CallbackQueryHandler(self.handle_suggestion_toggle)
                ],
                FINALIZING: [
                    CallbackQueryHandler(self.finalize_plan)
                ]
            },
            fallbacks=[CommandHandler('cancel', self.cancel)],
        )
        
        self.application.add_handler(conv_handler)
        self.application.add_handler(CommandHandler('view', self.view_tasks))
    
    async def start(self, update: Update, context: CallbackContext) -> int:
        """Start conversation and request tasks"""
        await update.message.reply_text(
            "📝 Please list your tasks for today (one per line):\n\n"
            "Example:\n"
            "8:00 AM - Morning walk\n"
            "10:00 AM - Work project\n"
            "12:00 PM - Healthy lunch"
        )
        return PLANNING
    
    async def receive_tasks(self, update: Update, context: CallbackContext) -> int:
        """Store user tasks and get Gemini suggestions"""
        user_id = update.effective_user.id
        tasks = [line.strip() for line in update.message.text.split('\n') if line.strip()]
        
        # Store original tasks
        self.user_plans[user_id] = {
            'original_tasks': tasks,
            'suggestions': [],
            'selected_suggestions': []
        }
        
        # Get exactly 3 suggestions from Gemini
        suggestions = await self.get_health_suggestions(tasks)
        self.user_plans[user_id]['suggestions'] = suggestions[:3]  # Take only first 3
        
        # Create toggle buttons for each suggestion
        keyboard = []
        for i, suggestion in enumerate(suggestions[:3]):
            emoji = "✅" if i in self.user_plans[user_id]['selected_suggestions'] else "◻️"
            keyboard.append([InlineKeyboardButton(
                f"{emoji} Suggestion {i+1}: {suggestion}",
                callback_data=f"toggle_{i}"
            )])
        
        keyboard.append([InlineKeyboardButton("Done Reviewing", callback_data="done_review")])
        
        await update.message.reply_text(
            "🔍 Here are 3 suggestions to improve your plan:\n"
            "(Toggle the ones you want to include)",
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
        return REVIEW_SUGGESTIONS
    
    async def get_health_suggestions(self, tasks: list) -> list:
        """Get exactly 3 health suggestions from Gemini"""
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key={GEMINI_API_KEY}"
        prompt = (
            "Provide exactly 3 specific suggestions to improve this daily schedule "
            "for someone with chronic health conditions. Focus on:\n"
            "1. Better activity timing\n"
            "2. Healthier alternatives\n"
            "3. Important additions\n"
            "Format each suggestion as a short bullet point starting with '* '\n\n"
            "Current schedule:\n" + "\n".join(tasks)
        )
        
        try:
            response = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]})
            response.raise_for_status()
            text = response.json()['candidates'][0]['content']['parts'][0]['text']
            return [line[2:].strip() for line in text.split('\n') if line.startswith('* ')]
        except Exception as e:
            print(f"Gemini error: {e}")
            return [
                "Add 10-minute stretching between tasks",
                "Replace sugary snacks with fruits/nuts",
                "Include a 15-minute mindfulness session"
            ]
    
    async def handle_suggestion_toggle(self, update: Update, context: CallbackContext) -> int:
        """Toggle selection of suggestions"""
        query = update.callback_query
        await query.answer()
        user_id = query.from_user.id
        
        if query.data == "done_review":
            # Proceed to finalize plan
            return await self.show_final_plan(query)
        
        # Toggle suggestion selection
        suggestion_idx = int(query.data.split("_")[1])
        if suggestion_idx in self.user_plans[user_id]['selected_suggestions']:
            self.user_plans[user_id]['selected_suggestions'].remove(suggestion_idx)
        else:
            self.user_plans[user_id]['selected_suggestions'].append(suggestion_idx)
        
        # Update the message with new toggle states
        keyboard = []
        for i, suggestion in enumerate(self.user_plans[user_id]['suggestions']):
            emoji = "✅" if i in self.user_plans[user_id]['selected_suggestions'] else "◻️"
            keyboard.append([InlineKeyboardButton(
                f"{emoji} Suggestion {i+1}: {suggestion}",
                callback_data=f"toggle_{i}"
            )])
        
        keyboard.append([InlineKeyboardButton("Done Reviewing", callback_data="done_review")])
        
        await query.edit_message_text(
            text="🔍 Here are 3 suggestions to improve your plan:\n(Select the ones you want to include)",
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
        return REVIEW_SUGGESTIONS
    
    async def show_final_plan(self, query) -> int:
        """Combine selected suggestions with original tasks"""
        user_id = query.from_user.id
        original_tasks = self.user_plans[user_id]['original_tasks']
        selected = self.user_plans[user_id]['selected_suggestions']
        suggestions = self.user_plans[user_id]['suggestions']
        
        # Create final task list
        final_tasks = original_tasks.copy()
        for idx in selected:
            final_tasks.append(suggestions[idx])
        
        # Store final tasks
        self.user_plans[user_id]['final_tasks'] = final_tasks
        self.user_plans[user_id]['completed'] = [False] * len(final_tasks)
        
        # Display with checkboxes
        task_text = "\n".join(
            f"{'✅' if completed else '◻️'} {task}"
            for task, completed in zip(final_tasks, self.user_plans[user_id]['completed'])
        )
        
        keyboard = [
            [InlineKeyboardButton(f"Toggle Task {i+1}", callback_data=f"complete_{i}")]
            for i in range(len(final_tasks))
        ]
        keyboard.append([InlineKeyboardButton("Finish Day", callback_data="finish")])
        
        await query.edit_message_text(
            f"📋 Your Final Plan:\n\n{task_text}",
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
        return FINALIZING
    
    async def finalize_plan(self, update: Update, context: CallbackContext) -> int:
        """Handle task completion toggles"""
        query = update.callback_query
        await query.answer()
        user_id = query.from_user.id
        
        if query.data == "finish":
            await query.edit_message_text("🎉 Great job completing your tasks! Use /start to plan a new day.")
            return ConversationHandler.END
        
        # Toggle task completion
        task_idx = int(query.data.split("_")[1])
        self.user_plans[user_id]['completed'][task_idx] = not self.user_plans[user_id]['completed'][task_idx]
        
        # Update the message
        task_text = "\n".join(
            f"{'✅' if completed else '◻️'} {task}"
            for task, completed in zip(
                self.user_plans[user_id]['final_tasks'],
                self.user_plans[user_id]['completed']
            )
        )
        
        keyboard = [
            [InlineKeyboardButton(f"Toggle Task {i+1}", callback_data=f"complete_{i}")]
            for i in range(len(self.user_plans[user_id]['final_tasks']))
        ]
        keyboard.append([InlineKeyboardButton("Finish Day", callback_data="finish")])
        
        await query.edit_message_text(
            text=f"📋 Your Final Plan:\n\n{task_text}",
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
        return FINALIZING
    
    async def view_tasks(self, update: Update, context: CallbackContext):
        """View current tasks"""
        user_id = update.effective_user.id
        if user_id in self.user_plans and 'final_tasks' in self.user_plans[user_id]:
            tasks = self.user_plans[user_id]['final_tasks']
            completed = self.user_plans[user_id]['completed']
            
            task_text = "\n".join(
                f"{'✅' if comp else '◻️'} {task}"
                for task, comp in zip(tasks, completed)
            )
            
            keyboard = [
                [InlineKeyboardButton(f"Toggle Task {i+1}", callback_data=f"complete_{i}")]
                for i in range(len(tasks))
            ]
            keyboard.append([InlineKeyboardButton("Finish Day", callback_data="finish")])
            
            await update.message.reply_text(
                f"📋 Your Current Plan:\n\n{task_text}",
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
        else:
            await update.message.reply_text("No active plan. Use /start to create one.")
    
    async def cancel(self, update: Update, context: CallbackContext) -> int:
        """Cancel the current operation"""
        await update.message.reply_text("Operation cancelled.")
        return ConversationHandler.END
    
    def run(self):
        """Run the bot"""
        self.application.run_polling()

if __name__ == "__main__":
    bot = DailyTaskBot()
    bot.run()