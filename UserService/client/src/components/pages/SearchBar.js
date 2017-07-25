import React from "react";
import {Button, Col, FormControl, FormGroup, Row} from "react-bootstrap";
import {connect} from "react-redux";
import {queryListings, queryReset} from "../../actions/listingsActions";

@connect((store) => {
    return {
        listings: store.listings
    };
})

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            sentQuery: ""
        }
    }


    query() {
        this.setState({
            ...this.state,
            sentQuery: this.state.query
        })
        this.props.dispatch(queryListings(this.state.query))
    }

    queryChange(event) {
        this.setState({
            ...this.state,
            query: event.target.value
        })
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.query()
        }
    }

    resetQuery() {
        this.props.dispatch(queryReset())
        this.setState({
            ...this.state,
            query: ""
        })
    }


    render() {
        var showing = null;
        if (this.props.listings.queryResults != null) { // The reset anchor should standout David
            showing = <h4>Showing results for "{this.state.sentQuery}". <a
                style={{textDecoration: "underline"}} onClick={this.resetQuery.bind(this)}>Clear</a>
            </h4>
        }

        return (
            <FormGroup>
                <Row>
                    <Col xs={10} style={{paddingRight: 0}}>
                        <FormControl style={{ fontSize:16,height:55}}
                                     onKeyPress={this.handleKeyPress.bind(this)}
                                     onChange={this.queryChange.bind(this)}
                                     value={this.state.query} bsSize="large" type="text"
                                     placeholder="Search by course code. Example: csc148h"/>
                    </Col>
                    <Col xs={2}>
                        <Button onClick={this.query.bind(this)} bsSize="large"
                                block={true}>Search</Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        {showing}
                    </Col>
                </Row>
            </FormGroup>
        );
    }
}
