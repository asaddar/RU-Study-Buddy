import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Link } from 'react-router';

class DepartmentCourses extends Component {
	componentWillMount() {
		this.props.fetchCourses(this.props.params.id);
	}

	renderCourses() {
	  	var courses = this.props.courses.map((course) => {
	  		return <li key={course.courseNumber}><Link to={`/courses/${course.subject}${course.courseNumber}`}>{course.title}</Link></li>
	  	});

	  	return courses;
  	}

	render() {
		if (this.props.courses.length === 0) {
  			return <div>Loading...</div>
  		} else {
		    return (
		      <div><ul>{this.renderCourses()}</ul></div>
		    );
		}
	}
}

function mapStateToProps(state) {
  return { courses: state.courses };
}

export default connect(mapStateToProps, actions)(DepartmentCourses);