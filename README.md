# Company Insight Utility
#### Built by Peter Dulworth for Nesh

### Installation
Note: I developed this application for Google Chrome. Most testing has been done with Chrome 72.0.3626.109.

### Running
#### Front End
```bash
npm install
```
```bash
npm start
```

#### Back End
```bash
python app.py
```

This will launch the backend at http://localhost:5000

To test calls to the backend without the front-end you can open
terminal and run.

```
curl -i http://localhost:5000/symbol/oxy
```
`oxy` can be substituted for any symbol.

### Features

- Quick Overview
    - includes last stock price, net change in price in past day and percent change in price over past day
- company description
    - includes a brief description of the company (pulled from their SEC filing)
- financial numbers
    - includes important financial numbers
- news articles
    - includes recently published news articles relating to the given company
- Analysis of Earnings Call Transcript 
    - When did the call happen
    - Who all was on the call
    - Who Spoke the Longest

### Ideas for future updates

- handle mobile better
- better error handling for scraper (rn if a website changes will break very easily)