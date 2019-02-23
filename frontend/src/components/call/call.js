import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import styles from './call.module.css';

class Call extends Component {
    constructor(props) {
        super(props)
        this.state = { analysisRedirect: false }
    }

    getAnalysis = () => {
        this.setState({ analysisRedirect: true })
    }

    render() {
        if (this.state.analysisRedirect) {
            return <Redirect to={{
                    pathname: 'analysis' + this.props.path,
                    state: { title: this.props.name }
                }} />;
        }
        
        return (
            <div className={styles.wrapper}>
                <h4>{this.props.name}</h4>
                <a target="_blank" rel="noopener noreferrer" href={this.props.link}>
                    <button className={[styles.btn, styles.transcriptBtn].join(' ')}>Transcript</button>
                </a> 
                <br/>
                <button onClick={this.getAnalysis} className={[styles.btn, styles.analysisBtn].join(' ')}>Analysis</button>
                <br/>
                <span className={styles.gray}>Written on {this.props.date}.</span>
                <br/>
            </div>
        );
    }
}

export default Call;