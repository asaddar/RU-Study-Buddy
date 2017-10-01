import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import axios from 'axios';
import Modal from 'react-modal';
import { reduxForm } from 'redux-form';

class CreatePostModal extends Component {
	constructor() {
	    super();
	 
	    this.state = {
	      modalIsOpen: false,
	      professors: []
	    };
	 
	    this.openModal = this.openModal.bind(this);
	    this.afterOpenModal = this.afterOpenModal.bind(this);
	    this.closeModal = this.closeModal.bind(this);
  	}

  	openModal() {
  		console.log("IN NEW MODAL", this.props);
	    const ROOT_URL = 'http://localhost:3090';
	    axios.get(`${ROOT_URL}/courses/${this.props.id}/professors`, {
	      headers: { authorization: localStorage.getItem('token') }
	    })
	      .then(response => {
	        this.setState({professors: response.data.professors});
	        this.setState({modalIsOpen: true});
	      });
  	}

  	afterOpenModal() {
    	console.log("OPENED MODAL");
  	}
 
  	closeModal() {
    	this.setState({modalIsOpen: false});
  	}

  	renderProfessors() {
	    var professors = this.state.professors.map((professor) => {
	      return <option value={professor}>{professor}</option>
	    });

	    return professors;
  	}

  	handleFormSubmit(formProps) {
	    this.props.createPost(this.props.id, formProps.professor, formProps.message);
	    this.setState({modalIsOpen: false});
  	}

	render() {
		const { handleSubmit, fields: { professor, message }} = this.props;
	    const customStyles = {
	      content : {
	        top: '50%',
	        left: '50%',
	        right: 'auto',
	        bottom: 'auto',
	        marginRight: '-50%',
	        transform: 'translate(-50%, -50%)'
	      }
	    };
	    return (
	      <div>
	        <button onClick={this.openModal}>create a post</button>

	        <Modal
	          isOpen={this.state.modalIsOpen}
	          onAfterOpen={this.afterOpenModal}
	          onRequestClose={this.closeModal}
	          style={customStyles}
	          contentLabel="Create Post"
	        >
	          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
	            <fieldset>
	              <label>professor:</label>
	              <select name="professor" {...professor} >
	                <option value="">Select a professor...</option>
	                {this.renderProfessors()}
	              </select>
	              {professor.touched && professor.error && <div>{professor.error}</div>}
	            </fieldset>
	            <fieldset>
	              <label>message:</label>
	              <textarea {...message} />
	              {message.touched && message.error && <div>{message.error}</div>}
	            </fieldset>
	            <button action="submit">submit</button>
	          </form>

	          <button onClick={this.closeModal}>close</button>
	        </Modal>
	      </div>
	    );
	}
}

function validate(formProps) {
  const errors = {};

  if (!formProps.professor) {
    errors.professor = 'Please pick a professor';
  }

  if (!formProps.message) {
    errors.message = 'Please enter a message';
  }

  return errors;
}

export default reduxForm({
  form: 'createPost',
  fields: ['professor', 'message'],
  validate
}, null, actions)(CreatePostModal);