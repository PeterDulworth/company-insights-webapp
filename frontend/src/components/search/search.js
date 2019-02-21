import React, { Component } from 'react';
import { FormControl } from "react-bootstrap";
import styles from './search.module.css';

class Search extends Component {

    searchBar;

    constructor(props) {
        super(props);
        this.state = {
            companyData: null
        };
    }

    async fetchCompanyData(url) {
        const response = await fetch(url);
        const json = await response.json();
        console.log(JSON.stringify(json));
        if (json.status === 404) {
            alert("Invalid ticker.\n Please try again!")
        }
        this.setState({ companyData: json });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        var text = this.searchBar.value;
        if (text !== "") {
            let url = 'http://localhost:5000/symbol/' + text
            this.fetchCompanyData(url);
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