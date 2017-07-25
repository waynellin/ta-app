import React from "react";
import SearchBar from "../SearchBar";
import {connect} from "react-redux";
import {Col, Row} from "react-bootstrap";
import JobsRanking from "./JobsRanking";
import {Sticky, StickyContainer} from "react-sticky";
import {setHeading} from "../../../actions/headingsActions"

@connect((store) => {
    
    return {};
})


export default class Jobs extends React.Component {

    componentWillMount = () => {
        var payload = {
                title: "Jobs",
                caption: "Look for your next TAship."
                }
        this.props.dispatch(setHeading(payload))
    }
    

    render() {

        return (

            <StickyContainer  >
                <SearchBar  />
                <Row>
                    <Col md={8} style={{paddingRight:0}}>
                        {this.props.children}
                    </Col>
                    <Col md={4}>
                        <Sticky topOffset={-82} stickyStyle={{marginTop: 102}}>
                            <JobsRanking />
                        </Sticky>

                    </Col>
                </Row>
            </StickyContainer>

        );
    }
}
