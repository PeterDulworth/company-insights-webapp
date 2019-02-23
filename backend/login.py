"""
This file contains the source code for loginSA, which allows our python script to login to Seeking Alpha.
"""

import json
import requests
import sys
from headers import *

def loginSA():
    # load the credentials
    with open("credentials.json", 'r') as f:
        keys = json.load(f)

    # Start a session so we can have persistant cookies
    sessionRequests = requests.Session()

    loginUrl = "http://seekingalpha.com/account/login"

    # This is the form data that the page sends when logging in
    loginData = {
        'slugs[]': None,
        'rt':None,
        'user[url_source]':None,
        'user[location_source]':'orthodox_login',
        'user[email]':keys['username'],
        'user[password]':keys['password'],
    }

    # Authenticate
    headers = {"Referer": "http://seekingalpha.com/", "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"}
    response = sessionRequests.post(loginUrl, data = loginData, proxies=getProxy(), headers=headers)

    return [response.status_code, sessionRequests]

if __name__ == "__main__":
    print(loginSA()[0])
    tempUrl = 'https://seekingalpha.com/article/4144365-tesla-tsla-q4-2017-results-earnings-call-transcript?page=single'
    print(loginSA()[1].get(tempUrl, headers=getHeaders(Site.SA), proxies=getProxy()).text)
