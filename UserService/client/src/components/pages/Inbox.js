import React from "react";
import {connect} from "react-redux";
import InboxList from './InboxList';
import {setHeading} from "../../actions/headingsActions"

@connect((store) => {
    
    return {};
})

export default class Inbox extends React.Component {
	
	componentWillMount = () => {
        var payload = {
                title: "Inbox",
                caption: "Pending TAship offers."
            }

        this.props.dispatch(setHeading(payload))
    }
    

  	render() {
    	return (
      	<div className="card">
        	 <InboxList />
      	</div>
    	);
  	}
}
