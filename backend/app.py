from flask import Flask, jsonify
from scraper import *
from nasdaq_finance import *

app = Flask(__name__)
    
@app.route('/')
def index():
    return '<h1>Welcome to Company Insights!</h1>'

# e.g. http://localhost:5000/symbol/OXY
@app.route('/symbol/<string:symbol>')
def index2(symbol):
    scrapedData = scrapeNasdaqSymbol(symbol)
    response = jsonify(Company=scrapedData)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)