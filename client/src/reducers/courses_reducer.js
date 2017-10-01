import {
  FETCH_COURSES
} from '../actions/types';

export default function(state = [], action) {
  switch(action.type) {
    case FETCH_COURSES:
      console.log(action);
      return action.payload;
  }

  return state;
}