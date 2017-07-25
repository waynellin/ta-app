import includes from 'lodash/includes';

export default function reducer(state={
    listings: {},
    queryResults: null,
    listing: {
      course: {},
      fetching: false,
      fetched: false,
      error: null,
    },
    fetching: false,
    fetched: false,
    error: null,
  }, action) {

    switch (action.type) {
      case "SET_LISTINGS": {
        return {
          ...state,
          listings: action.payload,
        }
      }
      case "SET_RANKING": {
        var course = action.payload;

        return {...state, listings:
          {...state.listings,
            [course.id]:
              {...state.listings[course.id],
                ranking: course.ranking}}}

      }

      // Get one listing for single view.
      case 'FETCH_LISTING_PENDING': {
        return {
          ...state,
          listing: {
            ...state.listing,
            fetching: true,
            fetched: false,
          }
        }
      }
      case 'FETCH_LISTING_REJECTED': {
        return {
          ...state,
          listing: {
            ...state.listing,
            fetching: false,
            fetched: false,
            error: action.payload,
          }
        }
      }
      case 'FETCH_LISTING_FULFILLED': {
        var data = action.payload.data[0];

        var date = new Date(data.end_date)

        var deadline = date.getDate() +"-"+ (parseInt(date.getMonth()) + 1) +"-"+ date.getFullYear()

        var id = data._id
        var course_id = data.course_id
        var reqs = data.requirements
        var start_date = data.start_date
        var end_date = deadline
        var course_name = data.course.course_code
        var instructors = data.course.instructor
          var tas_needed = data.course.ta_needed
          var term = data.course.term

        var obj = {
            id: id,
            course_name : course_name,
            ranking: null,
            course_id: course_id,
            requirements: reqs,
            instructors: instructors,
            start_date: start_date,
            end_date: end_date,
            tas_needed: tas_needed,
            term: term
        };

        return {
          ...state,
          listing : {
            ...state.listing,
            course: {
              ...obj
            },
            fetching: false,
            fetched: true,
            error: null,
          }
        }
      }
      // Get all listings for Listings view
      case 'FETCH_LISTINGS_PENDING': {
        return {
          ...state,
          fetching: true,
          fetched: false,
        }
      }
      case 'FETCH_LISTINGS_REJECTED': {
        return {
          ...state,
          fetching: false,
          fetched: false,
          error: action.payload,
        }
      }
      case 'FETCH_LISTINGS_FULFILLED': {
        var data = action.payload.data;
        var listings={};

        for(let i = 0 ; i < data.length ; i++){
          var course = data[i].course;

          var date = new Date(data[i].end_date)

          var deadline = date.getDate() +"-"+ (parseInt(date.getMonth()) + 1) +"-"+ date.getFullYear()
          var id = data[i]._id;
          var course_id = data[i].course_id;
          var posting_id = data[i]._id;
          var reqs = data[i].requirements;
          var start_date = data[i].start_date;
          var end_date = deadline;
          var course_name = course.course_code

          var obj = {
            course_name : course_name,
            ranking: null,
            course_id: course_id,
            requirements: reqs,
            start_date: start_date,
            end_date: end_date,
            posting_id: id
          };

          listings[id] = obj;
        }

        return {
          ...state,
          listings: {
            ...listings
          },
          fetching: false,
          fetched: true,
          error: null,
        }
      }
        case 'QUERY_LISTINGS': {

            if(action.query == ""){
                return{
                    ...state,
                    queryResults: null
                }
            }

            let newState = Object.assign({}, state);
            var listings = newState.listings

            var queryResults = {};
            for(var id in listings){
                if(listings.hasOwnProperty(id) && includes(listings[id].course_name.toLowerCase() +
                        listings[id].requirements.toLowerCase() +
                        listings[id].end_date.toLowerCase(),
                        action.query.toLowerCase())){
                    queryResults[id] = listings[id]
                }
            }
            console.log(queryResults)
            return {
                ...state,
                queryResults: queryResults
            }
        }
        case 'QUERY_RESET': {
            return{
                ...state,
                queryResults: null
            }
        }
      default:
        return state
    }
}
