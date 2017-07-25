import React from "react";
import LazyLoad from 'react-lazy-load';
import {connect} from "react-redux";
import TaCoordJobView from "./TaCoordJobView";
import TaCoordSingleView from "./TaCoordSingleView";

@connect((store) => {
  return {
    courses : store.courses
  };
})

export default class TaCoordListing extends React.Component {
  render() {
    return (
      <div  style={{display:'flex',flexFlow: 'column'}} className="fullheight">
        {this.props.courses.showComponent ?
          <TaCoordSingleView  className="fullheight"/> :
          <TaCoordJobView  className="fullheight" />
        }
      </div>
    );
  }
}
