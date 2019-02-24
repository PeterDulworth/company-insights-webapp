import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import styles from './display.module.css';
import NavBar from "../navbar/navbar"
import Card from '../card/card';
import Article from '../article/article';
import Call from '../call/call';
import dummyCompanyData from '../../dummyData/dummyCompanyData';
import dummyArticlesData from '../../dummyData/dummyArticlesData';
import dummyCallData from '../../dummyData/dummyCallsData';

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
        this.fetchCompanyData= this.fetchCompanyData.bind(this);
        this.fetchArticles= this.fetchArticles.bind(this);
        this.fetchCalls= this.fetchCalls.bind(this);
    }

    async fetchCompanyData() {
        let url = 'http://localhost:5000/symbol' + this.props.symbol; // symbol is really /symbol
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(JSON.stringify(json));

            if (json.status === 404) this.setState({ validData: false, companyData: json.company, dataLoaded: true })
            else this.setState({ validData: true, companyData: json.company, dataLoaded: true })
        } catch(e) {
            console.log('Error fetching company data!', e);
        }
    }

    async fetchArticles() {
        let url = 'http://localhost:5000/symbol/headlines' + this.props.symbol; // symbol is really /symbol
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(JSON.stringify(json));

            if (json.status === 404) this.setState({ companyArticles: json.articles, articlesLoaded: true, validArticles: false })
            else this.setState({ companyArticles: json.articles, articlesLoaded: true, validArticles: true })

        } catch(e) {
            console.log('Error fetching company news articles!', e);
        }
    }

    async fetchCalls() {
        let url = 'http://localhost:5000/symbol/earnings/calls' + this.props.symbol; // symbol is really /symbol
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(JSON.stringify(json));
            
            if (json.status === 404 || !response.ok) this.setState({ validCalls: false, companyCalls: json.calls, callsLoaded: true })
            else this.setState({validCalls: true, companyCalls: json.calls, callsLoaded: true})
            
        } catch(e) {
            console.log('Error fetching company earnings calls!', e);
        }
    }

    useDummyCompanyData = () => {
        this.setState({ validData: true, companyData: dummyCompanyData.company, dataLoaded: true })
    }

    useDummyArticlesData = () => {
        this.setState({ companyArticles: dummyArticlesData.articles, articlesLoaded: true, validArticles: true })
    }

    useDummyCallData = () => {
        this.setState({validCalls: true, companyCalls: dummyCallData.calls, callsLoaded: true})
    }

    componentDidMount() {
        // this.useDummyCompanyData();
        // this.useDummyArticlesData();
        // this.useDummyCallData();
        this.fetchCompanyData();
        this.fetchArticles();
        this.fetchCalls();
    }

    render() {
        const data = this.state.companyData;
        const articles = this.state.companyArticles;
        const calls = this.state.companyCalls;

        let displayData = null;
        // if the data is loaded and valid
        if (this.state.dataLoaded && this.state.validData) {
            displayData = <>
                <NavBar title={data.name} backLink="/" backLinkName="back to search page" />
                <div className={styles.spacer}></div>
                <Card title="Quick Overview" dir={data.netChangeDir} data={{
                    "Price": data.price, 
                    "Net Change": data.netChange, 
                    "Percent Change": data.percentChange,
                    }}/>
                <Card split={<hr/>} title="Company SEC Description" text={data.about}/>
                <Card title="Financial Numbers" data={data.keyStockData}/></>;
        } 
        // if the data is loaded and invalid
        else if (this.state.dataLoaded && !this.state.validData) {
            displayData = <Redirect to={this.props.symbol + '/error'} />;
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
                    {articles.map(a => (<Article key={a.link + a.date} name={a.name} link={a.link} date={a.date} author={a.author}/>))}
                </div></>;
        } 
        // if the data is loaded and invalid
        else if (this.state.articlesLoaded && !this.state.validArticles) {
            displayArticles = <div className={styles.errLoadingWrapper}><h1>error loading articles...</h1></div>;
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
                    {calls.map((c, i) => (<Call key={i} name={c.name} link={c.link} path={c.path} date={c.date} symbol={this.props.symbol} />))}
                </div></>;
        } 
        // if the data is loaded and invalid
        else if (this.state.callsLoaded && !this.state.validCalls) {
            displayCalls = <div className={styles.errLoadingWrapper}><h1>error loading calls...<br/><br/><button onClick={this.fetchCalls} className={styles.reloadBtn}>reload</button></h1></div>;
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