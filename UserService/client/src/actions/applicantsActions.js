export function fetchApplicants(requestPromise) {
    return {
        type: 'FETCH_APPLICANTS',
        payload: requestPromise
    };
}

export function fetchAllRankings(requestPromise) {
    return {
        type: 'FETCH_ALLRANKINGS',
        payload: requestPromise
    };
}

export function fetchUnassigned(requestPromise) {
    return {
        type: 'FETCH_UNASSIGNED',
        payload: requestPromise
    };
}

export function setApplicants(applicants) {
    return {
        type: 'SET_APPLICANTS',
        payload: applicants
    };
}

export function submitProfile(requestPromise) {
    return {
        type: 'SUBMIT_APPLICANT',
        payload: requestPromise
    };
}
