export default function reducer(state={
    courses: [],
    showComponent: false,
    fetching: false,
    fetched: false,
    posting: false,
    posted: false,
    error: null,
    posting_id: null,
    course_id: null
  }, action) {

    switch (action.type) {
      case "SET_COURSES": {
        return {
          ...state,
          courses: action.payload,
        }
      }
      case "TOGGLE_COMPONENT": {
        if (state.showComponent) {
          return{
            ...state,
            showComponent : false
          }
        } else {
          return{
            ...state,
            showComponent : true
          }
        }
      }
      case "SET_SINGLE_COURSE": {
        return {
          ...state,
          course_id: action.course_id,
          posting_id: action.posting_id
        }
      }
      case 'FETCH_COURSES_PENDING': {
        return {
          ...state,
          fetching: true,
          fetched: false,
        }
      }
      case 'FETCH_COURSES_REJECTED': {
        return {
          ...state,
          fetching: false,
          fetched: false,
          error: action.payload,
        }
      }
      case 'FETCH_COURSES_FULFILLED': {
        var data = action.payload.data;
        return {
          ...state,
          fetching: false,
          fetched: true,
          courses: data
        }
      }
      case 'POST_AD_PENDING': {
        return {
          ...state,
          posting: true,
          posted: false,
        }
      }
      case 'POST_AD_REJECTED': {
        return {
          ...state,
          posting: false,
          posted: false,
          error: action.payload,
        }
      }
      case 'POST_AD_FULFILLED': {
        var data = action.payload.data;
        console.log(data)
        return {
          ...state,
          posting: false,
          posted: true,
        }
      }
      default:
        return state
    }
}
