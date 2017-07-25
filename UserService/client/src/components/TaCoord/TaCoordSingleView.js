import React from "react";
import {connect} from "react-redux";
import {Col, Glyphicon, Row} from "react-bootstrap";
import {toggleComponent} from "../../actions/courseListingsActions";
import {taCoordClient} from "../../axiosClient";
import {getAssignments} from "../../actions/assignmentsActions";
import {fetchListing} from "../../actions/listingsActions";
import ApplicantListItem from "./ApplicantListItem";

@connect((store) => {
    return {
        user: store.user,
        courses: store.courses,
        listings: store.listings,
        assignments: store.assignments
    };
})

export default class TaCoordSingleView extends React.Component {

    componentWillMount() {

        var config = {
            headers: {'x-access-token': this.props.user.user.user_token}
        };
        this.props.dispatch(fetchListing(
            taCoordClient.get("/posting/" + this.props.courses.posting_id, config)
        ));

        if (!this.props.assignments.fetched) {
            var config = {
                headers: {'x-access-token': this.props.user.user.user_token}
            };
            this.props.dispatch(getAssignments(
                taCoordClient.get('/assignment', config)
            ));
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            course_id: null,
            posting_id: null,
            course_name: null,
            requirements: null,
            end_date: null,
            tas_needed: null,
            term: null,
            assignments: []
        }
    }

    toggleBack() {
        this.props.dispatch(toggleComponent());

    }

    componentWillReceiveProps(nextProps) {
        const {listing} = nextProps.listings;

        if (nextProps.assignments.fetched && this.state.assignments.length == 0) {
            //look for course_id matching this one
            let assignments = nextProps.assignments.assignments
            for (var i = 0; i < assignments.length; i++) {
                if (assignments[i].course_id === this.props.courses.course_id) {
                    this.setState({
                        assignments: assignments[i].ta_assignments
                    })
                    break;
                }
            }
        }

        if (listing.fetched) {
            var course = nextProps.listings.listing.course;

            this.setState({
                ...this.state,
                posting_id: course.id,
                course_id: course.course_id,
                course_name: course.course_name,
                requirements: course.requirements,
                end_date: course.end_date,
                tas_needed: course.tas_needed,
                term: course.term,
            });
        }
    }

    render() {
        let tas = [];
        let count = 0;

        const headingstyle = {
            marginTop: 8,
            marginBottom: 4
        }
        console.log(this.state)
        for (var ta in this.state.assignments) {
            tas.push(<h5 key={count++}>{this.state.assignments[ta].student_id}</h5>)
        }

        if (this.state.assignments.length != 0 && this.state.course_id != null) {
            console.log("kjbkjbjkbkj", this.state);

            for (var ta in this.state.assignments) {
                tas.push(<ApplicantListItem key={ta} course_id={this.state.course_id}
                                            student_id={this.state.assignments[ta].student_id}/>)
            }
        }
        else tas = <h5>Loading applicants... </h5>

        return (

            <div style={{padding:15}}>
                <h4 style={{marginBottom: 15}}>
                    <a onClick={this.toggleBack.bind(this)} className="see-more">
                        <Glyphicon glyph="chevron-left"/>Back</a>
                </h4>
                <div className="card">
                    <Row style={{marginBottom: 30}}>
                        <Col xs={8}>

                            <h2 style={{margin: 0, fontWeight: 600}}>
                                {this.state.course_name}
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <div>
                                <h6 style={headingstyle}>Requirements:</h6>
                                {this.state.requirements}
                                <div style={{marginTop: 32}}/>
                                <h6 style={headingstyle}>Term:</h6>
                                {this.state.term}
                                <h6 style={headingstyle}>TAs Needed:</h6>
                                {this.state.tas_needed}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {tas}
                    </Row>
                    <Row style={{margintop: 16}}>
                        <Col xs={4}>
                            <h6>
                                End Date: {this.state.end_date}
                            </h6>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
