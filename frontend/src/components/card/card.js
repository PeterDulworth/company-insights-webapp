import React, { Component } from 'react';
import Table from 'react-bootstrap/Table'
import styles from './card.module.css';

class Card extends Component {
    render() {
        var l = [];
        if (this.props.data) {
            l = Object.keys(this.props.data).map(k => 
                <tr key={k}>
                    <td>{k}</td>
                    {k === "Net Change" || k === "Percent Change" ?
                        (this.props.dir === 'incr' ? 
                            <td className={styles.green}>+{this.props.data[k]}</td>
                            :
                            <td className={styles.red}>-{this.props.data[k]}</td>
                        )
                        :
                        <td>{this.props.data[k]}</td>
                    }
                </tr>
            );
        }

        return (
            <div className={styles.wrapper}>
                <h2>{this.props.title}</h2>
                {this.props.split}
                {this.props.text}
                
                {this.props.data &&
                    <>
                        <br/>
                        <Table hover><tbody>{l}</tbody></Table>
                    </>
                }
                {this.props.children}
            </div>
        );
    }
}

export default Card;