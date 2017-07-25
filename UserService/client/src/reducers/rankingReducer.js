export default function reducer(state={
    topJobs: {1:null,2:null,3:null,4: null ,5: null},
    jobsRanked: false,
    change: false,
    fetching: false,
    fetched: false,
    setting: false,
    set: false,
    error: null,
  }, action) {

    switch (action.type) {
      case 'FETCH_RANKINGS_PENDING': {
        return {
          ...state,
          fetching: true,
          fetched: false,
        }
      }
      case 'FETCH_RANKINGS_REJECTED': {
        return {
          ...state,
          fetching: false,
          fetched: false,
          error: action.payload,
        }
      }
      case 'FETCH_RANKINGS_FULFILLED': {
        var data = action.payload.data.rankings;

        var rankings = {1:null,2:null,3:null,4: null ,5: null}

        for(var i = 0; i< data.length; i++){
          var ranking = data[i]
          rankings[ranking.rank] = {
            id: ranking.posting_id,
            course_name: ranking.course_code
          }
        }

        return {
          ...state,
          fetching: false,
          fetched: true,
          topJobs: rankings,
          jobsRanked: true 
        }
      }
      case 'UPDATE_RANKINGS_PENDING': {
        return {
          ...state,
          change: false,
          error: null,
          setting: true,
          set: false,
        }
      }
      case 'UPDATE_RANKINGS_REJECTED': {
        return {
          ...state,
          setting: false,
          set: false,
          change: false,
          error: action.payload,
        }
      }
      case 'UPDATE_RANKINGS_FULFILLED': {
        var data = action.payload.data;

        return {
          ...state,
          setting: false,
          set: true,
          jobsRanked: true
        }
      }
      case "DELETE_RANKING": {
        var load = action.payload;
        let newState = Object.assign({}, state);
        var object = newState.topJobs

        for (var rank in object) {
            if (object.hasOwnProperty(rank) && object[rank] != null) {
              if(object[rank].id === load.id){
                  newState = {...newState,
                            topJobs:
                              {...newState.topJobs,
                                [rank]: null}}
                  break;
              }
            }
        }
        
        var max = 0;
        for (var rank in object) {
            if (object.hasOwnProperty(rank)) {
                if(object[rank] != null && rank > max) max=rank;
            }
        }  

        var object = newState.topJobs
        var temp1 = {1:null,2:null,3:null,4: null ,5: null};
        for (var rank in object) {
            if (object.hasOwnProperty(rank) && rank<max && object[rank] == null) {
              //this is a gap, all after this rank need to be moved up
              var i;
              for(i = 1; i <= 5; i++ ){
                if(i > rank ){
                  temp1[i-1] = object[i]
                }
                else{
                  temp1[i] = object[i]
                }
              }
              newState.topJobs = Object.assign({}, temp1);
              break;
            }
        }
        newState.change = true;
        return newState

      }
      case "SET_RANKING": {
        var load = action.payload;
        let newState = Object.assign({}, state);
        var topJobs = newState.topJobs;
        // check if the course is in the rankings already
        var ranked = 0;
        object = newState.topJobs
        for (var rank in object) {
            if (object.hasOwnProperty(rank) && object[rank] != null) {
              if(object[rank].id === load.id){
                // useless ranking
                if (load.ranking === parseInt(rank)){
                  return state
                }
                else{
                  ranked = rank;
                  newState = {...newState,
                            topJobs:
                              {...newState.topJobs,
                                [rank]: null}}
                  break;
                }
              }
            }
        }
        var newRanking ={
          course_name: load.course_name,
          id: load.id
        };

        // if its ranked already, the ones above it get new spot above it
        // downgrade needs to be treated differently
        if(ranked && ranked < load.ranking){
          console.log("downgrade");
          var object = newState.topJobs
          var temp1 = {};
          var temp2 = {};
          for(var rank in object){
            if(object.hasOwnProperty(rank)){
              if(parseInt(rank) >= ranked && parseInt(rank) < load.ranking){
                temp1[rank] = object[parseInt(rank) + 1]
              }
              else if(parseInt(rank) === load.ranking){
                temp1[rank] = newRanking
              }
              else{
                temp2[rank] = object[rank]
              }
            }
          }
          newState.topJobs = Object.assign({}, temp2, temp1);
          newState.change = true;
          return newState;
        }
        else{
          // if there is no job in rank, set it
          if(topJobs.hasOwnProperty(load.ranking) && topJobs[load.ranking] == null){
            return {...newState,
              change: true,
              jobsRanked: true,
              topJobs:
              {...newState.topJobs,
                [load.ranking]: newRanking}}
          }

          // else move the others around
          else{
            //iterate through and if it has ranking >= then move down
            var object = newState.topJobs
            var temp1 = {};
            var temp2 = {};
            for (rank in object) {
                if (object.hasOwnProperty(rank)) {
                  if(object[rank] == null){
                    temp2[rank] = null;
                  }else{
                    if(rank >= load.ranking && parseInt(rank) <= 5){
                      //gotta move it
                      temp1[parseInt(rank)+1] = object[rank];
                    }
                    else{
                      temp2[rank] = object[rank];
                    }
                  }
                }
            }

            // get max and min of temp1, and remove gap if neccesary
            var max = 0;
            var min = 10;
            var object = temp1;
            for (var rank in object) {
                if (object.hasOwnProperty(rank)) {
                    if(object[rank] != null && rank > max) max=parseInt(rank);
                    if(object[rank] != null && rank < min) min=parseInt(rank);
                }
            }
 
            for(var j = min; j < max; j++){
              if(!temp1.hasOwnProperty(j)){
                temp1[j] = null;
              }
            }

            var temp3 = {};
            for (rank in temp1) {
                if (temp1.hasOwnProperty(rank) && rank<max && temp1[rank] == null) {
                  for(var i = min; i <= max; i++ ){
                    if(i > rank ){
                      temp3[i-1] = temp1[i]
                    }
                    else{
                      temp3[i] = temp1[i]
                    }
                  }
                  temp1 = Object.assign({}, temp3);
                  break;
                }
            }

            if(temp1[6] != null){
              if(temp1[5] == null){
                temp1[5] = temp1[6];
              }
              delete temp1[6];
            }

            temp2[load.ranking] = newRanking;
            newState.topJobs = Object.assign({}, temp2, temp1); 

            newState.change = true;
            return newState
          }
        }
      }
      default:
        return state
    }
}