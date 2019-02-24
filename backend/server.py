"""
Author: Peter Dulworth
Date: 02/22/2019

Main entry point for the program. Flask API supporting several endpoints for web scraping.
"""
from flask import Flask, jsonify, abort
from scraper import *
from headers import *

app = Flask(__name__)
proxies = {}

@app.route('/')
def index():
    page = [
        '<h1>Welcome to Company Insights API!</h1>',
        'Checkout the project on <a href="https://github.com/PeterDulworth/nesh-company-insights">github!</a>',
        '<br/><br/>',
        '<strong>Endpoints:</strong>',
        '<ul>',
            '<li>/symbol/&lt;string:symbol&gt;</li>',
            '<li>/symbol/headlines/&lt;string:symbol&gt;</li>',
            '<li>/symbol/earnings/calls/&lt;string:symbol&gt;</li>',
            '<li>/call/&lt;string:callURL&gt;</li>',
        '</ul>',
        ]
    return ''.join(page)

# e.g. curl -i http://localhost:5000/proxy
@app.route('/proxy')
def proxy():
    response = jsonify(proxies=proxies)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# change the global variable storing the proxy
@app.route('/generate/proxy')
def changeProxy():
    global proxies 
    proxies = getProxy()
    response = jsonify(proxies=proxies)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# e.g. http://localhost:5000/symbol/OXY
@app.route('/symbol/<string:symbol>')
def getSymbol(symbol):
    scrapedData = scrapeNasdaqSymbol(symbol, proxies)
    
    if (scrapedData == None):
        response = jsonify(status=404)
        response.headers.add('Access-Control-Allow-Origin', '*')    
        return response
    
    response = jsonify(company=scrapedData, status=200)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# e.g. http://localhost:5000/symbol/headlines/OXY
@app.route('/symbol/headlines/<string:symbol>')
def getSymbolHeadlines(symbol):
    headlines = scrapeNasdaqHeadlines(symbol, proxies)
    
    if (headlines == None):
        response = jsonify(status=404)
        response.headers.add('Access-Control-Allow-Origin', '*')    
        return response
    
    response = jsonify(articles=headlines, status=200)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# e.g. http://localhost:5000/symbol/earnings/calls/OXY
# test: curl -i http://localhost:5000/symbol/earnings/calls/aapl
@app.route('/symbol/earnings/calls/<string:symbol>')
def getSymbolEarningsCalls(symbol):
    calls = scrapeSeekingAlphaEarningsCalls(symbol, proxies)
    
    if (calls == None):
        response = jsonify(status=404)
        response.headers.add('Access-Control-Allow-Origin', '*')    
        return response
    
    response = jsonify(calls=calls, status=200)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# e.g. curl -i http://localhost:5000/call/4144365-tesla-tsla-q4-2017-results-earnings-call-transcript
@app.route('/call/<string:callURL>')
def getCall(callURL):
    call = scrapeCall(callURL, proxies)
    
    if (call == None):
        response = jsonify(status=404)
        response.headers.add('Access-Control-Allow-Origin', '*')    
        return response
    
    response = jsonify(call=call, status=200)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# e.g. curl -i http://localhost:5000/call/4144365-tesla-tsla-q4-2017-results-earnings-call-transcript
@app.route('/test')
def tester():
    response = jsonify(data=test(proxies), status=200)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
