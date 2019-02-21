import React, { Component } from 'react';
import styles from './card.module.css';

class Card extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.wrapper}>
                hello
            </div>
        );
    }
}

export default Card;