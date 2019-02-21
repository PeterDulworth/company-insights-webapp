import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import styles from './display.module.css';
import NavBar from "../navbar/navbar"
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
        this.setState({ companyData: json.company, dataLoaded: true });
    }

    componentDidMount() {
        let url = 'http://localhost:5000/symbol' + this.props.symbol;
        this.fetchCompanyData(url);
    }

    render() {
        const errURL = this.props.symbol + '/error';
        const queryRedirect = <Redirect to={errURL} />;
        const d = this.state.companyData;

        return (
            <React.Fragment>
            {this.state.dataLoaded ? 
                (this.state.validResponse ? 
                    <React.Fragment>
                        <NavBar title={d.name}/>
                        <div className={styles.displayWrapper}>
                            <Card title="Quick Overview" text={"Percent Change: " + d.percentChange + "Net Change: " + d.netChange + "\nPrice: " + d.price}/>
                            <Card title="Company SEC Description" text={d.about}/>
                            <Card title="Financial Numbers" data={d.keyStockData}/>
                        </div>
                    </React.Fragment>
                    :
                    queryRedirect) : 
                <div className={styles.loadingWrapper}>
                    <h1>loading...</h1>
                </div>
            }
            </React.Fragment>
        );
    }
}

export default Display;