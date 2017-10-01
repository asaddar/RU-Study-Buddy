import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authReducer from './auth_reducer';
import departmentsReducer from './departments_reducer';
import coursesReducer from './courses_reducer';
import coursePostsReducer from './course_posts_reducer';

const rootReducer = combineReducers({
  form,
  auth: authReducer,
  departments: departmentsReducer,
  courses: coursesReducer,
  coursePosts: coursePostsReducer
});

export default rootReducer;
