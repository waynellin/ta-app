const dummyInbox = [
    {
        posting_id: 1,
        course_name: "csc301",
        status: "Pending"
    },
    {
        posting_id: 2,
        course_name: "csc302",
        status: "Accepted"
    },
    {
        posting_id: 3,
        course_name: "csc303",
        status: "Rejected"
    }
]

export default function reducer(state={
    inbox: [],
    fetching: false,
    fetched: false,
    accepting: false,
    accepted: false,
    error: null
}, action) {
    switch (action.type) {
        case 'FETCH_INBOX_PENDING': {
            return {
                ...state,
                fetching: true,
                fetched: false,
                accepted: false
            };
        }
        case 'FETCH_INBOX_REJECTED': {
            return {
                ...state,
                fetching: false,
                fetched: false,
                error: action.payload.response.data.message
            };
        }
        case 'FETCH_INBOX_FULFILLED': {
            console.log(action.payload.data)

            return {
                ...state,
                inbox: action.payload.data,
                fetched: true,
                fetching: false,
                error: null
            };
        }
        case 'ACCEPT_OFFER_PENDING': {
            return {
                ...state,
                accepting: true,
                accepted: false
            };
        }
        case 'ACCEPT_OFFER_REJECTED': {
            return {
                ...state,
                accepting: false,
                accepted: false,
                error: action.payload.response.data.message
            };
        }
        case 'ACCEPT_OFFER_FULFILLED': {
            return {
                ...state,
                accepted: true,
                accepting: false,
                fetched: false,
                error: null
            };
        }
        default: {
            return state;
        }
    }
}
