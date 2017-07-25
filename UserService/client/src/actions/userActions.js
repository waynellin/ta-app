export function setUserType(userType){
  return {
    type: 'SET_USER_TYPE',
    payload: userType
  };
}

export function userPasswordError(error) {
  return {
    type: 'USER_PASSWORD_ERROR',
    payload: error
  };
}

export function userEmailError(error) {
  return {
    type: 'USER_EMAIL_ERROR',
    payload: error
  };
}

export function userAccessKeyError(error) {
  return {
    type: 'USER_ACCESS_KEY_ERROR',
    payload: error
  };
}

export function userAuthenticate(requestPromise) {
  return {
    type: 'USER_AUTHENTICATE',
    payload: requestPromise
  };
}

export function userEmailValid() {
  return {
    type: 'USER_EMAIL_VALID'
  };
}

export function userPasswordValid() {
  return {
    type: 'USER_PASSWORD_VALID'
  };
}

export function userAccessKeyValid() {
  return {
    type: 'USER_ACCESS_KEY_VALID'
  };
}

export function logout() {
    return {
        type: 'USER_LOGOUT'
    };
}