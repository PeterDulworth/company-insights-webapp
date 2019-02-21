import React, { Component } from 'react';
import { FormControl } from "react-bootstrap";
import styles from './search.module.css';
import { Redirect } from "react-router-dom";

class Search extends Component {

    searchBar;

    constructor(props) {
        super(props);
        this.state = {
            companyData: null,
            redirect: false,
            symbol: '',
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        var text = this.searchBar.value;
        if (text !== "") {
            this.searchBar.value = "";
            this.setState({redirect: true, symbol: text});
        }
    }

    render() {
        const newURL = '/' + this.state.symbol;
        const queryRedirect = <Redirect to={newURL} />;

        return (
            <React.Fragment>
                {this.state.redirect ? 
                    queryRedirect
                    : 
                    <form onSubmit={this.handleSubmit} className="search-form">
                        <FormControl
                        className={[styles.searchBar, styles.search, styles.searchText].join(' ')}
                        placeholder="enter company ticker"
                        ref={b => (this.searchBar = b)}
                        type="string"
                        />
                    </form>
                }
            </React.Fragment>
        );
            
    }
}[styles.foo, styles.bar].join(' ')

export default Search;