import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';

class Signup extends Component {
  constructor() {
    super();
 
    this.state = {
      formSubmitted: false
    };
  }

  handleFormSubmit(formProps) {
    this.props.signupUser(formProps);
    this.setState({formSubmitted: true});
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div>
          <strong>error</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  render() {
    if (this.state.formSubmitted) {
      return (
        <div>
          An email has been sent to you to verify your account
        </div>
      )
    }

    const { handleSubmit, fields: { firstName, lastName, email, password, passwordConfirm }} = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset>
          <label>First Name:</label>
          <input {...firstName} />
          {firstName.touched && firstName.error && <div>{firstName.error}</div>}
        </fieldset>
        <fieldset>
          <label>Last Name:</label>
          <input {...lastName} />
          {lastName.touched && lastName.error && <div>{lastName.error}</div>}
        </fieldset>
        <fieldset>
          <label>Email:</label>
          <input {...email} />
          {email.touched && email.error && <div>{email.error}</div>}
        </fieldset>
        <fieldset>
          <label>Password:</label>
          <input {...password} type="password" />
          {password.touched && password.error && <div>{password.error}</div>}
        </fieldset>
        <fieldset>
          <label>Confirm Password:</label>
          <input {...passwordConfirm} type="password" />
          {passwordConfirm.touched && passwordConfirm.error && <div>{passwordConfirm.error}</div>}
        </fieldset>
        {this.renderAlert()}
        <button action="submit">Sign up!</button>
      </form>
    );
  }
}

function validate(formProps) {
  const errors = {};

  if (!formProps.firstName) {
    errors.firstName = 'Please enter a name';
  }

  if (!formProps.lastName) {
    errors.lastName = 'Please enter a last name';
  }

  if (!formProps.email) {
    errors.email = 'Please enter an email';
  }

  if (!formProps.password) {
    errors.password = 'Please enter a password';
  }

  if (!formProps.passwordConfirm) {
    errors.passwordConfirm = 'Please enter a password confirmation';
  }

  if (formProps.password !== formProps.passwordConfirm) {
    errors.password = 'Passwords must match';
  }

  return errors;
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default reduxForm({
  form: 'signup',
  fields: ['firstName', 'lastName', 'email', 'password', 'passwordConfirm'],
  validate
}, mapStateToProps, actions)(Signup);
