# Company Insight Utility
#### Built by Peter Dulworth for Nesh

### Submission Video

Explanation video: https://www.youtube.com/watch?v=MOjehyxotzU&feature=youtu.be


### Demo

![search gif](https://github.com/PeterDulworth/nesh-company-insights/blob/master/info/gifs/search.gif)

### Features

- **stock overview**
    - includes last stock price, net change in price in past day and percent change in price over past day
- **company description**
    - includes a brief description of the company (pulled from their SEC filing)
- **financial numbers**
    - includes important financial numbers such PE, Market Cap, etc.
- **news articles**
    - includes recently published news articles relating to the company
- **analysis of earnings call transcripts**
    - list of companies earnings calls including links transcripts and analysis
    - analysis includes:
        - call participants 
        - tone analysis: e.g. the overall done of the call (happy, sad, analytical, etc...)
        - participation analysis: how many questions did each participant ask and answer

### Installation

#### 1. Clone the repo
Clone the repo or download the zip.
#### 2. Install frontend dependencies
```bash
cd frontend
npm install
```
#### 3. Install backend dependencies
it is recommended that you use a virtual environment but not required.
```bash
pip install -r requirements.txt
```

Note: I developed this application for Google Chrome. Most testing has been done with Chrome 72.0.3626.109.

Note: This application uses python 3.7.

### Running the app
First start the backend, then start the front end:

#### 1. Back End
```bash
cd backend
python server.py
```
The API will now be live at http://localhost:5000

You can test that the backend is up by going to `http://localhost:5000`. It should display a simple webpage with some information about the endpoints.

#### 2. Front End
In a second terminal window:
```bash
cd frontend
npm start
```
The website will now be live at: http://localhost:3000/

### Important Note
<strong>If at anytime data fails to load, it is likely because your IP has been blocked by seeking alpha's web scraping watch dog. To accomodate this I created an endpoint on the backend that will generate a proxy and route all requests through it. To do this simply open a new tab and navigate to http://localhost:5000/generate/proxy. Each time you visit this URL it will generate a new proxy. You can visit this URL as many times as you would like and it will generate a new proxy each time. If a proxy isn't working well it often helps to just generate another one.</strong>

### System Architecture

- front end
    - react app: dynamically creates pages based on JSON response from requests to backend endpoints
- backend
    - python flask 
    - webscraper using beautifulsoup4 to traverse the DOM

### Ideas for future updates

- handle mobile better
- better error handling for scraper / tested on more sites
- analysis of articles instead of just earnings calls
- some kind of data caching

### Challenges
- parsing the earnings call transcripts is difficult because there is very little CSS to work with. you mostly have to rely on the text.
- seeking alpha is blocks your IP after a couple requests, so I had to spend a lot of time writing a script to rotate proxies and user agents (this comes at the cost of slowing down requests).
- seeking alpha loads a lot of content via javascript which makes it very difficult to scrape.

### Sources
- nasdaq.com
- seekingalpha.com