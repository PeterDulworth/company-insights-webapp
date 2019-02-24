import React, { Component } from 'react';
import NavBar from "../navbar/navbar"
import Card from "../card/card"
import styles from './callAnalysis.module.css';
import Table from 'react-bootstrap/Table'
import dummyAnalysisData from "../../dummyData/dummyCallAnalysisData"

function Person(props) {
    return <div className={styles.person}>{props.name}</div>;
}

function Tone(props) {
    return <div className={styles.tone}>{props.tone} <span className={props.score > 0.6 ? styles.green : styles.red}>{props.score}%</span></div>;
}

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
        let url = 'http://localhost:5000/call/' + this.props.match.params.articleID; // the URL param
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(JSON.stringify(json));
            
            if (json.status === 404) this.setState({ isValid: false, callAnalysisData: json.call, isLoaded: true })
            else this.setState({isValid: true, callAnalysisData: json.call, isLoaded: true})
            
        } catch(e) {
            console.log('Error fetching earnings call analysis!', e);
        }
    }

    useDummyData = () => {
        this.setState({isValid: true, callAnalysisData: dummyAnalysisData.call, isLoaded: true})
    }

    componentDidMount() {
        this.fetchCallAnalysis();
        // this.useDummyData();
    }

    render() {
        const callTitle = this.props.location.state.title; // passed in using the "state" of the react router redirect
        const data = this.state.callAnalysisData;

        let displayData = null;
        // if the data is loaded and valid
        if (this.state.isLoaded && this.state.isValid) {
            const rows = Object.keys(data.stats).map(k => 
                <tr key={k}>
                    <td><strong>{k}</strong></td>
                    <td>{data.stats[k]['asked']}</td>
                    <td>{data.stats[k]['answered']}</td>
                </tr>
            );
            displayData =
             <div className={styles.wrapper}>
                <Card split={<hr/>} title="Participants">
                    <div className={styles.personContainer}>{data.participants.map((p, i) => <Person key={i} name={p} />)}</div>
                </Card>
                
                {console.log(data.tones)}
                <Card split={<hr/>} title="Tone Analysis">
                    <div className={styles.tonesContainer}>{data.tones.map((t, i) => <Tone key={i} tone={t['tone_name']} score={t['score']} />)}</div>
                </Card>
                
                <Card title="Participation Analysis" ><br/>
                    <Table hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Questions Asked</th>
                                <th>Questions Answered</th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </Table>
                </Card>
                
                <Card split={<hr/>} title="Call Transcript">
                    <div className={styles.alignLeft}>{data.text.map((p, i) => <p key={i}>{p}</p>)}</div>
                </Card>
            </div>
        } 
        // if the data is loaded and invalid
        else if (this.state.isLoaded && !this.state.isValid) {
            displayData = <div className={styles.loadingWrapper}><h1>error loading call analysis...</h1><p>this is usually caused by scraping seeking alpha too frequently. when they detect this they temporarily block the IP.</p></div>;
        } 
        // if the data is not yet loaded
        else {
            displayData = <div className={styles.loadingWrapper}><h1>loading...</h1></div>
        }

        return (
            <>
                <NavBar title={callTitle} backLink={this.props.location.state.symbol} backLinkName={"back to " + this.props.location.state.symbol.substring(1)}/>
                {displayData}
            </>
        );
    }
}

export default CallAnalysis;