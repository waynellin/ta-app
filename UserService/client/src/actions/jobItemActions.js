export function setCourse(state) {
  return {
          type: "SET_COURSE",
          payload: {
              title: state.title,
              description: state.description,
              deadline: state.deadline,
              status: state.status
          }
      }
}
