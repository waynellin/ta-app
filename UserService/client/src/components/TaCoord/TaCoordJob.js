import React from "react";
import ListItem from "../pages/views/ListItem";
import { toggleComponent } from "../../actions/courseListingsActions";
import { setSingleCourse } from "../../actions/courseListingsActions";
import { connect } from "react-redux";

@connect((store) => {
  return {
    courses : store.courses
  };
})

export default class TaCoordJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course_name: this.props.course_name,
      requirements: this.props.requirements,
      end_date: this.props.end_date,
      showComponent: this.props.showComponent,
      course_id: this.props.course_id,
      posting_id: this.props.posting_id
    };
  }

  toggleView() {
    this.props.dispatch(setSingleCourse(this.state));
    this.props.dispatch(toggleComponent());

  }

  render() {
    return (
      <div>
        <ListItem>
          <h3><a onClick={this.toggleView.bind(this)} >{this.state.course_name}</a></h3>
          <h7>{this.state.requirements}</h7>
          <h5>{this.state.end_date}</h5>

        </ListItem>
      </div>
    );
  }
}
