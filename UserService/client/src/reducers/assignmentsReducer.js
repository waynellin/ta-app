export default function reducer(state={
  assignment: {},
  assignments: {},
  fetching: false,
  fetched: false,
  creating: false,
  created: true,
  updating: false,
  updated: false,
  error: null
}, action) {
  switch (action.type) {
    case 'CREATE_ASSIGNMENT_PENDING': {
      return {
        ...state,
        creating: true,
        created: false
      };
    }
    case 'CREATE_ASSIGNMENT_REJECTED': {
      return {
        ...state,
        creating: false,
        created: false,
        error: action.payload.response.data.message
      };
    }
    case 'CREATE_ASSIGNMENT_FULFILLED': {
      return {
        ...state,
        assignment: action.payload.data.assignment,
        created: true,
        creating: false,
        fetched: false,
        error: null
      };
    }
    case 'GET_ASSIGNMENTS_PENDING': {
      return {
        ...state,
        updated: false,
        fetching: true,
        fetched: false
      };
    }
    case 'GET_ASSIGNMENTS_REJECTED': {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload.response.data.message
      };
    }
    case 'GET_ASSIGNMENTS_FULFILLED': {
      return {
        ...state,
        assignments: action.payload.data,
        fetched: true,
        fetching: false,
        error: null
      };
    }
    case 'UPDATE_ASSIGNMENTS_PENDING': {
        return {
            ...state,
            updating: true
        }
    }
    case 'UPDATE_ASSIGNMENTS_REJECTED': {
        return {
            ...state,
            updating: false,
            updated: false,
            error: action.payload,
        }
    }
    case 'UPDATE_ASSIGNMENTS_FULFILLED': {
        return {
            ...state,
            updating: false,
            updated: true,
            fetched: false,
            error: null,
        }
    }
    default: {
      return state;
    }
  }
}
