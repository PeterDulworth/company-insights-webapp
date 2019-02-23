"""
Author: Peter DUlworth
Date: 02/22/2019

This file contains various methods for scraping data from nasdaq.com and seekingalpha.com.
"""

from bs4 import BeautifulSoup
import requests
import re
# from login import loginSA
from headers import *

def log(msg, tag="ALERT"):
    print("[" + tag + "] " + msg)

def ifNotNull(query):
    if query:
        return query.get_text(strip=True)
    else:
        return None

def scrapeNasdaqSymbol(symbol):
    d = {}
    url = 'https://www.nasdaq.com/symbol/%s' % (symbol)
    log(url, tag="DATA")

    # Retrying for failed request
    for retries in range(3):
        try:
            # make the request
            response = requests.get(url, headers=getHeaders(Site.NASDAQ), proxies=getProxy()) # verify=False

            # if there is an error with the request, try again
            if response.status_code != 200:
                raise ValueError("Invalid Response Received From Server!")

            # convert the page into a beautiful soup object
            soupPage = BeautifulSoup(response.text, "html.parser")

            # company name
            headerWrapper = soupPage.find('div', id="qwidget-quote-wrap");
            rawName = ifNotNull(headerWrapper.find('div', id="qwidget_pageheader").h1);
            rawName = rawName.replace('Common Stock ', '')
            rawName = rawName.replace('Quote & Summary Data', '')
            d['name'] = rawName.strip() if rawName else ''
            log("COMPANY NAME OK", tag="DATA")
            
            # parse the about section
            descr = soupPage.find('div', id="company-description")
            d['about'] = descr.p.get_text(strip=True).replace('\r\n', ' ').replace('...More...', '').replace('View Company Description as filed with the SEC...', '')
            log("ABOUT OK", tag="DATA")
        
            # parse the header info
            header = headerWrapper.find('div', id='qwidget_quote')
            d['symbol'] = ifNotNull(header.find('div', class_="qwidget-symbol"))
            d['price'] = ifNotNull(header.find('div', id="qwidget_lastsale"))
            netChange = header.find('div', id="qwidget_netchange")
            d['netChange'] = ifNotNull(netChange)
            d['netChangeDir'] = 'incr' if 'qwidget-Green' in netChange['class'] else 'decr' 
            d['percentChange'] = ifNotNull(header.find('div', id="qwidget_percent"))
            log("HEADER INFO OK", tag="DATA")

            keyStockData = {}
            table = soupPage.find('div', class_="row overview-results relativeP")
            cols = table.find_all('div', class_="column span-1-of-2")
            col1 = cols[0].div
            col2 = cols[1].div
            kvPairs = col1.find_all('div', class_='table-row') + col2.find_all('div', class_='table-row')
            for i in kvPairs:
                key = i.find_all('div', class_="table-cell")[0].b.text
                value = i.find_all('div', class_="table-cell")[1].text
                key = ''.join(key).strip() 
                value = ' '.join(''.join(value).split()) 
                keyStockData[key] = value
            d['keyStockData'] = keyStockData
            log("KEY STOCK DATA OK", tag="DATA")

            return d

        except Exception as e:
            print("Failed to process the request, Exception:%s"%(e))

def scrapeNasdaqHeadlines(symbol):
    url = 'https://www.nasdaq.com/symbol/%s/news-headlines' % (symbol)
    tag = "HEADLINES"
    log(url, tag=tag)

    # Retrying for failed request
    for retries in range(3):
        try:
            # make the request
            response = requests.get(url, headers=getHeaders(Site.NASDAQ), proxies=getProxy())

            # if there is an error with the request, try again
            if response.status_code != 200:
                raise ValueError("Invalid Response Received From Server!")

            # convert the page into a beautiful soup object
            soupPage = BeautifulSoup(response.text, "html.parser")

            # company name
            news = soupPage.find('div', class_="news-headlines");
            log("HEADLINES OK", tag=tag)

            articles = news.find_all(lambda tag: not tag.has_attr('class') and not tag.has_attr('id') and tag.name=='div', recursive=False)
            log("ARTICLES OK", tag=tag)
            return list(map(lambda article: {'name': article.span.a.text, 'date': article.small.text.strip().split('-')[0][:-1], 'author': article.small.text.strip().split('-')[1][1:], 'link': article.span.a['href']}, articles))

        except Exception as e:
            print("Failed to process the request, Exception:%s"%(e))

def scrapeSeekingAlphaEarningsCalls(symbol):
    url = 'http://seekingalpha.com/symbol/%s/earnings/transcripts' % (symbol)
    tag = "EARNINGS CALLS"
    log(url, tag=tag)

    # Retrying for failed request
    for retries in range(3):
        try:
            # make the request
            response = requests.get(url, headers=getHeaders(Site.SA), proxies=getProxy())
            
            # if there is an error with the request, try again
            if response.status_code != 200:
                raise ValueError("Invalid Response Received From Server!")

            # convert the page into a beautiful soup object
            soupPage = BeautifulSoup(response.text, "html.parser")

            table = soupPage.find('div', id="headlines_transcripts")
            log("TABLE OK", tag=tag)
            calls = table.find_all("div", {"class":"symbol_article"});
            log("EARNINGS CALLS OK", tag=tag)
            return list(map(lambda call: {'name': call.a.text, 'link': 'https://seekingalpha.com' + call.a['href'] + '?part=single', 'date': call.div.find(text=True, recursive=False)}, calls))

        except Exception as e:
            print("Failed to process the request, Exception: %s" %(e))

def scrapeCall(callPath):
    url = 'https://seekingalpha.com/article/%s?part=single' % (callPath)
    tag = "CALL ANALYSIS"
    log(url, tag=tag)

    # Retrying for failed request
    for retries in range(3):
        try:
            # make the request
            response = requests.get(url, headers=getHeaders(Site.SA), proxies=getProxy())
            
            # if there is an error with the request, try again
            if response.status_code != 200:
                raise ValueError("Invalid Response Received From Server!")

            # convert the page into a beautiful soup object
            soupPage = BeautifulSoup(response.text, "html.parser")

            # find a list of executives
            # find a list of analysts
            # find the operator
            # use these names to find the text spoken by each person
            # detect if the call is a slide deck: "The following slide deck"

            extracts = []
            keywords = ['Analysis']
            bodyAll = soupPage.find_all("div", {"id":"a-body"})
            if bodyAll:
                bodyAll = bodyAll[0].text
                body = bodyAll.split("\n")
                for p in body:
                    print(p)
                    if any(keyword in p for keyword in keywords):
                        extracts.append({
                                        # "title": title,
                                        # "date": date,
                                        # "time": time, 
                                        "bodyContent": p
                                        })

                return extracts
            # find the article itself
            article = soupPage.find('article')
            a = article.find('div', id="a-cont", recursive=False)
            paragraphs = list(a.find_all('p'))
            for p in paragraphs:
                print (p.text)
            log("ARTICLE OK", tag=tag)
            
            # find the executives and analysts
            executives = a.find_all(lambda tag: tag.name == 'p' and tag.text == 'Executives')[0]
            analysts = a.find_all(lambda tag: tag.name == 'p' and tag.text == 'Analysts')[0]
            log("EXECUTIVES + ANALYSTS OK", tag=tag)

            return {}

        except Exception as e:
            print("Failed to process the request, Exception: %s" % (e))

def test():
    return requests.get('https://seekingalpha.com/symbol/AMAT/earnings', headers=getHeaders(Site.SA), proxies=getProxy()).text
    # return requests.get('https://seekingalpha.com/symbol/AMAT/earnings', proxies={'https':'50.232.162.77:80'}).text
