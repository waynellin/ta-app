const initialState = {
    user: {},
    authenticating: false,
    authenticated: false,
    error: null,
    status: null,
}


export default function reducer(state=initialState, action) {
  switch (action.type) {
    case 'SET_USER_TYPE': {
      return {
        ...state,
        user: {
          ...state.user,
          user_type: action.payload
        },
        authenticating: false,
        authenticated: false,
        error: null,
        status: null
      }
    }
    case 'USER_AUTHENTICATE_PENDING': {
      return {
        ...state,
        authenticating: true,
        authenticated: false,
        error: null,
        status: null
      }
    }
    case 'USER_AUTHENTICATE_REJECTED': {
      return {
        ...state,
        authenticating: false,
        authenticated: false,
        error: action.payload.response.data.message,
        status: action.payload.response.status
      }
    }
    case 'USER_AUTHENTICATE_FULFILLED': {
      return {
        ...state,
        user: {
          ...action.payload.data.user
        },
        authenticating: false,
        authenticated: true,
        error: null,
        status: action.payload.status
      }
    }
    case 'USER_LOGOUT': {
        return initialState
    }
    default: 
      return state;
  }
}