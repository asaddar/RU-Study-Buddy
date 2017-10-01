import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class Header extends Component {
  renderLinks() {
    if (this.props.authenticated) {
      return <li>
        <Link to="/signout">sign out</Link>
      </li>
    } else {
      return [
        <li key={1}>
          <Link to="/signin">sign in</Link>
        </li>,
        <li key={2}>
          <Link to="/signup">sign up</Link>
        </li>
      ];
    }
  }

  render() {
    return (
      <nav>
        <Link to="/">ru study buddy</Link>
        <ul>
          {this.renderLinks()}
        </ul>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect(mapStateToProps)(Header);
