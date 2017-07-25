export function createAssignment(promise) {
  return {
    type: 'CREATE_ASSIGNMENT',
    payload: promise
  }
}

export function getAssignments(promise) {
  return {
    type: 'GET_ASSIGNMENTS',
    payload: promise
  }
}

export function updateAssignments(requestPromise) {
  return {
    type: 'UPDATE_ASSIGNMENTS',
    payload: requestPromise
  };
}
