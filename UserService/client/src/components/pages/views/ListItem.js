/**
 * Created by david on 2017-03-14.
 *
 * Might be used for later. Extended now just in case.
 */
import React from "react";

export default class Listing extends React.Component {
    render() {
        const style={
            padding:32,
            marginBottom:15
        }
        return (
            <div  className={"card"} style={style}>
                {this.props.children}
            </div>
        );
    }
}