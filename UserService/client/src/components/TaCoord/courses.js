import React from "react";
import {connect} from "react-redux";
import {Col} from "react-bootstrap";
import TaCoordListing from "./TaCoordListing";
import JobsFilterBar from "./JobsFilterBar";
@connect((store) => {
    return {};
})

export default class Courses extends React.Component {
    render() {
        return (
            <Col xs={12} style={{
                display: "flex",
                flexFlow: 'column',
                padding: 0
            }} className="fullheight">
                <div style={{
                    flex: "0 1 auto",
                    background: "#fff",
                    padding: 15,
                    paddingTop: 82,
                    borderBottom: " 1px solid #E0E0E0"
                }}>
                    <h3 style={{marginTop: 24, marginBottom: 16}}>Courses</h3>
                    <JobsFilterBar  />
                </div>
                <TaCoordListing style={{flexGrow:1,height:'auto'}}/>
            </Col>
        );
    }
}
