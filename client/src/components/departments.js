import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Link } from 'react-router';

class Departments extends Component {
  componentWillMount() {
    this.props.fetchDepartments();
  }

  renderDepartments() {
  	var departments = this.props.departments.map((department) => {
  		return <li key={department.code}><Link to={`/departments/${department.code}`}>{department.description}</Link>
  		</li>
  	});

  	return departments;
  }

  render() {
  	if (this.props.departments.length === 0) {
  		return <div>Loading...</div>
  	} else {
	    return (
	      <div><ul>{this.renderDepartments()}</ul></div>
	    );
	}
  }
}

function mapStateToProps(state) {
  return { departments: state.departments };
}

export default connect(mapStateToProps, actions)(Departments);
