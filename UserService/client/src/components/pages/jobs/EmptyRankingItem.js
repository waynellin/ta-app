import React from "react";
import {Button} from "react-bootstrap";

export default class Empty extends React.Component {
    render() {
        const styles = {
            border: "1px solid #bdbdbd",
            borderRadius: 4,
            background: "#f5f5f5",
            padding: 16,
            marginBottom: 15
        };
        return (
            <div style={styles}>
                <h4 style={{color: "#9E9E9E", display: "inline-block"}}>Empty</h4>
            </div>
        );
    }
}
