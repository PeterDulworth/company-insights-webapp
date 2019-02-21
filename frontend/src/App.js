import React, { Component } from 'react';
import Search from "./components/search/search"
import Display from "./components/display/display"
import style from "./App.module.css";
import { Route, Switch, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className={style.app}>
        <Switch>
          <Route exact path="/" component={searchPage} />
          <Route exact path="/:symbol" component={resultsPage}/>
          <Route exact path="/:symbol/error" component={invalidQueryPage}/>
          <Route component={errorPage}/>
        </Switch>
      </div>
    );
  }
}

const searchPage = () => (
  <div className={style.searchWrapper}>
    <div className={style.title}>Company Insights</div>
    <div className={style.subtitle}>Easily find useful insights on your favorite companies.</div>            
    <Search />
  </div>
);

const resultsPage = (match) => (
  <Display symbol={match.location.pathname}/>
);

const errorPage = (match) => (
  <div className={style.searchWrapper}>
    <div className={style.title}>404</div>
    <div className={style.subtitle}>
      {console.log(match.location.pathname)}
      {"This page doesn't exist :( Would you like to go "}
      <Link to="/"> home?</Link>
    </div>            
  </div>
);

const invalidQueryPage = (match) => (
  <div className={style.searchWrapper}>
    <div className={style.title}>Invalid Ticker!</div>
    <div className={style.subtitle}>
      {console.log(match.location.pathname)}
      {"We can't find a stock matching the ticker you entered. Would you like to "}
      <Link to="/"> try again?</Link>
    </div>            
  </div>
);

export default App;
