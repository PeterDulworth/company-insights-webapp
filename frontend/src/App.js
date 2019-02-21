import React, { Component } from 'react';
import Search from "./components/search/search"
import style from "./App.module.css";

class App extends Component {
  render() {
    return (
      <div className={style.wrapper}>
        <div className={style.title}>Company Insights</div>
        <div className={style.subtitle}>Easily check up on your favorite companies.</div>            
        <Search />
      </div>
    );
  }
}

export default App;
