import telebot
import easyocr
import cv2
import numpy as np
from PIL import Image
import os
import json
import time
import re
import uuid
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv
import google.generativeai as genai
from telebot.types import ReplyKeyboardMarkup, KeyboardButton
from gtts import gTTS
import shutil

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='med_remind.log'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN_MED")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY_MED")

# Validate environment variables
if not TELEGRAM_TOKEN or not GEMINI_API_KEY:
    logger.error("Missing environment variables. Please check your .env file.")
    raise ValueError("Telegram Token or Gemini API Key is missing")

bot = telebot.TeleBot(TELEGRAM_TOKEN, threaded=False)

# File paths
REMINDER_FILE = "medicine_reminders.json"
MEDICAL_RECORDS_FILE = "user_medical_records.json"
BACKUP_DIR = "backups"

# Define standard meal times
MEAL_TIMES = {
    "morning": "08:00:00",  # After breakfast
    "afternoon": "13:00:00",  # After lunch
    "night": "20:00:00"  # After dinner
}

# Create necessary directories
os.makedirs('medical_records', exist_ok=True)
os.makedirs('prescriptions', exist_ok=True)
os.makedirs('reminders_audio', exist_ok=True)
os.makedirs(BACKUP_DIR, exist_ok=True)

def backup_data():
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        for filename in [REMINDER_FILE, MEDICAL_RECORDS_FILE]:
            if os.path.exists(filename):
                backup_path = os.path.join(BACKUP_DIR, f"{os.path.basename(filename)}.bak_{timestamp}")
                shutil.copyfile(filename, backup_path)
                logger.info(f"Created backup: {backup_path}")
    except Exception as e:
        logger.error(f"Backup failed: {e}")

def load_json_data(filename):
    try:
        if os.path.exists(filename):
            with open(filename, 'r') as file:
                data = json.load(file)
                if data is None:  # Handle empty files
                    return []
                return data if isinstance(data, list) else [data]
        return []
    except json.JSONDecodeError:
        logger.error(f"Invalid JSON in {filename}, returning empty list")
        return []
    except Exception as e:
        logger.error(f"Error loading {filename}: {e}")
        return []

def save_json_data(data, filename, append=False):
    try:
        if append and os.path.exists(filename):
            existing_data = load_json_data(filename)
            if isinstance(existing_data, list) and isinstance(data, list):
                existing_data.extend(data)
                data = existing_data
        
        with open(filename, "w") as file:
            json.dump(data, file, indent=4)
        
        backup_data()
        return True
    except Exception as e:
        logger.error(f"Error saving JSON to {filename}: {e}")
        return False

def clean_old_reminders():
    try:
        reminders = load_json_data(REMINDER_FILE)
        if not reminders:
            return
        
        now = datetime.now()
        cutoff = now - timedelta(days=30)  # Keep reminders for 30 days
        
        cleaned = [
            r for r in reminders 
            if datetime.strptime(r["time"], "%Y-%m-%d %H:%M:%S") > cutoff
        ]
        
        if len(cleaned) < len(reminders):
            save_json_data(cleaned, REMINDER_FILE, append=False)
            logger.info(f"Cleaned {len(reminders) - len(cleaned)} old reminders")
    except Exception as e:
        logger.error(f"Error cleaning old reminders: {e}")

def analyze_prescription_with_gemini(text: str) -> dict:
    if not text or len(text) < 5:
        logger.warning("Insufficient prescription text")
        return {"medicines": []}

    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-pro")
        prompt = (
            "Extract structured medical information from this prescription text. "
            "Provide details in JSON format with the following structure:\n"
            "{\n"
            "  'medicines': [\n"
            "    {'name': '', 'dosage': '', 'frequency': ''}\n"
            "  ],\n"
            "  'notes': ''\n"
            "}\n\n"
            "Rules:\n"
            "1. If frequency is not clear, assume 'twice daily'\n"
            "2. If dosage is not clear, assume '1 tablet'\n"
            "3. Return empty array if no medicines found\n\n"
            "Prescription Text:\n" + text
        )

        response = model.generate_content(prompt)
        raw_response = response.text.strip()
        logger.info(f"Gemini Raw Response: {raw_response}")

        # Clean the response and extract JSON
        json_match = re.search(r'\{[\s\S]*\}', raw_response)
        if not json_match:
            logger.warning("No JSON found in Gemini response")
            return {"medicines": []}

        json_text = json_match.group(0)
        # Remove markdown code blocks if present
        json_text = re.sub(r'```json|```', '', json_text).strip()
        
        try:
            result = json.loads(json_text)
            if not isinstance(result.get("medicines", []), list):
                result["medicines"] = []
            return result
        except json.JSONDecodeError as e:
            logger.error(f"JSON Parsing Error: {e}\nText: {json_text}")
            return {"medicines": []}

    except Exception as e:
        logger.error(f"Gemini analysis error: {e}")
        return {"medicines": []}

