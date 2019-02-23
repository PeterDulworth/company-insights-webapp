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
    proxies = {'http':'200.136.52.103:80'}
    # proxies = {'https':'118.174.233.80:32830'}
    prox = [
        {'http': '45.70.0.223:8080'},
        {'http': '200.255.122.174:8080'},
        {'http': '178.128.127.238:8080'},
        {'http': '206.189.46.32:8080'},
        {'http': '185.146.112.142:8080'},
        {'http': '178.62.39.65:8080'},
        {'http': '190.14.229.196:8080'},
        {'http': '159.16.106.110:80'},
        {'http': '154.83.10.94:80'},
        {'http': '200.136.52.103:80'},
    ]
    p = random.choice(prox)
    # print(p)
    return proxies