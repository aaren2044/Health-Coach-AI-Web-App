import csv
import os
import json
import re
import asyncio
import requests
from typing import Dict, List
from apscheduler.schedulers.background import BackgroundScheduler
from telegram import Update, ReplyKeyboardMarkup, ReplyKeyboardRemove
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    filters,
    ConversationHandler,
    CallbackContext,
)
from dotenv import load_dotenv
import easyocr
import logging

# Define conversation states
NAME, DIET_TYPE, MEAL_PREFS, SPICE_LEVEL, ALLERGIES, CHRONIC_DISEASE, PHOTO_HANDLER, INGREDIENTS_INPUT = range(8)

# CSV setup
CSV_FILE = "diet_preferences.csv"
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, "w", newline="", encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["User ID", "Name", "Diet Type", "Meal Preferences", "Spice Level", "Allergies", "Chronic Disease"])

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY_DIET")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN_DIET")

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

# Set up logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

class DietPlanParser:
    @staticmethod
    def parse_diet_plan(diet_plan_text: str) -> Dict[str, Dict[str, str]]:
        """Improved parser with more robust extraction using regular expressions"""
        parsed_plan = {
            "overview": "",
            "meals": {
                "breakfast": {"name": "", "ingredients": [], "instructions": []},
                "lunch": {"name": "", "ingredients": [], "instructions": []},
                "dinner": {"name": "", "ingredients": [], "instructions": []},
                "snacks": []
            },
            "notes": []
        }

        # Define meal sections and their relationships
        meal_sections = {
            "Breakfast": "Lunch",
            "Lunch": "Dinner",
            "Dinner": "Snacks"
        }

        # Normalize line endings and remove empty lines
        lines = [line.strip() for line in diet_plan_text.split('\n') if line.strip()]
        text = '\n'.join(lines)
        
        # Extract overview
        overview_match = re.search(r"\*\*Overview:\*\*(.*?)(?=\*\*Breakfast:\*\*|\Z)", text, re.DOTALL)
        if overview_match:
            parsed_plan["overview"] = overview_match.group(1).strip()
        
        # Extract each meal
        for meal_header, next_section in meal_sections.items():
            meal_match = re.search(
                fr"\*\*{meal_header}:\*\*(.*?)\*\*Ingredients:\*\*(.*?)\*\*Instructions:\*\*(.*?)(?=\*\*{next_section}:\*\*|\Z)",
                text, re.DOTALL
            )
            
            if meal_match:
                # Extract meal name if present
                name_match = re.search(r"\*\*Meal Name:\*\*(.*?)(?=\*\*Ingredients:\*\*|\Z)", meal_match.group(1), re.DOTALL)
                if name_match:
                    parsed_plan["meals"][meal_header.lower()]["name"] = name_match.group(1).strip()
                else:
                    parsed_plan["meals"][meal_header.lower()]["name"] = f"{meal_header} Meal"
                
                # Extract ingredients
                ingredients = [ing.strip() for ing in meal_match.group(2).split('\n') if ing.strip() and ing.strip().startswith(('-', '*'))]
                parsed_plan["meals"][meal_header.lower()]["ingredients"] = ingredients
                
                # Extract instructions
                instructions = [inst.strip() for inst in meal_match.group(3).split('\n') if inst.strip() and (inst.strip()[0].isdigit() or inst.strip().startswith(('-', '*')))]
                parsed_plan["meals"][meal_header.lower()]["instructions"] = instructions
        
        # Extract snacks
        snacks_match = re.search(r"\*\*Snacks:\*\*(.*?)(?=\*\*Important Notes:\*\*|\Z)", text, re.DOTALL)
        if snacks_match:
            parsed_plan["meals"]["snacks"] = [
                snack.strip()[2:] for snack in snacks_match.group(1).split('\n') 
                if snack.strip() and snack.strip().startswith('* ')
            ]
        
        # Extract important notes
        notes_match = re.search(r"\*\*Important Notes:\*\*(.*)", text, re.DOTALL)
        if notes_match:
            parsed_plan["notes"] = [
                note.strip()[2:] for note in notes_match.group(1).split('\n') 
                if note.strip() and note.strip().startswith('* ')
            ]
        
        return parsed_plan

    @staticmethod
    def format_diet_plan_message(parsed_plan: Dict) -> str:
        """Improved message formatting with better fallbacks"""
        message = "🍽️ *Your Personalized Diet Plan* 🍽️\n\n"
        
        if not parsed_plan or 'meals' not in parsed_plan:
            return "⚠️ Sorry, I couldn't generate a proper diet plan. Please try again."
        
        # Overview
        message += "📋 *Overview:*\n"
        message += parsed_plan.get('overview', 'A healthy diet plan tailored to your preferences.') + "\n\n"
        
        # Meals
        for meal_type in ['breakfast', 'lunch', 'dinner']:
            meal_data = parsed_plan['meals'].get(meal_type, {})
            message += f"🍳 *{meal_type.capitalize()}:*\n"
            message += f"*{meal_data.get('name', f'Delicious {meal_type}')}*\n\n"
            
            message += "*Ingredients:*\n"
            for ingredient in meal_data.get('ingredients', ['No specific ingredients listed']):
                message += f"• {ingredient}\n"
            
            message += "\n*Instructions:*\n"
            for i, instruction in enumerate(meal_data.get('instructions', ['No specific instructions provided']), 1):
                message += f"{i}. {instruction}\n"
            
            message += "\n"
        
        # Snacks
        message += "🥜 *Snack Options:*\n"
        for snack in parsed_plan['meals'].get('snacks', ['No specific snacks suggested']):
            message += f"• {snack}\n"
        
        # Notes
        message += "\n⚠️ *Important Notes:*\n"
        for note in parsed_plan.get('notes', [
            "Consult a healthcare professional before starting any new diet.",
            "Adjust portions based on your needs.",
            "Stay hydrated and maintain balance."
        ]):
            message += f"• {note}\n"
        
        return message