def save_medical_record(chat_id, file_name, record_details):
    try:
        records = load_json_data(MEDICAL_RECORDS_FILE)
        if not isinstance(records, list):
            records = []

        user_record = next((r for r in records if str(r["chat_id"]) == str(chat_id)), None)

        if user_record:
            if "medical_reports" not in user_record:
                user_record["medical_reports"] = []
            
            # Check for duplicate file names
            if not any(report["file_name"] == file_name for report in user_record["medical_reports"]):
                user_record["medical_reports"].append({
                    "file_name": file_name,
                    "upload_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "record_details": record_details
                })
            else:
                logger.warning(f"Duplicate file name detected: {file_name}")
                return False
        else:
            user_record = {
                "chat_id": str(chat_id),
                "medical_reports": [{
                    "file_name": file_name,
                    "upload_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "record_details": record_details
                }]
            }
            records.append(user_record)

        return save_json_data(records, MEDICAL_RECORDS_FILE, append=False)
    except Exception as e:
        logger.error(f"Error saving medical record: {e}")
        return False

def set_medicine_reminders(prescription_data, chat_id):
    try:
        reminders = load_json_data(REMINDER_FILE)
        if not isinstance(reminders, list):
            reminders = []

        chat_id = str(chat_id)
        reminder_messages = []
        medicines_added = []

        for medicine in prescription_data.get('medicines', []):
            if not medicine.get("name"):
                continue

            medicine_name = medicine['name'].strip()
            if not medicine_name:
                continue

            # Check if this medicine already has reminders
            existing_indices = [
                i for i, r in enumerate(reminders)
                if str(r["chat_id"]) == chat_id and r["medicine"].lower() == medicine_name.lower()
            ]

            # Remove existing reminders for this medicine
            for i in sorted(existing_indices, reverse=True):
                reminders.pop(i)

            frequency = medicine.get('frequency', 'twice daily').lower()
            dosage = medicine.get('dosage', '1 tablet')
            times = []

            if "morning" in frequency or "twice daily" in frequency or "bd" in frequency:
                times.append(MEAL_TIMES["morning"])
            if "afternoon" in frequency or "thrice daily" in frequency or "tid" in frequency:
                times.append(MEAL_TIMES["afternoon"])
            if "night" in frequency or "evening" in frequency or "twice daily" in frequency or "bd" in frequency:
                times.append(MEAL_TIMES["night"])
            if "once daily" in frequency or "od" in frequency:
                times.append(MEAL_TIMES["morning"])  # Default to morning if "once daily"

            # If no times detected, default to morning and night
            if not times:
                times = [MEAL_TIMES["morning"], MEAL_TIMES["night"]]

            for reminder_time in times:
                reminder_datetime = datetime.strptime(reminder_time, "%H:%M:%S").replace(
                    year=datetime.now().year,
                    month=datetime.now().month,
                    day=datetime.now().day
                )

                reminder = {
                    "chat_id": chat_id,
                    "medicine": medicine_name,
                    "dosage": dosage,
                    "message": f"Take {medicine_name} {dosage}",
                    "time": reminder_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                    "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
                reminders.append(reminder)

            medicines_added.append(medicine_name)
            reminder_messages.append(f"- {medicine_name} ({dosage}) – {frequency.capitalize()}")

        if save_json_data(reminders, REMINDER_FILE, append=False):
            return True, "\n".join(reminder_messages) if reminder_messages else "No reminders set"
        else:
            return False, "Failed to save reminders"

    except Exception as e:
        logger.error(f"Error setting reminders: {e}")
        return False, f"Error: {str(e)}"

def process_prescription(message, is_photo=False):
    try:
        chat_id = message.chat.id
        if is_photo:
            if not message.photo:
                bot.send_message(chat_id, "❌ Please send a clear photo of your prescription.")
                return

            file_info = bot.get_file(message.photo[-1].file_id)
            downloaded_file = bot.download_file(file_info.file_path)
            
            file_extension = file_info.file_path.split('.')[-1].lower()
            if file_extension not in ['jpg', 'jpeg', 'png']:
                bot.send_message(chat_id, "❌ Unsupported file format. Please send JPG or PNG.")
                return

            unique_filename = f"prescription_{str(uuid.uuid4())}.{file_extension}"
            file_path = os.path.join('prescriptions', unique_filename)
            
            with open(file_path, 'wb') as new_file:
                new_file.write(downloaded_file)
            
            try:
                image = np.array(Image.open(file_path))
                reader = easyocr.Reader(['en'])
                extracted_text = " ".join(reader.readtext(image, detail=0))
                
                if not extracted_text.strip():
                    bot.send_message(chat_id, "⚠️ Couldn't read text from the image. Please send a clearer photo.")
                    return
                
                bot.send_message(chat_id, "🔍 Extracted prescription text:\n\n" + extracted_text[:1000] + ("..." if len(extracted_text) > 1000 else ""))
            except Exception as e:
                logger.error(f"OCR Error: {e}")
                bot.send_message(chat_id, "❌ Error processing the image. Please try again.")
                return
            finally:
                if os.path.exists(file_path):
                    os.remove(file_path)
        else:
            extracted_text = message.text
            if len(extracted_text) < 10:
                bot.send_message(chat_id, "❌ Prescription text is too short. Please provide more details.")
                return

        prescription_data = analyze_prescription_with_gemini(extracted_text)
        
        if not prescription_data.get('medicines'):
            bot.send_message(
                chat_id, 
                "❌ No medicines detected in the prescription. Please ensure:\n"
                "- The text is clear and complete\n"
                "- Medicine names are visible\n"
                "- Or send the prescription as text if the photo isn't clear"
            )
            return

        success, reminder_text = set_medicine_reminders(prescription_data, chat_id)
        
        if success:
            response = (
                f"✅ Prescription Processed Successfully!\n\n"
                f"💊 Medicines Detected:\n{reminder_text}\n\n"
                f"⏰ Reminders have been set for these medicines.\n"
                f"You'll receive notifications at the specified times."
            )
            
            if prescription_data.get('notes'):
                response += f"\n\n📝 Doctor's Notes:\n{prescription_data['notes']}"
            
            bot.send_message(chat_id, response)
        else:
            bot.send_message(chat_id, "❌ Failed to set reminders. Please try again.")

    except Exception as e:
        logger.error(f"Prescription processing error: {e}")
        bot.send_message(message.chat.id, f"❌ Error processing prescription: {str(e)}")

def process_medical_record(message):
    try:
        chat_id = message.chat.id
        if not message.photo:
            bot.send_message(chat_id, "❌ Please upload a valid medical report (JPG/PNG).")
            return
        
        file_info = bot.get_file(message.photo[-1].file_id)
        downloaded_file = bot.download_file(file_info.file_path)
        
        file_extension = file_info.file_path.split('.')[-1].lower()
        if file_extension not in ['jpg', 'jpeg', 'png']:
            bot.send_message(chat_id, "❌ Unsupported file format. Please send JPG or PNG.")
            return

        unique_filename = f"medical_record_{str(uuid.uuid4())}.{file_extension}"
        file_path = os.path.join('medical_records', unique_filename)
        
        with open(file_path, 'wb') as new_file:
            new_file.write(downloaded_file)

        # Extract text using OCR
        try:
            image = np.array(Image.open(file_path))
            reader = easyocr.Reader(['en'])
            extracted_text = " ".join(reader.readtext(image, detail=0))

            if not extracted_text.strip():
                bot.send_message(chat_id, "⚠️ No text detected in the image. Please upload a clearer document.")
                return
        except Exception as e:
            logger.error(f"OCR Error: {e}")
            bot.send_message(chat_id, "❌ Error processing the document. Please try again.")
            return

        # Analyze the extracted text with Gemini
        try:
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-pro")
            
            summary_prompt = (
                "Analyze this medical document thoroughly and provide a detailed summary. "
                "Structure the response as JSON with these fields:\n"
                "{\n"
                "  'type': 'Report type (e.g., Blood Test, X-Ray)',\n"
                "  'date': 'Report date if available',\n"
                "  'patient_info': 'Brief patient info if present',\n"
                "  'key_findings': ['List of important findings'],\n"
                "  'diagnosis': ['List of diagnoses if any'],\n"
                "  'recommendations': ['List of recommendations'],\n"
                "  'summary': 'Concise overall summary'\n"
                "}\n\n"
                "Document Text:\n" + extracted_text[:10000]  # Limit to first 10k characters
            )

            response = model.generate_content(summary_prompt)
            raw_response = response.text.strip()
            logger.info(f"Gemini Medical Record Analysis: {raw_response}")

            # Extract JSON from response
            json_match = re.search(r'\{[\s\S]*\}', raw_response)
            
            if not json_match:
                record_details = {
                    "type": "Medical Record",
                    "summary": "Could not automatically analyze this document. Please consult your doctor."
                }
            else:
                json_text = json_match.group(0)
                # Clean the JSON string
                json_text = re.sub(r'```json|```', '', json_text).strip()
                try:
                    record_details = json.loads(json_text)
                except json.JSONDecodeError:
                    record_details = {
                        "type": "Medical Record",
                        "summary": raw_response[:500] + ("..." if len(raw_response) > 500 else "")
                    }

        except Exception as gemini_error:
            logger.error(f"Gemini analysis error: {gemini_error}")
            record_details = {
                "type": "Medical Record",
                "summary": "Could not analyze document due to technical error."
            }

        # Store structured data
        if save_medical_record(chat_id, unique_filename, record_details):
            # Prepare response message
            response_text = (
                f"✅ Medical Record Uploaded Successfully!\n\n"
                f"📄 Type: {record_details.get('type', 'Unknown')}\n"
            )
            
            if 'date' in record_details:
                response_text += f"📅 Date: {record_details['date']}\n"
            
            if 'key_findings' in record_details and record_details['key_findings']:
                response_text += "\n🔍 Key Findings:\n"
                response_text += "\n".join(f"- {finding}" for finding in record_details['key_findings']) + "\n"
            
            if 'diagnosis' in record_details and record_details['diagnosis']:
                response_text += "\n🩺 Diagnosis:\n"
                response_text += "\n".join(f"- {d}" for d in record_details['diagnosis']) + "\n"
            
            if 'recommendations' in record_details and record_details['recommendations']:
                response_text += "\n💡 Recommendations:\n"
                response_text += "\n".join(f"- {r}" for r in record_details['recommendations']) + "\n"
            
            response_text += f"\n📋 Summary: {record_details.get('summary', 'No summary available')}"
            
            bot.reply_to(message, response_text)
        else:
            bot.reply_to(message, "❌ Failed to save medical record. Please try again.")

    except Exception as e:
        logger.error(f"Medical record processing error: {e}")
        bot.send_message(message.chat.id, f"❌ Error processing medical record: {str(e)}")
    finally:
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)

