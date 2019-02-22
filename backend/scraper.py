from bs4 import BeautifulSoup
import requests
import re

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

def log(msg):
    print("[ALERT] " + msg)

def ifNotNull(query):
    if query:
        return query.get_text(strip=True)
    else:
        return None

def scrapeNasdaqSymbol(symbol):
    d = {}
    url = baseUrl + str(symbol)

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
            log("COMPANY NAME OK")
            
            # parse the about section
            descr = soupPage.find('div', id="company-description")
            d['about'] = descr.p.get_text(strip=True).replace('\r\n', ' ').replace('...More...', '').replace('View Company Description as filed with the SEC...', '')
            log("ABOUT OK")
        
            # parse the header info
            header = headerWrapper.find('div', id='qwidget_quote')
            d['symbol'] = ifNotNull(header.find('div', class_="qwidget-symbol"))
            d['price'] = ifNotNull(header.find('div', id="qwidget_lastsale"))
            netChange = header.find('div', id="qwidget_netchange")
            d['netChange'] = ifNotNull(netChange)
            d['netChangeDir'] = 'incr' if 'qwidget-Green' in netChange['class'] else 'decr' 
            d['percentChange'] = ifNotNull(header.find('div', id="qwidget_percent"))
            log("HEADER INFO OK")

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
            log("KEY STOCK DATA OK")

            return d

        except Exception as e:
            print("Failed to process the request, Exception:%s"%(e))

def scrapeNasdaqHeadlines(symbol):
    d = {}
    url = baseUrl + str(symbol) + '/news-headlines'
    log(url)

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

            articles = news.find_all(lambda tag: not tag.has_attr('class') and not tag.has_attr('id') and tag.name=='div', recursive=False)
            return list(map(lambda article: {'name': article.span.a.text, 'date': article.small.text.strip().split('-')[0][:-1], 'author': article.small.text.strip().split('-')[1][1:], 'link': article.span.a['href']}, articles))

        except Exception as e:
            print("Failed to process the request, Exception:%s"%(e))















def scrapeProxy():
    r = requests.get('https://seekingalpha.com/symbol/OXY/earnings', proxies={'http':'50.207.31.221:80'}).text
    results = re.findall('Revenue of \$[a-zA-Z0-9\.]+', r)
    s = BeautifulSoup(r, 'html.parser')
    titles = list(map(lambda x:x.text, s.find_all('span', {'class':'title-period'})))
    epas = list(map(lambda x:x.text, s.find_all('span', {'class':'eps'})))
    deciding = list(map(lambda x:x.text, s.find_all('span', {'class':re.compile('green|red')})))
    results = list(map(list, zip(titles, epas, results, epas)))
    return results

def scrapeProxy2():
    r = requests.get('https://seekingalpha.com/symbol/OXY/overview', proxies={'http':'50.207.31.221:80'}).text
    results = re.findall('The company was founded in 1920 and is headquartered in Houston, TX.', r)
    print ("AKJAKJSHD", results)
    s = BeautifulSoup(r, 'html.parser')
    print(s.prettify())
    # titles = list(map(lambda x:x.text, s.find_all('span', {'class':'title-period'})))
    # epas = list(map(lambda x:x.text, s.find_all('span', {'class':'eps'})))
    # deciding = list(map(lambda x:x.text, s.find_all('span', {'class':re.compile('green|red')})))
    # results = list(map(list, zip(titles, epas, results, epas)))
    return results


def scrapeOxy(): 
    l = []
    url = 'https://seekingalpha.com/symbol/OXY/overview'
    headers = {
        'User-Agent': 'Chrome/63.0.3239.132',
    }
    page = requests.get(url, headers=headers, proxies={'http':'200.136.52.103:80'}).text
    soupPage = BeautifulSoup(page, "html.parser")
    about = soupPage.find_all('div', class_="about")
    print(soupPage.prettify())
    print(soupPage.title)
    print(soupPage.h4)
    print(about)
    return about

def scrape():
    l = []
    # for page in range(0, 3):
        # page = page + 1 
    base_url = 'https://www.bukalapak.com/' 
    r = requests.get(base_url)
    soup = BeautifulSoup(r.text, "html.parser")
    all_product = soup.find_all('div', class_="product-card")
    # print (all_product[0])

    for item in all_product:
        d = { }

        # image
        product_image = item.find("img", {"class":"product-media__img"})
        # image = image.text.replace('\n', "").strip()
        product_image = product_image['src']
        d['product_image'] = product_image

        # name & link
        product_name = item.find("a", {"class":"product__name"})
        product_link = 'https://www.bukalapak.com' + str(product_name.get('href'))
        product_name = product_name.text.replace('\n', "").strip()
        d['product_link'] = product_link
        d['product_name'] = product_name

        # price
        product_price = item.find("span", {"class":"amount"})
        product_price = product_price.text.replace('\n', "").strip()
        d['product_price'] = 'Rp' + product_price

        # review
        product_review = item.find("a", {"class":"review__aggregate"})
        try:
            product_review = product_review.text
            d['product_review'] = int(product_review)
        except:
            d['product_review'] = 0

        # link
        # product_link = item.find("a", {"class":"product-media__link"}, href=True)
        # product_link = 'https://www.bukalapak.com' + str(product_link.get('href'))
        # d['product_link'] = product_link

        l.append(d)

    return l