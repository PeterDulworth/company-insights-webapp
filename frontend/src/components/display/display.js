import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import styles from './display.module.css';
import NavBar from "../navbar/navbar"
import Card from '../card/card';
import Article from '../article/article';
import Call from '../call/call';

class Display extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            companyData: null,
            companyArticles: null,
            companyCalls: null,

            validData: true,
            validArticles: true,
            validCalls: true,

            dataLoaded: false,
            articlesLoaded: false,
            callsLoaded: false,
        };
    }

    async fetchCompanyData(url) {
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(JSON.stringify(json));
            if (json.status === 404) {
                this.setState({validData: false})
            }
            this.setState({ companyData: json.company, dataLoaded: true });
        } catch(e) {
            console.log('Error fetching company data!', e);
        }
    }

    async fetchArticles(url) {
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(JSON.stringify(json));
            if (json.status === 404) {
                this.setState({validArticles: false})
            }
            this.setState({ companyArticles: json.articles, articlesLoaded: true });
        } catch(e) {
            console.log('Error fetching company news articles!', e);
        }
    }

    async fetchCalls(url) {
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(JSON.stringify(json));
            if (json.status === 404) {
                this.setState({validCalls: false})
            }
            this.setState({ companyCalls: json.calls, callsLoaded: true });
        } catch(e) {
            console.log('Error fetching earnings calls!', e);
        }
    }

    componentDidMount() {
        let url = 'http://localhost:5000/symbol' + this.props.symbol;
        this.fetchCompanyData(url);
        
        url = 'http://localhost:5000/symbol/headlines' + this.props.symbol;
        this.fetchArticles(url);

        url = 'http://localhost:5000/symbol/earnings/calls' + this.props.symbol;
        this.fetchCalls(url);
    }

    componentWillUnmount() {

    }

    render() {
        const errURL = this.props.symbol + '/error';
        const queryRedirect = <Redirect to={errURL} />;
        const d = this.state.companyData;
        const articles = this.state.companyArticles;
        const calls = this.state.companyCalls;

        let displayData = null;
        // if the data is loaded and valid
        if (this.state.dataLoaded && this.state.validData) {
            displayData = <>
                <NavBar title={d.name}/>
                <div className={styles.spacer}></div>
                <Card title="Quick Overview" dir={d.netChangeDir} data={{
                    "Price": d.price, 
                    "Net Change": d.netChange, 
                    "Percent Change": d.percentChange,
                    }}/>
                <Card split={<hr/>} title="Company SEC Description" text={d.about}/>
                <Card title="Financial Numbers" data={d.keyStockData}/></>;
        } 
        // if the data is loaded and invalid
        else if (this.state.dataLoaded && !this.state.validData) {
            displayData = queryRedirect;
        } 
        // if the data is not yet loaded
        else {
            displayData = <div className={styles.loadingWrapper}><h1>loading...</h1></div>
        }

        let displayArticles = null;
        // if the data is loaded and valid
        if (this.state.articlesLoaded && this.state.validArticles) {
            displayArticles = <>
                <Card title="Articles" />
                <div className={styles.articleWrapper}>
                    {articles.map(a => (<Article key={a.name} name={a.name} link={a.link} date={a.date} author={a.author}/>))}
                </div></>;
        } 
        // if the data is loaded and invalid
        else if (this.state.articlesLoaded && !this.state.validArticles) {
            displayArticles = <div className={styles.loadingWrapper}><h1>error loading articles...</h1></div>;
        } 
        // if the data is not yet loaded
        else {
            displayArticles = <div className={styles.loadingWrapper}><h1>loading articles...</h1></div>;
        }

        let displayCalls = null;
        // if the data is loaded and valid
        if (this.state.callsLoaded && this.state.validCalls) {
            displayCalls = <>
                <Card title="Earnings Calls" />
                <div className={styles.callsWrapper}>
                    {calls.map(c => (<Call key={c.name} name={c.name} link={c.link} date={c.date} />))}
                </div></>;
        } 
        // if the data is loaded and invalid
        else if (this.state.callsLoaded && !this.state.validCalls) {
            displayCalls = <div className={styles.loadingWrapper}><h1>error loading calls...</h1></div>;
        } 
        // if the data is not yet loaded
        else {
            displayCalls = <div className={styles.loadingWrapper}><h1>loading calls...</h1></div>;
        }

        return (
            <div className={styles.displayWrapper}>
                {displayData}
                {displayArticles}
                {displayCalls}
            </div>
        );
    }
}

export default Display;