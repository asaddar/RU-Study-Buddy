import {
  FETCH_DEPARTMENTS
} from '../actions/types';

export default function(state = [], action) {
  switch(action.type) {
    case FETCH_DEPARTMENTS:
      console.log(action);
      return action.payload;
  }

  return state;
}