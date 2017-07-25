export default function reducer(state={
    headings: {
      title: "Welcome",
      caption: "Your search for TAship starts here."
    },
    error: null,
  }, action) {

    switch (action.type) {
      case "SET_HEADINGS": {
        return {...state, headings: action.payload}
      }
      default:
        return state
    }
}
