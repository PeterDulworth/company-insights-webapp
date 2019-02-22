import React, { Component } from 'react';
import styles from './article.module.css';

class Article extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.wrapper}>
                {this.props.name}                
                {this.props.date}                
                {this.props.link}                
                {this.props.author}                
            </div>
        );
    }
}

export default Article;