import React, { Component } from 'react';
import Table from 'react-bootstrap/Table'
import styles from './card.module.css';

class Card extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        var l = [];
        if (this.props.data) {
            l = Object.keys(this.props.data).map(k => <tr key={k}><td>{k}</td><td>{this.props.data[k]}</td></tr>);
        }

        return (
            <div className={styles.wrapper}>
                
                <h2>{this.props.title}</h2>
             
                <hr/>
             
                {this.props.text}

                {this.props.data &&
                 <Table hover> {/* striped bordered */}
                    <tbody>
                        {l}
                    </tbody>
                </Table>
                }

            </div>
        );
    }
}

export default Card;