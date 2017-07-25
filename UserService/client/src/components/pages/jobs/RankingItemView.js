import React from "react";
import Empty from "./EmptyRankingItem";
import Populated from "./PopulatedRankingItem";


export default class RankingItemView extends React.Component {

    render() {

        if(this.props.ranking == null){
            return <Empty />;
        }
        else{
            return (
                <Populated name={this.props.course_name} id={this.props.id} ranking={this.props.ranking}/>
            );
        }
    }
}