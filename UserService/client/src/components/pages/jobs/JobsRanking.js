import React from "react";
import { connect } from "react-redux";
// import {Glyphicon} from "react-bootstrap";
import RankingItemView from "./RankingItemView";
import { applicantClient } from "../../../axiosClient";
import { fetchRankings,updateRankings } from "../../../actions/rankingActions";

@connect((store) => {
    return {
        rankings: store.rankings,
        user: store.user
    };
})

export default class JobsRanking extends React.Component {

  componentWillMount(){
    if(!this.props.rankings.fetched){
      var config = {
        headers: {'x-access-token': this.props.user.user.user_token}
      };
      this.props.dispatch(fetchRankings(
        applicantClient.get("/rankings/" + this.props.user.user.id, config)
      ));
    }
  }

  constructor(props){
    super(props);
    this.state = {
      topJobs: this.props.rankings.topJobs
    }
  }

  componentWillReceiveProps(nextProps){
    const { rankings } = nextProps;

    if(rankings.fetched){
      this.setState({...this.state,
        rankings: rankings.topJobs
      });
    }
    else if(rankings.error != null){

      if(rankings.error.response.status === 404){
          var data = {
              user_id: this.props.user.user.id,
              rankings: []
          }

          var config = {
              headers: {'x-access-token': this.props.user.user.user_token}
          };
          this.props.dispatch(updateRankings(
              applicantClient.post("/rankings" , data , config)
          ));
      }

    }

    if(rankings.change){
      var newRankings = [];
      var topJobs = nextProps.rankings.topJobs
      for(var rank in topJobs){
        if(topJobs.hasOwnProperty(rank) && topJobs[rank] !== null){
          var entry = {
            user_id: this.props.user.user.id,        
            posting_id: topJobs[rank].id,
            rank: rank,
            course_code: topJobs[rank].course_name
          }
          newRankings.push(entry)
        }
      }

        var data = {
          user_id: this.props.user.user.id,
          rankings: newRankings
        }

      var config = {
        headers: {'x-access-token': this.props.user.user.user_token}
      };
      this.props.dispatch(updateRankings(
        applicantClient.post("/rankings" , data, config)
      ));

    }
  }

  render() {
    const {topJobs} = this.props.rankings;
    var items = [];
    for(let i = 1; i<= 5; i++){
      if(topJobs.hasOwnProperty(i) && topJobs[i] != null){
        items.push(<RankingItemView course_name={topJobs[i].course_name} key={i} id={topJobs[i].id} ranking={i}/>);
      }

      else{
        items.push(<RankingItemView key={i} ranking={null}/>);
      }
    }

    return (
      <div>
        <h3 style={{marginBottom:15}}>Preference Rankings</h3>
        {items}
      </div>
    );
  }
}
