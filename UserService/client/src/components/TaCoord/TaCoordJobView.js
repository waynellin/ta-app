import React from "react";
import {taCoordClient} from "../../axiosClient";
import {fetchListings} from "../../actions/listingsActions";
import {createAssignment} from "../../actions/assignmentsActions";
import {connect} from "react-redux";
import TaCoordJob from "./TaCoordJob";
import LazyLoad from "react-lazy-load";
import {Droppable} from "react-drag-and-drop";
import {Accordion} from "react-bootstrap";

@connect((store) => {
    return {
        listings: store.listings,
        user: store.user,
        assignments: store.assignments
    };
})

export default class TaCoordJobView extends React.Component {
    constructor(props) {
        super(props);
        const {listings} = this.props.listings;
        this.state = {
            title: this.props.title,
            description: this.props.description,
            deadline: this.props.deadline,
            status: this.props.status,
            showComponent: true
        };
    }

    componentWillMount() {
        if (!this.props.listings.fetched) {
            var config = {
                headers: {'x-access-token': this.props.user.user.user_token}
            };
            this.props.dispatch(fetchListings(
                taCoordClient.get("/posting", config)
            ));
        }
    }

    buttonClick() {
        if (this.state.showComponent) {
            this.setState({
                showComponent: false
            });
        } else {
            this.setState({
                showComponent: true
            });
        }
    }

    getCourses() {
        if (this.props.listings.listings) {
            var listings = [];
            var object = this.props.listings.listings
            var count = 0;

            for (var id in object) {
                if (object.hasOwnProperty(id)) {
                    var course = object[id];
                    listings.push(course)
                }
            }

            return Object.keys(listings).map((course) => {
                let dragOverStyle = {};

                if (this.state.dragOver === course) {
                    dragOverStyle['boxShadow'] = "0px 10px 18px 0px rgba(0,0,0,0.3)";
                }
                if (this.state.dragOver === null) {
                    dragOverStyle['boxShadow'] = "";
                }
                return (
                    <LazyLoad>
                            <Droppable types={['applicant']}
                                       onDragOver={() => this.setState({
                                           ...this.state,
                                           dragOver: course
                                       })}
                                       onDragLeave={() => this.setState({
                                           ...this.state,
                                           dragOver: null
                                       })}
                                       onDragEnter={() => this.setState({
                                           ...this.state,
                                           dragOver: null
                                       })}
                                       onDragExit={() => this.setState({
                                           ...this.state,
                                           dragOver: null
                                       })}
                                       key={course}
                                       style={dragOverStyle}
                                       onDrop={(data) => this.assignApplicant({
                                           ...JSON.parse(data.applicant),
                                           posting_id: listings[course].posting_id,
                                           course_id: listings[course].course_id
                                       })}>
                                <TaCoordJob showComponent={listings[course].showComponent}
                                            course_name={listings[course].course_name}
                                            requirements={listings[course].requirements}
                                            course_id={listings[course].course_id}
                                            posting_id={listings[course].posting_id}
                                            end_date={listings[course].end_date}/>
                            </Droppable>
                    </LazyLoad>
                );
            });
        } else {
            return null
        }
    }

    assignApplicant(assignment) {
        var config = {
            headers: {'x-access-token': this.props.user.user.user_token}
        };
        this.setState({...this.state, dragOver: null});
        this.props.dispatch(createAssignment(
            taCoordClient.post('/assignment', {
                ...assignment
            }, config)
        ));
    }

    render() {
        if (this.props.assignments.assignment) {
            //console.log(this.props.assignments.assignment);
        }

        return (
            <div style={{padding: 15, overflow: 'auto'}} className="fullheight">
                {this.getCourses()}
            </div>
        );
    }
}
