import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import NavBar from "../navbar/navbar"
import styles from './callAnalysis.module.css';

class CallAnalysis extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            analysis: null,
            isValid: true,
            isLoaded: false,
        };
        this.fetchAnalysis = this.fetchAnalysis.bind(this);
    }

    async fetchAnalysis() {
        let url = 'http://localhost:5000/call/' + this.props.match.params.articleID; 
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(JSON.stringify(json));
            
            if (json.status === 404) this.setState({ isValid: false, analysis: json.calls, isLoaded: true })
            else this.setState({isValid: true, analysis: json.calls, isLoaded: true})
            
        } catch(e) {
            console.log('Error fetching company earnings calls!', e);
        }
    }

    componentDidMount() {
        this.fetchAnalysis();
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <NavBar title={this.props.match.params.articleID}/>
        );
    }
}

export default CallAnalysis;