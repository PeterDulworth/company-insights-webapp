import React from "react";
import styles from "./navbar.module.css";

class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar fixed-top navbar-light bg-light">
        <div className={["navbar-brand mb-0 h2", styles.az].join(" ")}>
          <b>
            <h2 className={styles.gradText}>warmup project</h2>
          </b>
        </div>
        <span className="navbar-text">
          <a
            href="/"
            className={styles.az}
          >
            built for comp 410
          </a>
        </span>
      </nav>
    );
  }
}

export default Nav;