def view_medical_records(message):
    try:
        # Load medical records data with proper error handling
        try:
            medical_records = load_json_data(MEDICAL_RECORDS_FILE)
            if not isinstance(medical_records, list):
                logger.warning("Medical records data is not a list, converting to empty list")
                medical_records = []
        except Exception as e:
            logger.error(f"Failed to load medical records: {e}")
            medical_records = []

        user_id = str(message.chat.id)
        user_records = []

        # Find all records for this user
        for record in medical_records:
            try:
                if str(record.get("chat_id")) == user_id:
                    user_records.append(record)
            except Exception as e:
                logger.error(f"Error processing record: {e}")
                continue

        if not user_records:
            bot.send_message(
                message.chat.id,
                "📭 You don't have any medical records stored yet.\n\n"
                "Use /upload_medical to add your first medical report."
            )
            return

        # Prepare and send the records
        response_text = "🏥 Your Medical Records:\n\n"
        records_found = False

        for record in user_records:
            if not record.get("medical_reports"):
                continue

            records_found = True
            for report in record["medical_reports"]:
                details = report.get("record_details", {})
                response_text += (
                    f"📄 File: {report.get('file_name', 'Unknown')}\n"
                    f"📅 Uploaded: {report.get('upload_time', 'Unknown date')}\n"
                    f"🔍 Type: {details.get('type', 'Unspecified')}\n"
                )

                if 'date' in details:
                    response_text += f"🗓 Report Date: {details['date']}\n"

                if 'key_findings' in details and details['key_findings']:
                    if isinstance(details['key_findings'], list):
                        response_text += "📌 Key Findings:\n" + "\n".join(f"- {f}" for f in details['key_findings']) + "\n"
                    else:
                        response_text += f"📌 Key Findings: {details['key_findings']}\n"

                response_text += "-------------------------\n"

        if not records_found:
            bot.send_message(
                message.chat.id,
                "📭 You don't have any complete medical records yet.\n\n"
                "Use /upload_medical to add your first medical report."
            )
            return

        # Split long messages to avoid Telegram's limit
        if len(response_text) > 4000:
            parts = [response_text[i:i+4000] for i in range(0, len(response_text), 4000)]
            for part in parts:
                bot.send_message(message.chat.id, part)
        else:
            bot.send_message(message.chat.id, response_text)

    except Exception as e:
        logger.error(f"Error in view_medical_records: {str(e)}", exc_info=True)
        bot.send_message(
            message.chat.id,
            "❌ An error occurred while retrieving your medical records.\n"
            "This has been logged and will be investigated.\n\n"
            "Please try again later or contact support if the problem persists."
        )

