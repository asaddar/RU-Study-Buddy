import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_DEPARTMENTS,
  FETCH_COURSES,
  FETCH_COURSE_POSTS,
  DELETE_POST,
  CREATE_POST
} from './types';

const ROOT_URL = 'http://localhost:3090';

export function signinUser({ email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signin`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', response.data.email);
        browserHistory.push('/departments');
      })
      .catch(() => {
        dispatch(authError('Bad Login Info or Account Not Verified'));
      });
  }
}

export function signupUser({ firstName, lastName, email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signup`, { firstName, lastName, email, password })
      .then(response => {
        console.log("signup", response.data);
      })
      .catch(response => dispatch(authError(response.data.error)));
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function signoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('email');

  return { type: UNAUTH_USER };
}

export function fetchCourses(id) {
  return function(dispatch) {
    console.log("firing off request");
    axios.get(`${ROOT_URL}/departments/${id}/courses`, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        console.log(response);
        dispatch({
          type: FETCH_COURSES,
          payload: response.data
        });
      });
  }
}

export function fetchDepartments() {
  return function(dispatch) {
    console.log("firing off request");
    axios.get(`${ROOT_URL}/departments`, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        console.log(response);
        dispatch({
          type: FETCH_DEPARTMENTS,
          payload: response.data
        });
      });
  }
}

export function fetchCoursePosts(id) {
  return function(dispatch) {
    console.log("hit fetchcourseposts");
    axios.get(`${ROOT_URL}/courses/${id}/posts`, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        console.log(response);
        dispatch({
          type: FETCH_COURSE_POSTS,
          payload: response.data
        });
      });
  }
}

export function createPost(id, professor, message) {
  return function(dispatch) {
    axios(`${ROOT_URL}/courses/${id}/posts`, {
      method: 'POST',
      mode: 'no-cors',
      data: { professor, message },
      headers: {
        authorization: localStorage.getItem('token')
      },
    }).then(response => {
      console.log(response);
      dispatch({
          type: CREATE_POST,
          payload: response.data
      });
    });
  }
}

export function deletePost(id) {
  return function(dispatch) {
    axios.delete(`${ROOT_URL}/posts/${id}`, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        console.log(response);
        dispatch({
          type: DELETE_POST,
          payload: response.data
        });
      });
  }
}
