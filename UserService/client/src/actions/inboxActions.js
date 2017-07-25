export function fetchInbox(requestPromise) {
    return {
        type: 'FETCH_INBOX',
        payload: requestPromise
    };
}

export function acceptOffer(requestPromise) {
    return {
        type: 'ACCEPT_OFFER',
        payload: requestPromise
    };
}