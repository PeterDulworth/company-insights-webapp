import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import NavBar from "../navbar/navbar"
import Card from "../card/card"
import styles from './callAnalysis.module.css';
import dummyAnalysisData from "../../dummyData/dummyCallAnalysisData"

class CallAnalysis extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            callAnalysisData: null,
            isValid: true,
            isLoaded: false,
        };
        this.fetchCallAnalysis = this.fetchCallAnalysis.bind(this);
    }

    async fetchCallAnalysis() {
        let url = 'http://localhost:5000/call/' + this.props.match.params.articleID; 
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(JSON.stringify(json));
            
            if (json.status === 404) this.setState({ isValid: false, callAnalysisData: json.call, isLoaded: true })
            else this.setState({isValid: true, callAnalysisData: json.call, isLoaded: true})
            
        } catch(e) {
            console.log('Error fetching company earnings calls!', e);
        }
    }

    useDummyData = () => {
        this.setState({isValid: true, callAnalysisData: dummyAnalysisData.call, isLoaded: true})
    }

    componentDidMount() {
        // this.fetchCallAnalysis();
        this.useDummyData();
    }

    componentWillUnmount() {

    }

    render() {
        const callTitle = this.props.location.state.title;
        const callPath = this.props.match.params.articleID;
        return (
            <div className={styles.wrapper}>
            <NavBar title={callTitle}/>
            <Card split={<hr/>} title="Call Analysis" text={"hello world"} data={{"hi": "there"}}/>
            </div>
        );
    }
}

export default CallAnalysis;