import {
  FETCH_COURSE_POSTS,
  DELETE_POST,
  CREATE_POST
} from '../actions/types';

export default function(state = [], action) {
  switch(action.type) {
  	case FETCH_COURSE_POSTS:
  		console.log(action);
  		return action.payload;
    case DELETE_POST:
    	console.log(action);
    	return state.filter((post) => post._id != action.payload._id);
    case CREATE_POST:
    	console.log(action);
    	return [action.payload].concat(state);
  }

  return state;
}