def check_reminders():
    while True:
        try:
            reminders = load_json_data(REMINDER_FILE)
            now = datetime.now()

            reminders_to_keep = []
            reminders_sent = 0

            for reminder in reminders:
                try:
                    reminder_time = datetime.strptime(reminder["time"], "%Y-%m-%d %H:%M:%S")

                    # Check if it's time to send this reminder (within 1 minute window)
                    if 0 <= (now - reminder_time).total_seconds() < 60:
                        chat_id = reminder["chat_id"]
                        reminder_text = f"⏰ Reminder: {reminder['message']}"

                        # Send text reminder
                        bot.send_message(chat_id, reminder_text)

                        # Generate and send voice reminder
                        try:
                            tts = gTTS(text=reminder_text, lang="en")
                            audio_filename = f"reminder_{reminder['chat_id']}_{reminder_time.strftime('%Y%m%d_%H%M')}.mp3"
                            audio_path = os.path.join("reminders_audio", audio_filename)

                            tts.save(audio_path)
                            with open(audio_path, "rb") as audio:
                                bot.send_voice(chat_id, audio)
                            
                            os.remove(audio_path)
                        except Exception as e:
                            logger.error(f"Voice reminder error: {e}")

                        reminders_sent += 1
                    
                    # Keep only future reminders
                    if now < reminder_time:
                        reminders_to_keep.append(reminder)

                except Exception as e:
                    logger.error(f"Error processing reminder: {e}")
                    reminders_to_keep.append(reminder)  # Keep it to avoid data loss

            # Save only the reminders we're keeping
            if reminders_sent > 0 or len(reminders_to_keep) != len(reminders):
                save_json_data(reminders_to_keep, REMINDER_FILE, append=False)

            # Clean old reminders weekly
            if now.weekday() == 0 and now.hour == 1:  # Every Monday at 1 AM
                clean_old_reminders()

        except Exception as e:
            logger.error(f"Reminder checking error: {e}")

        time.sleep(60)  # Check every minute

