export default function reducer(state={
    course: {
      title: null,
      description: null,
      deadline: null,
    },
    submitting: false,
    submitted: false,
    error: null,
  }, action) {

    switch (action.type) {
      case "SET_COURSE": {
        return {...state, course: action.payload}
      }
        // Get one listing for single view.
        case 'SUBMIT_APPLICANT_PENDING': {
            return {
                ...state,
                submitting: true
            }
        }
        case 'SUBMIT_APPLICANT_REJECTED': {
            return {
                ...state,
                submitting: false,
                submitted: false,
                error: action.payload,
            }
        }
        case 'SUBMIT_APPLICANT_FULFILLED': {
            return {
                ...state,
                submitting: false,
                submitted: true,
                error: null,
            }
        }
      default:
        return state
    }
}
