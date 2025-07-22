from dotenv import load_dotenv
from fastapi import APIRouter
import os, time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

load_dotenv()
router = APIRouter(prefix="/whatauth", tags=["WhatsApp Auth"])

def login_process(phone_number: str = "123456789"):
    chrome_options = Options()
    chrome_options.add_argument("--no-first-run")
    chrome_options.add_argument("--disable-popup-blocking")
    chrome_options.add_argument("--start-maximized")
    
    # Open WhatsApp Web in a new browser window
    driver = webdriver.Chrome(options=chrome_options)
    driver.get("https://web.whatsapp.com")
    
    
    phone_num_button = WebDriverWait(driver, 15).until(
        EC.element_to_be_clickable((
            By.XPATH, "//div[@role='button' and contains(., 'Log in with phone number')]"
        ))
    )
    phone_num_button.click()
    
    country_button = WebDriverWait(driver, 15).until(
        EC.element_to_be_clickable((
            By.XPATH, "//button[.//img[contains(@class, 'emoji')]]"
        ))
    )
    country_button.click()
    
    search_box = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((
            By.XPATH, "//div[@role='textbox']"
        ))
    )
    search_box.click()
    search_box.send_keys("Malaysia")
    msia_button = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((
            By.XPATH,
            "//button[contains(@aria-label, 'Malaysia')]"
        ))
    )
    msia_button.click()
    
    phone_input = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//input[@aria-label='Type your phone number.']"))
    )

    phone_input.clear()
    phone_input.send_keys(phone_number)
    
    next_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((
            By.XPATH, "//button[.//div[text()='Next']]"
        ))
    )
    next_button.click()

    link_code_elem = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.XPATH, "//div[@data-link-code]"))
    )

    # Get the attribute value
    link_code = link_code_elem.get_attribute("data-link-code")
    print("Link code:", link_code)


    print("📱 WAIT: Enter your phone number and OTP in browser")
    while True:
        time.sleep(1)


    # driver.quit()

if __name__ == "__main__":
    login_process()