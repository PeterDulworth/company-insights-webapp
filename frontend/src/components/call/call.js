import React, { Component } from 'react';
import styles from './call.module.css';

class Call extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.wrapper}>
                <h4>{this.props.name}</h4>
                Click <a target="_blank" href={this.props.link}>here</a> to read a transcript of the call. <span className={styles.gray}>Written on {this.props.date}.</span>
            </div>
        );
    }
}

export default Call;