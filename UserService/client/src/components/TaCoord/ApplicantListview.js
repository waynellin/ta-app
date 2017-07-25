import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import { Panel, Accordion, Glyphicon} from 'react-bootstrap';
import LazyLoad from 'react-lazy-load';
import { applicantClient, taCoordClient } from "../../axiosClient";
import {fetchApplicants, fetchAllRankings, fetchUnassigned} from "../../actions/applicantsActions";
import { setSingleCourse, toggleComponent } from "../../actions/courseListingsActions";
import {Draggable} from 'react-drag-and-drop';

class PanelHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let dragStyle = {};

        if (this.state.dragging) {
            dragStyle['background'] = '#F5F5F5';
            dragStyle['color'] = '#F5F5F5';
        }

        return (
            <div style={{padding: "16px", display: 'flex', alignItems: 'center'}}>
                <Glyphicon glyph="user" style={{marginRight: 8}}/>

                <div style={{flexGrow: "1"}}>
                    {this.props.first_name} {this.props.last_name}, {this.props.student_id}
                </div>
                <Draggable type='applicant'
                           data={JSON.stringify({
                               student_id: this.props.user_id,
                               application_id: this.props.application_id
                           })}
                           style={Object.assign({
                               background: "#E0E0E0",
                               padding: "4px 8px",
                               borderRadius: 4
                           }, dragStyle)}
                           key={this.props.user_id}
                           onDrag={() => this.setState({...this.state, dragging: true})}
                           onDragEnd={() => this.setState({...this.state, dragging: false})}>
                    <p style={{
                        display: "inline-block",
                        margin: 0
                    }}>Drag to assign</p>
                    <Glyphicon glyph="arrow-right" style={{marginLeft: 8}}/>
                </Draggable>
            </div>
        );
    }
}

class AboutMe extends Component {

    render() {
        return (
            <div >
                <h4>About me:</h4>
                <p>Phone Number: {this.props.phone_number}</p>
                <p>Email: {this.props.email}</p>
                <p>Program: {this.props.program}</p>
                <p>Year of study: {this.props.year_of_study}</p>
                <p>Department explain: {this.props.department_explain}</p>
                <p>Work status: {this.props.work_status}</p>
                <p>Work status explain: {this.props.work_status_explain}</p>
                <p>Student status: {this.props.student_status}</p>
                <p>Student status explain: {this.props.student_status_explain}</p>
                <p>Status: {this.props.status}</p>
                <p>Previous assignments: {this.props.previous_assignments}</p>
                <p>Courses: {this.props.courses}</p>
            </div>
        );
    }
}
class Courses extends Component {
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
        //console.log(this.props);

        this.link_course = this.link_course.bind(this);
    }

    link_course(posting_id) {
        let state = {
            course_name: null,
            requirements: null,
            end_date: null,
            showComponent: null,
            course_id: null,
            posting_id: posting_id
        }
        this.props.dispatch(setSingleCourse(state));
        if (!this.props.show) {
            this.props.dispatch(toggleComponent());
        }
    }

    getCourses() {
        var courses = this.props.courses;
        if (courses) {
            return courses.map((course, index) => {
                return (
                    <div>
                        <h4 style={{
                            display: "inline",
                            padding: "4px 8px",
                            background: '#EEEEEE',
                            borderRadius: 4
                        }}>{index + 1}</h4>

                        <h4 style={{display: "inline", marginRight: 16}} key={index}><a
                            onClick={() => this.link_course(course.posting_id)}> {course.course_code}</a>
                        </h4>
                    </div>
                );
            });
        }

    }

    render() {
        return (
            <div style={{padding: "16px 0px"}}>
                {this.getCourses()}
            </div>
        );
    }
}

class ApplicantList extends Component {

    componentWillMount() {
        var config = {
            headers: {'x-access-token': this.props.user.user.user_token}
        };
        this.props.dispatch(fetchApplicants(
            applicantClient.get("/application", config)
        ));
        this.props.dispatch(fetchAllRankings(
            applicantClient.get("/rankings", config)
        ));
        this.props.dispatch(fetchUnassigned(
            taCoordClient.get("/assignment/unassigned", config)
        ));
    }

    constructor(props) {
        super(props);
        const {applicants} = this.props.applicants;

        this.state = {
            applicants: applicants
        }
    }

    componentWillReceiveProps(nextProps) {
        const {applicants} = nextProps;

        if (applicants.fetched) {
            this.setState({
                ...this.state,
                applicants: applicants.applicants
            });

        }
    }

    getApplicants() {
        //console.log(this.props.applicants.applicants);
        var obj = [this.props.applicants.applicants_copy][0];
        var rankings = this.props.applicants.allRankings;
        //console.log(rankings)
        if (this.props.applicants.fetched && this.props.applicants.ranking_fetched && this.props.applicants.unassigned_fetched) {

            return Object.keys(obj).map((applicant) => {
                return (
                    <LazyLoad >
                        <Accordion>
                            <Panel key={obj[applicant].user_id} header=
                                {<div>
                                    <PanelHeader first_name={obj[applicant].first_name}
                                                 last_name={obj[applicant].last_name}
                                                 student_id={obj[applicant].student_number}
                                                 profile_pic={obj[applicant].profile_pic}
                                                 user_id={obj[applicant].user_id}
                                                 application_id={obj[applicant].id}/>
                                </div>}
                                   footer={
                                       <div>
                                           <Courses dispatch={this.props.dispatch}
                                                    show={this.props.courses.showComponent}
                                                    courses={rankings[obj[applicant].user_id]}/>
                                       </div>}
                                   eventKey={obj[applicant].user_id}>
                                <div style={{padding: 0}}>
                                    <AboutMe
                                        phone_number={obj[applicant].phone_number}
                                        email={obj[applicant].email}
                                        program={obj[applicant].program}
                                        year_of_study={obj[applicant].year_of_study}
                                        department_explain={obj[applicant].department_explain}
                                        work_status={obj[applicant].work_status}
                                        work_status_explain={obj[applicant].work_status_explain}
                                        student_status={obj[applicant].student_status}
                                        student_status_explain={obj[applicant].student_status_explain}
                                        status={obj[applicant].status}
                                        previous_assignments={obj[applicant].previous_assignments}
                                        courses={obj[applicant].courses}
                                    />

                                </div>
                            </Panel>
                        </Accordion>
                    </LazyLoad>
                );
            });
        } else {
            return null
        }

    }


    render() {

        return (
            <div style={{padding: 15, overflow: 'auto'}} className="fullheight">
                {this.getApplicants()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        applicants: state.applicants,
        user: state.user,
        allRankings: state.allRankings,
        courses: state.courses
    }

}

export default connect(mapStateToProps)(ApplicantList);