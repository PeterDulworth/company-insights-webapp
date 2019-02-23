import React, { Component } from 'react';
import { FormControl } from "react-bootstrap";
import styles from './search.module.css';
import { Redirect } from "react-router-dom";

class Search extends Component {

    searchBar;

    constructor(props) {
        super(props);
        this.state = {
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

        return (
            <React.Fragment>
                {this.state.redirect ? 
                    <Redirect to={newURL} />
                    : 
                    <form onSubmit={this.handleSubmit} className="search-form">
                        <FormControl
                        className={[styles.searchBar, styles.search, styles.searchText].join(' ')}
                        placeholder="enter company ticker"
                        ref={sb => (this.searchBar = sb)}
                        type="string"
                        />
                    </form>
                }
            </React.Fragment>
        );
            
    }
}

export default Search;