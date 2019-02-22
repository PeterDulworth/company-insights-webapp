from bs4 import BeautifulSoup
import requests
import re
import time

baseUrl = 'https://www.nasdaq.com/symbol/'
headers = {
    "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Encoding":"gzip, deflate",
    "Accept-Language":"en-GB,en;q=0.9,en-US;q=0.8,ml;q=0.7",
    "Connection":"keep-alive",
    "Host":"www.nasdaq.com",
    "Referer":"http://www.nasdaq.com",
    "Upgrade-Insecure-Requests":"1",
    "User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.119 Safari/537.36"
}
proxies = {'http':'200.136.52.103:80'}

def log(msg, tag="ALERT"):
    print("[" + tag + "] " + msg)

def ifNotNull(query):
    if query:
        return query.get_text(strip=True)
    else:
        return None

def scrapeNasdaqSymbol(symbol):
    d = {}
    url = baseUrl + str(symbol)
    log(url, tag="DATA")

    # Retrying for failed request
    for retries in range(3):
        try:
            # make the request
            # response = requests.get(url, headers=headers, proxies=proxies, verify=False)
            response = requests.get(url, headers=headers, proxies=proxies)

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
    # time.sleep(5)
    d = {}
    url = baseUrl + str(symbol) + '/news-headlines'
    log(url, tag="HEADLINES")

    # Retrying for failed request
    for retries in range(3):
        try:
            # make the request
            response = requests.get(url, headers=headers, proxies=proxies)

            # if there is an error with the request, try again
            if response.status_code != 200:
                raise ValueError("Invalid Response Received From Server!")

            # convert the page into a beautiful soup object
            soupPage = BeautifulSoup(response.text, "html.parser")

            # company name
            news = soupPage.find('div', class_="news-headlines");
            log("HEADLINES OK", tag="HEADLINES")

            articles = news.find_all(lambda tag: not tag.has_attr('class') and not tag.has_attr('id') and tag.name=='div', recursive=False)
            log("ARTICLES OK", tag="HEADLINES")
            return list(map(lambda article: {'name': article.span.a.text, 'date': article.small.text.strip().split('-')[0][:-1], 'author': article.small.text.strip().split('-')[1][1:], 'link': article.span.a['href']}, articles))

        except Exception as e:
            print("Failed to process the request, Exception:%s"%(e))

def scrapeSeekingAlphaEarningsCalls(symbol):
    # time.sleep(10)
    d = {}
    url = 'https://seekingalpha.com/symbol/' + str(symbol) + '/earnings/transcripts'
    log(url, tag="EARNINGS CALLS")

    # Retrying for failed request
    for retries in range(3):
        try:
            # make the request
            response = requests.get(url, headers={"Referer": "http://seekingalpha.com/", "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"}, proxies=proxies)

            # if there is an error with the request, try again
            if response.status_code != 200:
                raise ValueError("Invalid Response Received From Server!")

            # convert the page into a beautiful soup object
            soupPage = BeautifulSoup(response.text, "html.parser")

            table = soupPage.find('div', id="headlines_transcripts")
            log("TABLE OK", tag="EARNINGS CALLS")
            calls = table.find_all("div", {"class":"symbol_article"});
            log("EARNINGS CALLS OK", tag="EARNINGS CALLS")
            return list(map(lambda call: {'name': call.a.text, 'link': 'https://seekingalpha.com' + call.a['href'], 'date': call.div.find(text=True, recursive=False)}, calls))

        except Exception as e:
            print("Failed to process the request, Exception:%s"%(e))