async def send_message_in_chunks(text: str, chat_id: int, bot, parse_mode="Markdown"):
    """Improved message chunking with error handling"""
    max_length = 4096  # Telegram's message limit
    chunks = [text[i:i+max_length] for i in range(0, len(text), max_length)]
    
    for chunk in chunks:
        try:
            await bot.send_message(
                chat_id=chat_id,
                text=chunk,
                parse_mode=parse_mode
            )
            await asyncio.sleep(0.3)  # Prevent rate limiting
        except Exception as e:
            logger.error(f"Error sending message chunk: {e}")
            try:
                await bot.send_message(chat_id=chat_id, text=chunk)
            except Exception as e:
                logger.error(f"Failed to send plain text chunk: {e}")

async def set_meal_reminders(update: Update, context: CallbackContext, diet_plan: str):
    """Improved reminder setup with async support"""
    user_id = update.message.chat_id
    meals = {
        "Breakfast": {"hour": 8, "emoji": "☀️"},
        "Lunch": {"hour": 13, "emoji": "🌞"},
        "Dinner": {"hour": 20, "emoji": "🌙"}
    }
    
    reminder_msg = "⏰ *Meal Reminders Set:*\n"
    for meal, details in meals.items():
        reminder_msg += f"{details['emoji']} *{meal}* at {details['hour']}:00\n"
    
    await context.bot.send_message(
        chat_id=user_id,
        text=reminder_msg,
        parse_mode="Markdown"
    )

