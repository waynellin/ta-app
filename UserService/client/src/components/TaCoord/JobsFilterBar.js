import React from "react";
import {Button, DropdownButton, FormControl, FormGroup, MenuItem, Modal} from "react-bootstrap";

import NewAd from "./NewAd";

export default class JobsFilterBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        }
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    open() {
        this.setState({
            showModal: true
        });
    }

    close() {
        this.setState({
            showModal: false
        });
    }

    render() {
        return (
            <div>
                <FormGroup style={{margin: 0, display: 'flex', flexDirection: "row"}}>

                    <FormControl style={{flexGrow: 1}}
                                 bsSize="large" type="text" placeholder="Search"/>

                    <DropdownButton style={{marginLeft: 8, marginRight: 8}} title="Sort By"
                                    bsSize="large" pullRight
                                    id="split-button-pull-right">
                        <MenuItem eventKey="1">Year</MenuItem>
                        <MenuItem eventKey="2">Program</MenuItem>
                    </DropdownButton>

                    <Button type="submit" style={{padding: 12, flexShrink: 1}} bsStyle="primary"
                            onClick={this.open}>Create posting+</Button>

                    <Modal show={this.state.showModal} onHide={this.close} bsSize="large">
                        <NewAd/>
                    </Modal>
                </FormGroup>
            </div>
        );
    }
}
