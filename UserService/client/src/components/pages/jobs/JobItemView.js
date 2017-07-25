import React from "react";
import {Col, Glyphicon, Row} from "react-bootstrap";
import ListItem from "../views/ListItem";
import {connect} from "react-redux";

import {browserHistory} from "react-router";

@connect((store) => {
    return {
        rankings: store.rankings
    };
})

export default class JobItemView extends React.Component {
    constructor(props) {
        super(props);
        let reqs;

        if(this.props.requirements.length > 250){
            reqs = this.props.requirements.substr(0,250).concat( "...")
        }else reqs = this.props.requirements

        this.state = {
            id: this.props.id,
            course_name: this.props.course_name,
            requirements: reqs,
            end_date: this.props.end_date,
        }
    }

    routeToView = (path) => {
        return () => {
            browserHistory.push(path);
        }
    };

    componentWillReceiveProps(nextProps) {
        let reqs;

        if(this.props.requirements.length > 250){
            reqs = nextProps.requirements.substr(0,250).concat( "...")
        }else reqs = nextProps.requirements

        this.setState({
            ...this.state,
            id: nextProps.id,
            course_name: nextProps.course_name,
            requirements: reqs,
            end_date: nextProps.end_date
        });
    }

    render() {
        const { rankings } = this.props;
        let showRank = null

        if(rankings.fetched){
            var topJobs = rankings.topJobs
            for(var rank in topJobs){
                if(topJobs.hasOwnProperty(rank) && topJobs[rank] != null && topJobs[rank].id == this.state.id){
                    showRank = <Col xs={4} >
                        <h5 className="right-align" style={{
                            margin: 0,
                            fontWeight: 600,
                            borderRadius: 4,
                            background: "#EEE",
                            padding:8
                        }}>
                            Rank #{rank}
                        </h5>

                    </Col>
                }
            }
        }

        return (
            <ListItem>
                <Row style={{marginBottom: 30}}>
                    <Col xs={8}>

                        <h2 style={{margin: 0, fontWeight: 600}}><a
                            onClick={this.routeToView("/app/jobs/single/?id=" + this.props.id)}>
                            {this.state.course_name}
                        </a></h2>
                    </Col>
                    {showRank}
                </Row>
                <Row>
                    <Col xs={12}>
                        <p>
                            {this.state.requirements}
                        </p>
                    </Col>
                </Row>
                <Row>

                    <Col xs={4}>
                        <h6>
                            Deadline: {this.state.end_date}
                        </h6>
                    </Col>
                    <Col xs={2} xsOffset={6}>
                        <a className="see-more right-align" onClick={this.routeToView("/app/jobs/single/?id=" + this.props.id)}>View<Glyphicon glyph="chevron-right"/></a>
                    </Col>
                </Row>

            </ListItem>
        );
    }
}
