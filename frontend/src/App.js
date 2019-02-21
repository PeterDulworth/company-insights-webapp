import React, { Component } from 'react';
import Search from "./components/search/search"
import style from "./App.module.css";

class App extends Component {
  render() {
    return (
      <div className={style.App}>
        <div className={style.siteTitle}>Company Insights</div>
        <div className={style.siteSubTitle}>Make your dream home come true</div>            
        <Search />
      </div>
    );
  }
}

export default App;
