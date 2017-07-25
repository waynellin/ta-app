import React, {Component} from "react";
import {connect} from 'react-redux';
import { Table } from 'react-bootstrap';
import InboxListItem from "./InboxListItem"
import {fetchInbox} from "../../actions/inboxActions"
import {taCoordClient} from "../../axiosClient"

@connect((store) => {

    return {
        inbox: store.inbox,
	    user: store.user
    };
})

export default class InboxList extends Component{

	componentWillMount(){
		// make API call here.
        var config = {
            headers: {'x-access-token': this.props.user.user.user_token}
        };
        this.props.dispatch(fetchInbox(
            taCoordClient.get("/offers?user_id=" + this.props.user.user.id, config)
        ));
	}

	componentWillReceiveProps(nextProps){
		// check for return from Inbox
		if(nextProps.inbox.fetched){
			this.setState({
				inbox: nextProps.inbox.inbox
			})
		}
        if(nextProps.inbox.accepted){
            var config = {
                headers: {'x-access-token': this.props.user.user.user_token}
            };
            this.props.dispatch(fetchInbox(
                taCoordClient.get("/offers?user_id=" + this.props.user.user.id, config)
            ));
        }
	}

	constructor(props){
		super(props)

		this.state = {
			inbox: this.props.inbox.inbox
		}
	}

	getListItems(){
		if(this.state.inbox.length == 0){
			return <h2>No Offers</h2>
		}
		return this.state.inbox.map((course, index) => {
			return (
				<InboxListItem key={index} application_id={course._id} course_name={course.course.course_code} status={course.status}/>
			);
		});
	}

	render(){
		return (
			<div>
				<Table striped condensed >
					<thead>
					    <tr>
						    <th style={{padding:12}}>Courses Applied</th>
						    <th style={{padding:12}}>Status</th>
					    </tr>
					</thead>
					<tbody >
						{this.getListItems()}
					</tbody>
				</Table>
			</div>
		);
	}
}
