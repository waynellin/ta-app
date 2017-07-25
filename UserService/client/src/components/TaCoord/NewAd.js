import React from "react";
import {Button, ControlLabel, FormControl, FormGroup, Modal,Glyphicon} from "react-bootstrap";
import RichTextEditor from "react-rte";
import {taCoordClient} from "../../axiosClient";
import {connect} from "react-redux";
import {fetchCourses, postAd} from "../../actions/courseActions";

@connect((store) => {
    return {
        courses: store.courses,
        user: store.user
    };
})

export default class NewAd extends React.Component {

    componentWillMount() {

        const {courses} = this.props;

        if (!courses.fetched) {
            var config = {
                headers: {'x-access-token': this.props.user.user.user_token}
            };
            this.props.dispatch(fetchCourses(
                taCoordClient.get("/course", config)
            ));
        }
        else {
            let courseList = [];

            for (var i = 0; i < courses.courses.length; i++) {
                courseList.push({
                    course_name: courses.courses[i].course_code,
                    course_id: courses.courses[i]._id
                })
            }

            this.setState({
                ...this.state,
                courses: courseList
            })
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            form: {
                requirements: RichTextEditor.createEmptyValue(),
                start_date: "",
                end_date: "",
                tas_needed: "",
                course_id: ""
            }
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(value) {
        this.setState({
            ...this.state,
            form: {
                ...this.state.form,
                requirements: value
            }
        });
    }


    handleInputChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;
        console.log(name, value)
        this.setState({
            ...this.state,
            form: {
                ...this.state.form,
                [name]: value
            }
        });
    }

    componentWillReceiveProps(nextProps) {

        const {courses} = nextProps;

        if (courses.fetched) {
            let courseList = []
            for (var i = 0; i < courses.courses.length; i++) {
                courseList.push({
                    course_name: courses.courses[i].course_code,
                    course_id: courses.courses[i]._id
                })
            }

            this.setState({
                ...this.state,
                courses: courseList
            })
        }

    }

    sendPost() {

        let editorVal = this.state.form.requirements.toString("html")

        // fill in data for post here
        let data = {
            course_id: this.state.form.course_id,
            requirements: editorVal,
            start_date: this.state.form.start_date,
            end_date: this.state.form.end_date
        }

        var config = {
            headers: {'x-access-token': this.props.user.user.user_token}
        };
        this.props.dispatch(postAd(
            taCoordClient.post("/posting", data, config)
        ));
    }

    render() {
        let courseList = []
        const {courses} = this.state
        for (var i = 0; i < courses.length; i++) {
            courseList.push(<option key={i} value={courses[i].course_id}>
                    {courses[i].course_name}
                </option>
            )
        }
        return (
            <div >

                <Modal.Header closeButton style={{padding: 16}}>
                    <Modal.Title>
                        New Posting
                    </Modal.Title>

                </Modal.Header>
                <Modal.Body >

                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <FormGroup controlId="formControlsSelect" style={{flex:1}}>
                            <ControlLabel>Course</ControlLabel>
                            <FormControl componentClass="select" value={this.state.course_id}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="course_id"
                                         placeholder="Course Code">
                                {courseList}
                            </FormControl>
                        </FormGroup>
                        <div style={{flex:1 ,margin:"0px 8px"}}>
                            <ControlLabel>Start Date</ControlLabel>
                            <FormControl value={this.state.form.start_date}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="start_date"
                                         type="text" placeholder="Start Date"/>
                        </div>
                        <div style={{flex:1,marginRight:8}}>
                            <ControlLabel>End Date</ControlLabel>
                            <FormControl value={this.state.form.end_date}
                                         onChange={this.handleInputChange.bind(this)}
                                         name="end_date"
                                         type="date" placeholder="End Date"/>
                        </div>
                        <div style={{flex:1}}>
                            <ControlLabel>TAs Needed</ControlLabel>
                            <FormControl value={this.state.form.tas_needed}
                                         onChange={this.handleInputChange.bind(this)} name="tas_needed"
                                         type="number" placeholder="TAs Needed"/>
                        </div>
                    </div>

                    <ControlLabel>Description</ControlLabel>
                    <RichTextEditor  value={this.state.form.requirements}
                                    onChange={this.onChange}/>

                </Modal.Body>
                <Modal.Footer style={{display:'flex',flexDirection:'row' ,justifyContent:"flex-end"}}>
                    <Glyphicon style={{color:"#F50057",display:"inline-block",marginRight:8,fontSize:24,alignSelf:'center'}} glyph="bell"/>
                    <h4 style={{color:"#F50057" ,display:"inline-block",marginRight:16,alignSelf:'center'}}>John, display Error message here</h4>

                    <Button onClick={this.sendPost.bind(this)} bsStyle="primary">Submit</Button>
                </Modal.Footer>
            </div>
        );
    }
}
