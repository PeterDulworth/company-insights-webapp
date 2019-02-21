import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import styles from './display.module.css';
import Card from '../card/card';

class Display extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            companyData: null,
            validResponse: true,
            dataLoaded: false,
        };
    }

    async fetchCompanyData(url) {
        const response = await fetch(url);
        const json = await response.json();
        console.log(JSON.stringify(json));
        if (json.status === 404) {
            this.setState({validResponse: false})
        }
        this.setState({ companyData: json, dataLoaded: true });
    }

    componentDidMount() {
        let url = 'http://localhost:5000/symbol' + this.props.symbol;
        this.fetchCompanyData(url);
    }

    render() {
        const errURL = this.props.symbol + '/error';
        const queryRedirect = <Redirect to={errURL} />;

        return (
            <React.Fragment>
            {this.state.dataLoaded ? 
                (this.state.validResponse ? 
                    <div className={styles.displayWrapper}>
                        <Card />
                        <Card />
                        <Card />
                    </div>
                    :
                    queryRedirect) : 
                <div className={styles.displayWrapper}>
                    <h1>loading...</h1>
                </div>
            }
            </React.Fragment>
        );
    }
}

export default Display;