@bot.message_handler(commands=['start'])
def send_welcome(message):
    welcome_text = (
        "👋 Welcome to MedGuardian - Your Personal Medication Assistant!\n\n"
        "💊 I can help you:\n"
        "- Set medication reminders from prescriptions\n"
        "- Store and analyze medical records\n"
        "- Never miss a dose again\n\n"
        "📋 Main Commands:\n"
        "/medicine - Upload a prescription\n"
        "/upload_medical - Store medical reports\n"
        "/view_medical - View your records\n"
        "/remove_pres - Remove a medication reminder"
    )
    bot.send_message(message.chat.id, welcome_text)

@bot.message_handler(commands=['medicine', 'prescription'])
def handle_medicine_command(message):
    bot.send_message(
        message.chat.id,
        "📋 Prescription Upload\n\n"
        "Please send your prescription:\n"
        "- As a clear photo (preferred)\n"
        "- Or as text with medicine details\n\n"
        "Include:\n"
        "- Medicine names\n"
        "- Dosages\n"
        "- Frequencies (e.g., 'twice daily')"
    )
    bot.register_next_step_handler(message, lambda m: process_prescription(m, is_photo=False))

@bot.message_handler(commands=['upload_medical', 'uploadMedical'])
def handle_upload_medical(message):
    bot.send_message(
        message.chat.id,
        "🏥 Medical Record Upload\n\n"
        "Please upload your medical report:\n"
        "- Supported formats: JPG, PNG\n"
        "- Ensure the document is clear\n"
        "- One file at a time\n\n"
        "I'll analyze and store it for you!"
    )
    bot.register_next_step_handler(message, process_medical_record)

@bot.message_handler(commands=['view_medical', 'viewMedical'])
def handle_view_medical(message):
    view_medical_records(message)