def get_diet_plan(user_data: Dict) -> str:
    """Improved Gemini API request with better prompt and error handling"""
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key={GEMINI_API_KEY}"
    
    prompt = f"""
    Create a detailed personalized diet plan for a {user_data['diet_type']} person with these characteristics:
    - Chronic disease: {user_data['chronic_disease']}
    - Favorite meals: {user_data['meal_prefs']}
    - Spice preference: {user_data['spice_level']}
    - Allergies: {user_data['allergies']}

    Suggest a suitable diet plan for a 4-year-old female child weighing 13.25 kg, diagnosed with an upper respiratory tract infection (URTI) and prescribed Calpol (for fever), Delcon (for cold), Levolin (for breathing issues), and Meftal-P (for pain relief). The diet should include easily digestible, nutritious foods that help with recovery, hydration, and boosting immunity. Avoid foods that may worsen congestion or irritate the throat
    
    Provide the response in this EXACT format:
    
    **Overview:** [2-3 sentence overview of the diet plan]
    
    **Breakfast:**
    **Meal Name:** [name]
    **Ingredients:**
    - [ingredient 1]
    - [ingredient 2]
    **Instructions:**
    1. [step 1]
    2. [step 2]
    
    **Lunch:** [same format as breakfast]
    
    **Dinner:** [same format as breakfast]
    
    **Snacks:**
    * [snack 1]
    * [snack 2]
    
    **Important Notes:**
    * [note 1]
    * [note 2]
    """
    
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()
        response_data = response.json()
        
        if not response_data.get('candidates'):
            return "Error: No candidates in API response"
            
        candidate = response_data['candidates'][0]
        if 'content' not in candidate or 'parts' not in candidate['content']:
            return "Error: Malformed API response"
            
        return candidate['content']['parts'][0].get('text', "Error: Empty response text")
        
    except requests.exceptions.RequestException as e:
        logger.error(f"API Error: {e}")
        return f"API Error: {str(e)}"
    except Exception as e:
        logger.error(f"Unexpected Error: {e}")
        return f"Unexpected Error: {str(e)}"

async def get_recipe_from_photo(photo_file, user_data: Dict) -> str:
    """Use EasyOCR to extract ingredients and generate a recipe"""
    try:
        # Download the photo as bytes
        photo_bytes = await photo_file.download_as_bytearray()
        
        # Convert to bytes (if it's not already)
        if isinstance(photo_bytes, bytearray):
            photo_bytes = bytes(photo_bytes)
        
        # Use EasyOCR to extract text
        result = reader.readtext(photo_bytes)
        ingredients_text = " ".join([detection[1] for detection in result])
        
        if not ingredients_text.strip():
            return "⚠️ Couldn't identify any ingredients in the photo. Please try with clearer text or type ingredients."
        
        # Generate recipe using Gemini API
        return await generate_recipe_from_text(ingredients_text, user_data)
        
    except Exception as e:
        logger.error(f"Error processing photo: {e}")
        return f"Error processing photo: {str(e)}"

async def generate_recipe_from_text(ingredients: str, user_data: Dict) -> str:
    """Generate recipe from text ingredients using Gemini API"""
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key={GEMINI_API_KEY}"
    
    prompt = f"""
    Create a healthy recipe using these ingredients: {ingredients}
    
    Dietary Requirements:
    - Diet: {user_data.get('diet_type', 'No restrictions')}
    - Allergies: {user_data.get('allergies', 'None')}
    - Health Condition: {user_data.get('chronic_disease', 'None')}
    - Spice Level: {user_data.get('spice_level', 'Medium')}
    
    Format:
    
    🍴 **Recipe Name**: [Creative name]
    
    📝 **Ingredients**:
    - [Ingredient 1]
    - [Ingredient 2]
    
    👩‍🍳 **Instructions**:
    1. [Step 1]
    2. [Step 2]
    
    ⏱ **Prep Time**: [X mins]
    🔥 **Difficulty**: [Easy/Medium/Hard]
    """
    
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        logger.error(f"Error generating recipe: {e}")
        return f"⚠️ Failed to generate recipe. Error: {str(e)}"

async def start(update: Update, context: CallbackContext) -> int:
    try:
        await update.message.reply_text(
            "Welcome to DietBot! 🍎\n\n"
            "I'll create a personalized diet plan for you.\n"
            "First, what's your name?"
        )
        return NAME
    except Exception as e:
        logger.error(f"Error in start: {e}")
        return ConversationHandler.END

