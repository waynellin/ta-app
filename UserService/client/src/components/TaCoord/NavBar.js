import React from "react";
import { Nav, Navbar, NavItem} from "react-bootstrap";
import {connect} from "react-redux";
import {browserHistory} from "react-router";
import {logout} from "../../actions/userActions"

@connect((store) => {
    return {};
})

export default class TopNav extends React.Component {

    logout(){
        browserHistory.push("/");
        this.props.dispatch(logout())
    }

    render() {
        const navStyle = {
            paddingTop: "16px",
            paddingBottom: "16px",
            fontWeight:"700",
            textTransform: "up"
        }
        const brandStyle = {
            fontWeight:"800",
            fontSize:24,
            color:"#333"
        }
        return (
            <Navbar fixedTop style={navStyle}>
                <Navbar.Header>
                    <Navbar.Brand >
                        <a href="#"style={brandStyle} >TA COORDINATOR APPLICATION</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />

                </Navbar.Header>
                <Navbar.Collapse>
                    
                    <Nav pullRight>
                        <NavItem eventKey={1} onClick={this.logout.bind(this)} href="#">Logout</NavItem>
                    </Nav>
                </Navbar.Collapse>

            </Navbar>


        );
    }
}
