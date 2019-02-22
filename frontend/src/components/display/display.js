import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import styles from './display.module.css';
import NavBar from "../navbar/navbar"
import Card from '../card/card';
import Article from '../article/article';

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

    componentDidMount() {
        let url = 'http://localhost:5000/symbol' + this.props.symbol;
        this.fetchCompanyData(url);
        
        url = 'http://localhost:5000/symbol/headlines' + this.props.symbol;
        this.fetchArticles(url);
    }

    render() {
        const errURL = this.props.symbol + '/error';
        const queryRedirect = <Redirect to={errURL} />;
        const d = this.state.companyData;
        const articles = this.state.companyArticles;

        return (
            <div className={styles.displayWrapper}>
            {this.state.dataLoaded ? 
                (this.state.validResponse ? 
                    <React.Fragment>
                        <NavBar title={d.name}/>
                        <Card title="Quick Overview" dir={d.netChangeDir} data={{
                            "Price": d.price, 
                            "Net Change": d.netChange, 
                            "Percent Change": d.percentChange,
                            }}/>
                        <Card split={<hr/>} title="Company SEC Description" text={d.about}/>
                        <Card title="Financial Numbers" data={d.keyStockData}/>
                    </React.Fragment>
                    :
                    queryRedirect) : 
                <div className={styles.loadingWrapper}>
                    <h1>loading...</h1>
                </div>
            }
            {this.state.articlesLoaded ? 
                (this.state.validArticles ? 
                    <React.Fragment>
                        {articles.map(a => (<Article name={a.name} link={a.link} date={a.date} author={a.author}/>))}
                    </React.Fragment>
                    :
                    queryRedirect) : 
                <div className={styles.loadingWrapper}>
                    <h1>loading...</h1>
                </div>
            }
            </div>
        );
    }
}

export default Display;