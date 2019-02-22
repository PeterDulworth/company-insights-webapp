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
            validResponse: true,
            dataLoaded: false,
            companyArticles: null,
            validArticles: true,
            articlesLoaded: false,
            companyCalls: null,
            validCalls: true,
            callsLoaded: false,
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

    async fetchArticles(url) {
        const response = await fetch(url);
        const json = await response.json();
        console.log(JSON.stringify(json));
        if (json.status === 404) {
            this.setState({validArticles: false})
        }
        this.setState({ companyArticles: json.articles, articlesLoaded: true });
    }

    async fetchCalls(url) {
        const response = await fetch(url);
        const json = await response.json();
        console.log(JSON.stringify(json));
        if (json.status === 404) {
            this.setState({validCalls: false})
        }
        this.setState({ companyCalls: json.calls, callsLoaded: true });
    }

    componentDidMount() {
        let url = 'http://localhost:5000/symbol' + this.props.symbol;
        this.fetchCompanyData(url);
        
        url = 'http://localhost:5000/symbol/headlines' + this.props.symbol;
        this.fetchArticles(url);

        url = 'http://localhost:5000/symbol/earnings/calls' + this.props.symbol;
        this.fetchCalls(url);
    }

    render() {
        const errURL = this.props.symbol + '/error';
        const queryRedirect = <Redirect to={errURL} />;
        const d = this.state.companyData;
        const articles = this.state.companyArticles;
        const calls = this.state.companyCalls;

        return (
            <div className={styles.displayWrapper}>
            {this.state.dataLoaded ? 
                (this.state.validResponse ? 
                    <>
                        <NavBar title={d.name}/>
                        <div className={styles.spacer}></div>
                        <Card title="Quick Overview" dir={d.netChangeDir} data={{
                            "Price": d.price, 
                            "Net Change": d.netChange, 
                            "Percent Change": d.percentChange,
                            }}/>
                        <Card split={<hr/>} title="Company SEC Description" text={d.about}/>
                        <Card title="Financial Numbers" data={d.keyStockData}/>
                    </>
                    :
                    queryRedirect) : 
                <div className={styles.loadingWrapper}>
                    <h1>loading...</h1>
                </div>
            }
            {this.state.articlesLoaded ? 
                (this.state.validArticles ? 
                    <>
                        <Card title="Articles" />
                        <div className={styles.articleWrapper}>
                            {articles.map(a => (<Article key={a.name} name={a.name} link={a.link} date={a.date} author={a.author}/>))}
                        </div>
                    </>
                    :
                    <div className={styles.loadingWrapper}>
                        <h1>error loading articles...</h1>
                    </div>
                    ) : 
                <div className={styles.loadingWrapper}>
                    <h1>loading articles...</h1>
                </div>
            }
            {this.state.callsLoaded ? 
                (this.state.validCalls ? 
                    <>
                        <Card title="Earnings Calls" />
                        <div className={styles.callsWrapper}>
                            {calls.map(c => (<Call key={c.name} name={c.name} link={c.link} date={c.date} />))}
                        </div>
                    </>
                    :
                    <div className={styles.loadingWrapper}>
                        <h1>error loading calls...</h1>
                    </div>
                    ) : 
                <div className={styles.loadingWrapper}>
                    <h1>loading calls...</h1>
                </div>
            }
            </div>
        );
    }
}

export default Display;