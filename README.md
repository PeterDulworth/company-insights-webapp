# Company Insight Utility
#### Built by Peter Dulworth for Nesh

### Installation

#### 1. Clone the repo
Clone the repo or download the zip.
#### 2. Install frontend dependencies
```bash
cd frontend
npm install
```
#### 3. Install backend dependencies
```bash
pip install -r requirements.txt
```

Note: I developed this application for Google Chrome. Most testing has been done with Chrome 72.0.3626.109.

Note: This application uses python 3.7.

### Running the app
#### Front End
```bash
npm start
```
The website will now be live at: http://localhost:3000/
For the website to be functional, you must also start the backend (next step).

#### Back End
```bash
python backend/server.py
```
The API will now be live at http://localhost:5000

To test calls to the backend without the front-end you can open terminal and run.

```
curl -i http://localhost:5000/symbol/oxy
```

### Features

- stock overview
    - includes last stock price, net change in price in past day and percent change in price over past day
- company description
    - includes a brief description of the company (pulled from their SEC filing)
- financial numbers
    - includes important financial numbers
- news articles
    - includes recently published news articles relating to the given company
- Analysis of Earnings Call Transcript 
    - when did the call happen
    - who all was on the call
    - who Spoke the Longest

### Ideas for future updates

- handle mobile better
- better error handling for scraper (rn if a website changes will break very easily)
- i had trouble getting access to the full earnings calls
- seeking alpha had too much javascript

Challenges
- parsing the transcripts is hard because there is so little to work with
- dealing with authentication