@bot.message_handler(commands=['remove_pres', 'removePres'])
def list_prescriptions_to_remove(message):
    chat_id = message.chat.id
    reminders = load_json_data(REMINDER_FILE)

    user_reminders = [r for r in reminders if str(r["chat_id"]) == str(chat_id)]

    if not user_reminders:
        bot.send_message(chat_id, "✅ You don't have any active medication reminders.")
        return

    # Group by medicine name
    medicine_map = {}
    for reminder in user_reminders:
        name = reminder["medicine"]
        if name not in medicine_map:
            medicine_map[name] = {
                "dosage": reminder.get("dosage", "1 tablet"),
                "times": set()
            }
        medicine_map[name]["times"].add(reminder["time"].split()[1][:5])  # Just the time part

    response_text = "💊 Your Active Medications:\n\n"
    keyboard = ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
    
    for idx, (name, details) in enumerate(medicine_map.items(), start=1):
        times = ", ".join(sorted(details["times"]))
        response_text += f"{idx}. {name} ({details['dosage']}) - Times: {times}\n"
        keyboard.add(KeyboardButton(str(idx)))

    response_text += "\nSelect a number to remove that medication."
    bot.send_message(chat_id, response_text, reply_markup=keyboard)
    bot.register_next_step_handler(message, remove_selected_prescription)

def remove_selected_prescription(message):
    chat_id = message.chat.id
    reminders = load_json_data(REMINDER_FILE)
    user_reminders = [r for r in reminders if str(r["chat_id"]) == str(chat_id)]

    if not user_reminders:
        bot.send_message(chat_id, "❌ No active medication reminders found.")
        return

    try:
        selected_index = int(message.text) - 1
        medicine_map = {}
        for reminder in user_reminders:
            name = reminder["medicine"]
            if name not in medicine_map:
                medicine_map[name] = []

            medicine_map[name].append(reminder)

        medicine_names = list(medicine_map.keys())
        
        if selected_index < 0 or selected_index >= len(medicine_names):
            bot.send_message(chat_id, "⚠️ Invalid selection. Please try again.")
            return

        medicine_to_remove = medicine_names[selected_index]
        
        # Remove all reminders for this medicine
        new_reminders = [
            r for r in reminders 
            if not (str(r["chat_id"]) == str(chat_id) and r["medicine"] == medicine_to_remove)
        ]

        if save_json_data(new_reminders, REMINDER_FILE, append=False):
            bot.send_message(
                chat_id,
                f"✅ Successfully removed all reminders for {medicine_to_remove}.",
                reply_markup=telebot.types.ReplyKeyboardRemove()
            )
        else:
            bot.send_message(
                chat_id,
                "❌ Failed to remove reminders. Please try again.",
                reply_markup=telebot.types.ReplyKeyboardRemove()
            )

    except ValueError:
        bot.send_message(
            chat_id,
            "⚠️ Please enter a valid number.",
            reply_markup=telebot.types.ReplyKeyboardRemove()
        )

@bot.message_handler(content_types=['photo'])
def handle_photo(message):
    # Check if this is likely a prescription or medical record
    if message.caption and ('prescription' in message.caption.lower() or 'medicine' in message.caption.lower()):
        process_prescription(message, is_photo=True)
    else:
        process_medical_record(message)

@bot.message_handler(content_types=['text'])
def handle_text(message):
    if message.text.startswith('/'):
        bot.send_message(message.chat.id, "❌ Unrecognized command. Type /start to see available commands.")
        return
    
    # Check if this looks like a prescription (medicine names, dosages, etc.)
    medicine_keywords = ['mg', 'tablet', 'capsule', 'twice', 'daily', 'bd', 'tid', 'qid']
    if any(keyword in message.text.lower() for keyword in medicine_keywords):
        process_prescription(message, is_photo=False)
    else:
        bot.send_message(
            message.chat.id,
            "I'm not sure what you're sending. Please use:\n"
            "- /medicine for prescriptions\n"
            "- /upload_medical for medical records\n"
            "- Or type /start for help"
        )

def main():
    # Initial cleanup
    clean_old_reminders()
    
    # Start reminder checker in a separate thread
    import threading
    reminder_thread = threading.Thread(target=check_reminders, daemon=True)
    reminder_thread.start()
    
    logger.info("MedGuardian Bot started successfully!")
    bot.polling(none_stop=True)

if __name__ == "__main__":
    main()