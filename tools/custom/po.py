import time
from common import fetcher, parser
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException

match_url = "https://matchhistory.lan.leagueoflegends.com/es/#match-details/LA1/"
driver = None

def initialize():
    global driver
    driver = webdriver.Firefox()

def finalize():
    global driver
    driver.close()
    driver = None

def get_match(username, password, match_id, refresh=False):
    if refresh:
        driver.refresh()
    else:
        driver.get(match_url + match_id)
    
    time.sleep(5)
    if needs_login():
        login(username, password)
    time.sleep(5)
    
    try:
        raw_match = fetcher.get_match(match_id)
        parsed_match = parser.parse_raw_match(raw_match, { "id": '215581531140259841', "name": 'Neo Coopemalza S.A.' })
        return None # TODO: Left as "None" because the identities still need to be linked.
    except NoSuchElementException:
        print("Failed. Retrying...")
        return get_match(username, password, match_id, True)
     
def needs_login():
    try:
        driver.find_element_by_css_selector("a.riotbar-anonymous-link:nth-child(2)")
        return True
    except NoSuchElementException:
        return False

def click(selector):
    element = driver.find_element_by_css_selector(selector)
    element.click()

def write(text, selector):
    element = driver.find_element_by_css_selector(selector)
    element.send_keys(text)

def get_text(selector):
    element = driver.find_element_by_css_selector(selector)
    return element.text

def get_text_content(selector):
    element = driver.find_element_by_css_selector(selector)
    return element.get_attribute("textContent")

def get_text_of_first_child_div(selector):
    parent = driver.find_element_by_css_selector(selector)
    child = parent.find_element_by_tag_name("div")
    return child.text

def login(username, password):
    click("a.riotbar-anonymous-link:nth-child(2)")
    time.sleep(5)
    write(username, "div.field:nth-child(1) > div:nth-child(1) > input:nth-child(1)")
    write(password, "div.field:nth-child(2) > div:nth-child(1) > input:nth-child(1)")
    click("label.signin-checkbox > input:nth-child(1)")
    click(".mobile-button")
    time.sleep(5)

def get_champion_id(champion_element):
    inner_element = champion_element.find_element_by_css_selector(".champion-nameplate-icon > .champion-icon > div")
    return inner_element.get_attribute("data-rg-id")

def get_summoner(team_id, index):
    identity_element = driver.find_element_by_css_selector(".team-" + str(team_id) + " > ul > li:nth-child(" + str(index+1) +") > .player > .name")
    summoner_element = identity_element.find_element_by_css_selector("div:nth-child(3) > .champion-nameplate > .champion-nameplate-name > div > a")
    summoner_name = summoner_element.text
    return fetcher.get_summoner(summoner_name)

def get_champion(team_id, index):
    identity_element = driver.find_element_by_css_selector(".team-" + str(team_id) + " > ul > li:nth-child(" + str(index+1) +") > .player > .name")
    champion_element = identity_element.find_element_by_css_selector("div > .champion-nameplate")
    champion_id = get_champion_id(champion_element)
    return fetcher.get_champion(champion_id)