async def name(update: Update, context: CallbackContext) -> int:
    try:
        context.user_data["name"] = update.message.text
        reply_keyboard = [["Vegetarian", "Non-Vegetarian", "Vegan", "Eggetarian"]]
        await update.message.reply_text(
            "What type of diet do you follow?",
            reply_markup=ReplyKeyboardMarkup(
                reply_keyboard,
                one_time_keyboard=True,
                input_field_placeholder="Select diet type..."
            )
        )
        return DIET_TYPE
    except Exception as e:
        logger.error(f"Error in name: {e}")
        return ConversationHandler.END

async def diet_type(update: Update, context: CallbackContext) -> int:
    try:
        context.user_data["diet_type"] = update.message.text
        await update.message.reply_text(
            "List some of your favorite meals (comma separated):\n\n"
            "Example: Pasta, Grilled chicken, Salad"
        )
        return MEAL_PREFS
    except Exception as e:
        logger.error(f"Error in diet_type: {e}")
        return ConversationHandler.END

async def meal_prefs(update: Update, context: CallbackContext) -> int:
    try:
        context.user_data["meal_prefs"] = update.message.text
        reply_keyboard = [["Mild", "Medium", "Spicy", "Very Spicy"]]
        await update.message.reply_text(
            "What's your preferred spice level?",
            reply_markup=ReplyKeyboardMarkup(
                reply_keyboard,
                one_time_keyboard=True,
                input_field_placeholder="Select spice level..."
            )
        )
        return SPICE_LEVEL
    except Exception as e:
        logger.error(f"Error in meal_prefs: {e}")
        return ConversationHandler.END

async def spice_level(update: Update, context: CallbackContext) -> int:
    try:
        context.user_data["spice_level"] = update.message.text
        await update.message.reply_text(
            "Do you have any food allergies? (Type 'None' if none)\n\n"
            "Example: Peanuts, Shellfish, Dairy"
        )
        return ALLERGIES
    except Exception as e:
        logger.error(f"Error in spice_level: {e}")
        return ConversationHandler.END

async def allergies(update: Update, context: CallbackContext) -> int:
    try:
        context.user_data["allergies"] = update.message.text
        await update.message.reply_text(
            "Do you have any chronic diseases or conditions?\n\n"
            "Examples: Diabetes, Hypertension, None"
        )
        return CHRONIC_DISEASE
    except Exception as e:
        logger.error(f"Error in allergies: {e}")
        return ConversationHandler.END

