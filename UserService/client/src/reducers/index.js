import { combineReducers } from 'redux';
import InboxReducer from './reducer-inbox';
import ApplicantReducer from './reducer-applicants';
import listings from "./listingsReducer";
import headings from "./headingsReducer";
import rankings from "./rankingReducer";
import application from "./applicationReducer";
import userReducer from './userReducer';
import courses from "./courseReducer";
import assignments from './assignmentsReducer';

export default combineReducers({
    courses,
    rankings,
    listings,
    headings,
    assignments,
	inbox: InboxReducer,
	applicants: ApplicantReducer,
    application,
    user: userReducer
});
