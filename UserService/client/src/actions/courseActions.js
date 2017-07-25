export function setCourses(state) {
  return {
          type: "SET_COURSES",
          payload: {
              title: state.title,
              description: state.description,
              deadline: state.deadline,
              status: state.status,
              showComponent: state.showComponent,
          }
      }
}

export function fetchCourses(requestPromise) {
  return {
          type: "FETCH_COURSES",
          payload: requestPromise
      }
}

export function postAd(requestPromise) {
  return {
          type: "POST_AD",
          payload: requestPromise
      }
}
