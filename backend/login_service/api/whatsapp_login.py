from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from typing import Dict
from datetime import datetime
import pytz

from shared.db.mongo_client import users

router = APIRouter(prefix="/user/whatsapp", tags=["WhatsApp Auth"])

active_connections: Dict[str, WebSocket] = {}

@router.websocket("/ws/{uuid}")
async def websocket_endpoint(websocket: WebSocket, uuid: str):
    await websocket.accept()
    active_connections[uuid] = websocket
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.pop(uuid, None)


async def run_selenium(phone_number: str, uuid: str):
    chrome_options = Options()
    chrome_options.add_argument("--no-first-run")
    chrome_options.add_argument("--disable-popup-blocking")
    chrome_options.add_argument("--start-maximized")
    driver = webdriver.Chrome(options=chrome_options)
    driver.get("https://web.whatsapp.com")

    try:
        WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "//div[@role='button' and contains(., 'Log in with phone number')]"))
        ).click()
        WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "//button[.//img[contains(@class, 'emoji')]]"))
        ).click()
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.XPATH, "//div[@role='textbox']"))
        ).send_keys("Malaysia")
        WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(@aria-label, 'Malaysia')]"))
        ).click()
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.XPATH, "//input[@aria-label='Type your phone number.']"))
        ).send_keys(phone_number)
        WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "//button[.//div[text()='Next']]"))
        ).click()

        link_code_elem = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.XPATH, "//div[@data-link-code]"))
        )
        link_code = link_code_elem.get_attribute("data-link-code")
        print("🔗 Link Code:", link_code)

        if uuid in active_connections:
            await active_connections[uuid].send_json({
                "status": "pending",
                "link_code": link_code
            })

        WebDriverWait(driver, 180).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(@aria-label, 'Profile')]"))
        )

        cookies = driver.get_cookies()
        users.find_one_and_update(
            {"_id": uuid},
            {"$set": {
                "updated_at": datetime.now(tz=pytz.timezone("Asia/Kuala_Lumpur")),
                "whatsapp": {
                    "cookies": cookies,
                }
            }}
        )

        if uuid in active_connections:
            await active_connections[uuid].send_json({
                "status": "success",
                "message": "WhatsApp login completed.",
            })

    except Exception as e:
        print("⏰ Login timeout or failed:", e)
        if uuid in active_connections:
            await active_connections[uuid].send_json({
                "status": "error",
                "message": "Login failed or timed out."
            })
    finally:
        driver.quit()


@router.post("/login")
async def login_process(phone_number: str, uuid: str):
    await run_selenium(phone_number, uuid)
    return {"status": "processing"}
