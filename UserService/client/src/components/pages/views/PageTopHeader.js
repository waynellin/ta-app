import React from "react";
import {Nav, Navbar, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

export default class TopNav extends React.Component {
    render() {
        const brandStyle = {
            fontWeight:"800",
            fontSize:24,
            color:"#000000"
        }
        return (
            <Navbar style={navStyle}>
                <Navbar.Header>
                    <Navbar.Brand >
                        <a href="#"style={brandStyle} >TA APPLICATION</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav bsStyle="pills">
                        <LinkContainer to="/app/profile">
                            <NavItem >PROFILE</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/app/jobs">
                            <NavItem>JOBS</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/app/inbox">
                            <NavItem>INBOX</NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={1} href="#">SIGN IN</NavItem>
                    </Nav>
                </Navbar.Collapse>

            </Navbar>


        )
            ;
    }
}
