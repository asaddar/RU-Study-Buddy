import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Link } from 'react-router';
import axios from 'axios';
import Modal from 'react-modal';
import { reduxForm } from 'redux-form';
import CreatePostModal from './create_post_modal';

class Course extends Component {
  constructor() {
    super();
 
    this.state = {
      modalIsOpen: false,
      connectedWith: ""
    };
 
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    console.log("CONNECTION MADE AND MODAL OPENED");
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentWillMount() {
    this.props.fetchCoursePosts(this.props.params.id);
  }

  onConnect(postId, buttonRef, author) {
    const ROOT_URL = 'http://localhost:3090';
    this.refs[buttonRef].disabled = true;
    this.refs[buttonRef].innerHTML = "CONNECTED";
    axios(`${ROOT_URL}/connect`, {
      method: 'PUT',
      mode: 'no-cors',
      data: { id: postId },
      headers: {
        authorization: localStorage.getItem('token')
      },
    }).then(response => {
      console.log(response);
      this.setState({connectedWith: author});
      this.setState({modalIsOpen: true});
    });
  }

  onDelete(postId) {
    this.props.deletePost(postId);
  }

  renderCoursePosts() {
    if(this.props.coursePosts.length === 0) {
      return (
        <div> No posts </div>
      );
    }

    var index = 0;
  	var posts = this.props.coursePosts.map((post) => {
      var connected = post.connectedUsers.indexOf(localStorage.email) > -1;
      console.log(connected);
      var buttonRef = "connect-" + index++;
  		return <li key={post._id}>
        <table>

          <tr>
            <td>{post.author.fullName}</td>
          </tr>

          <tr>
            <td> {post.professor} </td>
          </tr>

          <tr>
            <td>{post.message}</td>
          </tr>

        </table>

        {connected && <button disabled>CONNECTED</button>}
        {!connected && localStorage.email !== post.author.email && <button ref={buttonRef} onClick={()=>this.onConnect(post._id, buttonRef, post.author.fullName)}>CONNECT</button>}
        {!connected && localStorage.email === post.author.email && <button onClick={()=>this.onDelete(post._id)}>DELETE</button> }
      </li>
  	});

  	return posts;
  }

  render() {
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
        <CreatePostModal id={this.props.params.id}/>
        <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Connection Made"
        >
            <p>you have connected with {this.state.connectedWith}! we've just connected both of you right now via email so be sure to check your inbox to make the next steps and get in touch with each other!</p>
            <button onClick={this.closeModal}>close</button>
        </Modal>

        <ul>{this.renderCoursePosts()}</ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { coursePosts: state.coursePosts };
}

export default connect(mapStateToProps, actions)(Course);
