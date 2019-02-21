import React, { Component } from 'react';
import { FormControl } from "react-bootstrap";
import styles from './search.module.css';

class Search extends Component {

    searchBar;

    handleSubmit = (event) => {
        event.preventDefault();
        var text = this.searchBar.value;
        if (text !== "") {
            let url = 'http://localhost:5000/symbol/' + text
            fetch(url)
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    console.log(JSON.stringify(myJson));
                });
            this.searchBar.value = "";
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="search-form">
                <FormControl
                  className={[styles.searchBar, styles.search, styles.searchText].join(' ')}
                  placeholder="enter company ticker"
                  ref={b => (this.searchBar = b)}
                  type="string"
                />
              </form>
        );
    }
}[styles.foo, styles.bar].join(' ')

export default Search;