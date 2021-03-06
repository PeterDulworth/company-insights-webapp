import React from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";

class Nav extends React.Component {
  render() {
    return (
      <nav className="navbar fixed-top navbar-light bg-light">
        <div className={["navbar-brand mb-0 h2", styles.az].join(' ')}>
          <b>
            <h2 className={styles.gradText}>{this.props.title}</h2>
          </b>
        </div>
        <span className={styles.gradText}>
          <Link to={this.props.backLink} className={[styles.gradText, styles.az].join(' ')}>{this.props.backLinkName}</Link>
        </span>
      </nav>
    );
  }
}

export default Nav;
