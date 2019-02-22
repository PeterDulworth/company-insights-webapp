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
                Click <a target="_blank" href={this.props.link}>here</a> to read the article. <span className={styles.gray}>Written on {this.props.date} by {this.props.author}.</span>
            </div>
        );
    }
}

export default Article;