async def chronic_disease(update: Update, context: CallbackContext) -> int:
    try:
        context.user_data["chronic_disease"] = update.message.text
        
        # Save to CSV
        with open(CSV_FILE, "a", newline="", encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([
                update.message.from_user.id,
                context.user_data["name"],
                context.user_data["diet_type"],
                context.user_data["meal_prefs"],
                context.user_data["spice_level"],
                context.user_data["allergies"],
                context.user_data["chronic_disease"]
            ])
        
        # Show typing indicator
        await context.bot.send_chat_action(
            chat_id=update.message.chat_id,
            action="typing"
        )
        
        # Get diet plan
        diet_plan_text = get_diet_plan(context.user_data)
        
        if "Error" in diet_plan_text:
            await update.message.reply_text(
                f"⚠️ Failed to generate diet plan:\n{diet_plan_text}\n\n"
                "Please try the /start command again."
            )
            return ConversationHandler.END
            
        # Parse and format
        parsed_plan = DietPlanParser.parse_diet_plan(diet_plan_text)
        formatted_msg = DietPlanParser.format_diet_plan_message(parsed_plan)
        
        # Send plan
        await send_message_in_chunks(formatted_msg, update.message.chat_id, context.bot)
        
        # Set reminders
        await set_meal_reminders(update, context, parsed_plan)
        
        # Ask if they want to upload a photo of their ingredients
        await update.message.reply_text(
            "📸 Would you like to upload a photo of vegetables/ingredients you have "
            "so I can suggest a specific recipe? (Send a photo or type /done to finish)"
        )
        
        return PHOTO_HANDLER
        
    except Exception as e:
        logger.error(f"Error in chronic_disease: {e}")
        await update.message.reply_text(
            "⚠️ An error occurred while generating your diet plan. "
            "Please try the /start command again."
        )
        return ConversationHandler.END

async def handle_photo(update: Update, context: CallbackContext) -> int:
    try:
        if not update.message.photo:
            await update.message.reply_text("Please send a clear photo of ingredients.")
            return PHOTO_HANDLER
            
        photo_file = await update.message.photo[-1].get_file()
        
        await context.bot.send_chat_action(
            chat_id=update.message.chat_id,
            action="typing"
        )
        
        recipe = await get_recipe_from_photo(photo_file, context.user_data)
        
        if recipe.startswith("⚠️ Couldn't identify any ingredients"):
            await update.message.reply_text(
                "I couldn't read the ingredients from the photo. "
                "Please type them out for me (comma separated):\n\n"
                "Example: capsicum, brinjal, tomatoes"
            )
            return INGREDIENTS_INPUT
        else:
            await send_message_in_chunks(recipe, update.message.chat_id, context.bot)
            return ConversationHandler.END
            
    except Exception as e:
        logger.error(f"Error in handle_photo: {e}")
        await update.message.reply_text(
            "⚠️ Couldn't process the photo. Please type your ingredients instead.\n\n"
            "Example: capsicum, brinjal, tomatoes"
        )
        return INGREDIENTS_INPUT

async def process_ingredients(update: Update, context: CallbackContext) -> int:
    try:
        ingredients = update.message.text
        
        await context.bot.send_chat_action(
            chat_id=update.message.chat_id,
            action="typing"
        )
        
        # Generate recipe from text input
        recipe = await generate_recipe_from_text(ingredients, context.user_data)
        await send_message_in_chunks(recipe, update.message.chat_id, context.bot)
        
        return ConversationHandler.END
        
    except Exception as e:
        logger.error(f"Error processing ingredients: {e}")
        await update.message.reply_text(
            "⚠️ An error occurred. Please try again or type /done to finish."
        )
        return INGREDIENTS_INPUT

async def done(update: Update, context: CallbackContext) -> int:
    await update.message.reply_text(
        "Great! Your diet plan is complete. 🎉\n\n"
        "You can always start over with /start if you need to make changes."
    )
    return ConversationHandler.END

async def error_handler(update: Update, context: CallbackContext) -> None:
    """Log errors caused by updates."""
    logger.error(f"Update {update} caused error {context.error}")
    await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text="⚠️ An error occurred. Please try again or use /start to begin anew."
    )

def main() -> None:
    """Run the bot."""
    try:
        application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
        
        conv_handler = ConversationHandler(
            entry_points=[CommandHandler("start", start)],
            states={
                NAME: [MessageHandler(filters.TEXT & ~filters.COMMAND, name)],
                DIET_TYPE: [MessageHandler(filters.TEXT & ~filters.COMMAND, diet_type)],
                MEAL_PREFS: [MessageHandler(filters.TEXT & ~filters.COMMAND, meal_prefs)],
                SPICE_LEVEL: [MessageHandler(filters.TEXT & ~filters.COMMAND, spice_level)],
                ALLERGIES: [MessageHandler(filters.TEXT & ~filters.COMMAND, allergies)],
                CHRONIC_DISEASE: [MessageHandler(filters.TEXT & ~filters.COMMAND, chronic_disease)],
                PHOTO_HANDLER: [
                    MessageHandler(filters.PHOTO, handle_photo),
                    CommandHandler("done", done)
                ],
                INGREDIENTS_INPUT: [
                    MessageHandler(filters.TEXT & ~filters.COMMAND, process_ingredients),
                    CommandHandler("done", done)
                ],
            },
            fallbacks=[CommandHandler("cancel", lambda update, context: update.message.reply_text("Operation cancelled."))],
        )
        
        application.add_handler(conv_handler)
        application.add_error_handler(error_handler)
        
        logger.info("Starting bot...")
        application.run_polling()
        
    except Exception as e:
        logger.error(f"Fatal error in main: {e}")

if __name__ == "__main__":
    main()