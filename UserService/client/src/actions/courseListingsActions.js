export function setCourses() {
  return {
    type: "SET_COURSES",
    payload: {
      1: {title: "CSC301",
      description: "This course is an introduction to the theory and practice of large-scale software system design, development, and deployment. Topics include project management; advanced UML; reverse engineering; requirements inspection; verification and validation software architecture; performance modeling and analysis.",
      deadline: "2017-04-23",
      status: "ASSIGNED",
      showComponent: false,
      ranking: null},
      2: {title: "CSC302",
      description: "This course is an introduction to the theory and practice of large-scale software system design, development, and deployment. Topics include project management; advanced UML; reverse engineering; requirements inspection; verification and validation software architecture; performance modeling and analysis.",
      deadline: "2017-04-23",
      status: "UNASSIGNED",
      showComponent: false,
      ranking: null},
      3: {title: "CSC309",
      description: "This course is an introduction to the theory and practice of large-scale software system design, development, and deployment. Topics include project management; advanced UML; reverse engineering; requirements inspection; verification and validation software architecture; performance modeling and analysis.",
      deadline: "2017-04-23",
      status: "ASSIGNED",
      showComponent: false,
      ranking: null}
    }
  }
}

export function fetchCourses() {
  return function (dispatch) {
    dispatch(setCourses())
  }
}

export function toggleComponent() {
  return {
     type: "TOGGLE_COMPONENT"
  }
}

export function setSingleCourse(state) {
  return {
     type: "SET_SINGLE_COURSE",
     course_id: state.course_id,
     posting_id: state.posting_id
  }
}
