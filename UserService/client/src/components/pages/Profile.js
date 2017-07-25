import React from "react";
import {connect} from "react-redux";
import {Button, Checkbox, Col, Form, FormControl, FormGroup, Header, Row} from "react-bootstrap";
import {setHeading} from "../../actions/headingsActions";
import {submitProfile} from "../../actions/applicantsActions";
import every from "lodash/every";
import {applicantClient} from "../../axiosClient";

@connect((store) => {

    return {
        user: store.user,
        application: store.application
    };
})


export default class Profile extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            courses: [],
            dateofapplication: null,
            emailaddress: "",
            familyname: "",
            givenname: "",
            id: this.props.user.user.id,
            phonenumber: "",
            program: "",
            studentdepartment: "",
            studentdepartmentexplain: "",
            studentnumber: "",
            tacourses: [],
            workstatus: "",
            workstatusexplain: "",
            studentstatus: "",
            studentstatusexplain: "",
            year: "",
        }
        this.baseState = this.state
    }

    componentWillMount = () => {
        var payload = {
            title: "Profile",
            caption: "Everything about you."
        }

        this.props.dispatch(setHeading(payload))
    }

    handleInputChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        if (name == "courses" || name == "tacourses") {
            value = value.split(",")
        }

        this.setState({
            [name]: value
        });
    }

    submitProfile() {
        var inputDate = new Date().toISOString()

        this.setState({
            dateofapplication: inputDate
        })

        var result = every(this.state, (attr) => {
            return attr != ""
        })

        if (!result) {
            alert("All fields are required.")
            return
        }

        let courses = this.state.courses
        if (this.state.courses[this.state.courses.length - 1] == "") {
            courses = this.state.tacourses.pop()
        }

        let dateofapplication = this.state.dateofapplication
        let emailaddress = this.state.emailaddress
        let familyname = this.state.familyname
        let givenname = this.state.givenname
        let id = this.props.user.user.id
        let phonenumber = this.state.phonenumber
        let program = this.state.program
        let studentdepartment = this.state.studentdepartment
        let studentdepartmentexplain = this.state.studentdepartmentexplain
        let studentnumber = this.state.studentnumber

        let tacourses = this.state.tacourses
        if (this.state.tacourses[this.state.tacourses.length - 1] == "") {
            tacourses = this.state.tacourses.pop()
        }

        let workstatus = this.state.workstatus
        let workstatusexplain = this.state.workstatusexplain
        let studentstatus = this.state.studentstatus
        let studentstatusexplain = this.state.studentstatusexplain
        let year = this.state.year

        let app = {
            user_id: id,
            student_number: studentnumber,
            first_name: givenname,
            last_name: familyname,
            phone_number: phonenumber,
            email: emailaddress,
            program: program,
            year_of_study: year,
            department: studentdepartment,
            department_explain: studentdepartmentexplain,
            work_status: workstatus,
            work_status_explain: workstatusexplain,
            student_status: studentstatus,
            student_status_explain: studentstatusexplain,
            course_taken: courses,
            previous_assignments: tacourses,
        }

        var config = {
            headers: {'x-access-token': this.props.user.user.user_token}
        };
        this.props.dispatch(submitProfile(
            applicantClient.post("/application", app, config)
        ));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.application.submitted) {
            this.setState(this.baseState)
        }
    }

    render() {
        let message = null
        if (this.props.application.submitted) {
            message = <h2>Profile Submitted</h2>
        }
        else if (this.props.application.error) {
            message = <h2>Error. Try Again Later.</h2>
        }
        return (
            <div>
                {message}
                <Form horizontal className="card">
                    <Row>
                        <Col xs={4}>
                            <h6> FIRST NAME</h6>
                        </Col>
                        <Col xs={4}>
                            <h6>LAST NAME</h6>
                        </Col>
                        <Col xs={4}>
                            <h6>STUDENT NUMBER</h6>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={4}>
                            <FormControl value={this.state.givenname}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="givenname" type="text" placeholder="First Name"/>
                        </Col>
                        <Col xs={4}>
                            <FormControl value={this.state.familyname}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="familyname" type="text" placeholder="Last Name"/>
                        </Col>
                        <Col xs={4}>
                            <FormControl value={this.state.studentnumber}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="studentnumber" type="number" pattern="[0-9]"
                                         placeholder="Student Number"/>
                        </Col>
                    </Row>
                    <Row>

                        <Col xs={6}>
                            <h6>EMAIL ADDRESS</h6>
                            <FormControl value={this.state.emailaddress}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="emailaddress" type="text"
                                         placeholder="Email"/>

                        </Col>
                        <Col xs={6}>
                            <h6>PHONE NUMBER</h6>
                            <FormControl value={this.state.phonenumber}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="phonenumber" type="text"
                                         placeholder="Phone number"/>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={12}>
                            <h6>COURSES TAKEN</h6>
                            <FormControl value={this.state.courses}
                                         onChange={this.handleInputChange.bind(this)} name="courses"
                                         type="text" placeholder="Courses taken (comma separated)"/>

                        </Col>
                    </Row>

                    <FormGroup style={{paddingTop: 16}}>
                        <Col xs={12}>
                            <h6 style={{display: "inline-block", marginTop: 12, marginRight: 16}}>
                                Program</h6>
                            <Checkbox style={{paddingTop: 0}} value="UG"
                                      checked={this.state.program === 'UG'}
                                      onChange={this.handleInputChange.bind(this)}
                                      name="program" inline>
                                UG
                            </Checkbox>
                            {' '}
                            <Checkbox style={{paddingTop: 0}} value="MSC"
                                      checked={this.state.program === 'MSC'}
                                      onChange={this.handleInputChange.bind(this)}
                                      name="program" inline>
                                MSC
                            </Checkbox>
                            {' '}
                            <Checkbox style={{paddingTop: 0}} value="MSAC"
                                      checked={this.state.program === 'MSAC'}
                                      onChange={this.handleInputChange.bind(this)}
                                      name="program" inline>
                                MSAC
                            </Checkbox>
                            {' '}
                            <Checkbox style={{paddingTop: 0}} value="PHD"
                                      checked={this.state.program === 'PHD'}
                                      onChange={this.handleInputChange.bind(this)}
                                      name="program" inline>
                                PHD
                            </Checkbox>
                        </Col>
                    </FormGroup>

                    <Row>
                        <Col xs={3}>
                            <h6>Department</h6>
                            <FormControl value={this.state.studentdepartment}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="studentdepartment" type="text"
                                         placeholder="Department"/>

                        </Col>
                        <Col xs={9}>
                            <h6>Department Details</h6>
                            <FormControl value={this.state.studentdepartmentexplain}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="studentdepartmentexplain" type="text"
                                         lines="3"
                                         placeholder="Use this space to explain your department"/>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={12}>
                            <h6>Courses that you have previously TA'd</h6>
                            <FormControl value={this.state.tacourses}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="tacourses" type="text"
                                         placeholder="Course codes (comma seperated.)"/>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={12}>
                            <h6>Work Status</h6>
                            <FormControl value={this.state.workstatus}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="workstatus" type="text" placeholder="Work Status"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <h6>Work Status Details</h6>
                            <FormControl value={this.state.workstatusexplain}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="workstatusexplain" type="text"
                                         componentClass="textarea"
                                         style={{minHeight: 48}}
                                         placeholder="Explain any details about your current work status."/>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col xs={8}>
                            <h6>Degree Status</h6>
                            <FormControl value={this.state.studentstatus}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="studentstatus" type="text"
                                         placeholder="Degree Status"/>
                        </Col>
                        <Col xs={4}>
                            <h6>Year</h6>
                            <FormControl value={this.state.year}
                                         onChange={this.handleInputChange.bind(this)} name="year"
                                         type="number" pattern="[0-9]" placeholder="Year"/>
                        </Col>
                        <Col xs="12">
                            <h6>Degree Status Details</h6>
                            <FormControl value={this.state.studentstatusexplain}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="studentstatusexplain" type="text"
                                         componentClass="textarea"
                                         style={{minHeight: 48}}
                                         placeholder="Explain your current academic status."/>

                        </Col>
                    </Row>

                    <br />
                    <Row>
                        <Col xs={12}>
                            <Button onClick={this.submitProfile.bind(this)} className="right-align"
                                    bsStyle="primary" bsSize="large">Submit</Button>
                        </Col>
                    </Row>

                </Form>
            </div>


        );
    }
}
