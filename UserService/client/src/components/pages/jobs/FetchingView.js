import React from "react";
import {Col, DropdownButton, Glyphicon, MenuItem, Row} from "react-bootstrap";

export default class FetchingView extends React.Component {


    render() {


        return (
            <div>
                <h4 style={{marginTop: 22, marginBottom: 15}}>
                    <a className="see-more">
                        <Glyphicon glyph="chevron-left"/>Back</a>
                </h4>
                <div className="card" style={{height:400}}>
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }
}
