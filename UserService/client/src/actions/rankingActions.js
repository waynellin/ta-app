export function setRanking(state, newRanking) {
  return {
          type: "SET_RANKING",
          payload: {
              id: state.id,
              course_name: state.course_name,
              description: state.description,
              deadline: state.deadline,
              ranking: newRanking
          }
      }
}

export function fetchRankings(requestPromise) {
  return {
    type: 'FETCH_RANKINGS',
    payload: requestPromise
  };
}

export function updateRankings(requestPromise) {
  return {
    type: 'UPDATE_RANKINGS',
    payload: requestPromise
  };
}

export function deleteRanking(id) {
  return {
          type: "DELETE_RANKING",
          payload: {
              id: id,
          }
      }
}
