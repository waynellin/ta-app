import React from "react";
import ApplicantsFilterBar from "./ApplicantsFilterBar";
import ApplicantListview from './ApplicantListview';
import {Col} from 'react-bootstrap';


export default class Applicant extends React.Component {

    render() {
        return (
            <Col xs={12} style={{display:"flex",
                flexFlow: 'column',
                padding:0,
                borderRight:"1px solid #E0E0E0"}} className="fullheight">
                <div style={{background: "#fff",padding: 15, paddingTop:82, borderBottom: " 1px solid #E0E0E0"}}>
                    <h3 style={{marginTop: 24, marginBottom:16}}>Applicants</h3>
                    <ApplicantsFilterBar />
                </div>
                    <ApplicantListview style={{flexGrow:1,height:'auto'}}/>
            </Col>
        );
    }
}