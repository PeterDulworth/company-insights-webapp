"""
Author: Peter DUlworth
Date: 02/22/2019

This file contains helper methods to generate request headers.
"""

from enum import Enum
import random

class Site(Enum):
    SA = 1
    NASDAQ = 2

def getHeaders(siteEnum):
    if siteEnum == Site.SA:
        host = 'www.seekingalpha.com'
        ref = 'https://seekingalpha.com'
    elif siteEnum == Site.NASDAQ:
        host = 'www.nasdaq.com'
        ref = 'https://www.nasdaq.com'
    else:
        host = ''
        ref = ''
    
    return {
        "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding":"gzip, deflate",
        "Accept-Language":"en-GB,en;q=0.9,en-US;q=0.8,ml;q=0.7",
        "Connection":"keep-alive",
        # "Host": host,
        "Referer": ref,
        "Upgrade-Insecure-Requests":"1",
        "User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.119 Safari/537.36"
    } 

def getProxy():
    proxies = {'http':'96.47.238.50:443'} 
    
    usProxies = [
        {'http':'64.44.100.21:8888'},
        {'http':'198.211.109.14:80'},
        {'http':'50.232.162.77:80'},
        {'http':'142.93.15.146:3128'},
        {'http':'204.152.206.34:5836'},
        {'http':'35.198.65.233:8080'},
        {'http':'204.152.206.37:5836'},
    ]

    # return random.choice(usProxies)
    return proxies