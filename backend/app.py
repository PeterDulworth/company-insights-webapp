from flask import Flask, jsonify
from scraper import *
from nasdaq_finance import *

app = Flask(__name__)
    
@app.route('/')
def index():
    return '<h1>Welcome to Company Insights API!</h1>Checkout the project on <a href="https://github.com/PeterDulworth/nesh-company-insights">github!</a>'

# e.g. http://localhost:5000/symbol/OXY
@app.route('/symbol/<string:symbol>')
def getSymbol(symbol):
    scrapedData = scrapeNasdaqSymbol(symbol)
    response = jsonify(Company=scrapedData)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)