import React, { Component } from 'react';
import axios from 'axios';

class Verify extends Component {
  static contextTypes = {
      router: React.PropTypes.object
  }

  componentWillMount() {
    console.log(this.props);
    const ROOT_URL = 'http://localhost:3090';
    axios(`${ROOT_URL}/verify`, {
      method: 'PUT',
      mode: 'no-cors',
      data: { token: this.props.params.token },
    }).then(response => {
      console.log(response);
      this.context.router.push('/signin');
    });
  }

  render() {
    return (
      <div>
        Verifying...
      </div>
    );
  }

}

export default Verify;