import React, { Component } from 'react';
import styles from './article.module.css';

class Article extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.wrapper}>
                <h4>{this.props.name}</h4>
                <a href="{this.props.link}">link</a>
                Date: {this.props.date}                
                Author: {this.props.author}                
            </div>
        );
    }
}

export default Article;