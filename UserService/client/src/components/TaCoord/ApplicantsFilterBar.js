import React from "react";
import {connect} from "react-redux";
import {DropdownButton, FormControl, FormGroup, MenuItem, Row, Checkbox} from "react-bootstrap";
import {setApplicants} from "../../actions/applicantsActions";
import sortBy from "lodash/sortBy";
import orderBy from "lodash/orderBy";
import filter from "lodash/filter";
import includes from "lodash/includes";

@connect((store) => {
    return {
        applicants: store.applicants.applicants,
        applicants_copy: store.applicants.applicants_copy,
        unassigned: store.applicants.unassigned
    };
})
export default class ApplicantsFilterBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            filter: 'All',
            checked: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        console.log(event.target.value);


        var sorted_applicants = filter(this.props.applicants_copy, function (n) {
            return includes(n.first_name.toLowerCase() + ' '.concat(n.last_name).toLowerCase() + ' '.concat(n.student_number), event.target.value.toLowerCase());
        });
        if (event.target.value === ''){
            if (this.state.checked){
                this.props.dispatch(setApplicants(this.props.unassigned));
            }else{
                this.props.dispatch(setApplicants(this.props.applicants));
            }

        }else{
            this.props.dispatch(setApplicants(sorted_applicants));
        }


    }

    YearInc(e) {
        e.preventDefault();
        this.setState({
            filter: "yearInc"
        });
        var list;
        if (this.state.checked){
            list = this.props.unassigned;
        }else{
            list = this.props.applicants;
        }
        var sorted_applicants = sortBy(list, [function(n) {
            return n.year_of_study;
        }]);
        this.props.dispatch(setApplicants(sorted_applicants));
    }
    YearDes(e) {
        e.preventDefault();
        this.setState({
            filter: "yearDec"
        });
        var list;
        if (this.state.checked){
            list = this.props.unassigned;
        }else{
            list = this.props.applicants;
        }
        var sorted_applicants = orderBy(list, [function(n) {return n.year_of_study;}], ['desc']);
        this.props.dispatch(setApplicants(sorted_applicants));
    }
    UG(e) {
        e.preventDefault();
        this.setState({
            filter: "UG"
        });
        var list;
        if (this.state.checked){
            list = this.props.unassigned;
        }else{
            list = this.props.applicants;
        }
        var sorted_applicants = filter(list, function(n) {
            return n.program === "UG";
        });
        this.props.dispatch(setApplicants(sorted_applicants));
    }
    MSC(e) {
        e.preventDefault();
        this.setState({
            filter: "MSC"
        });
        var list;
        if (this.state.checked){
            list = this.props.unassigned;
        }else{
            list = this.props.applicants;
        }
        var sorted_applicants = filter(list, function(n) {
            return n.program === "MSC";
        });
        this.props.dispatch(setApplicants(sorted_applicants));
    }
    MSAC(e) {
        e.preventDefault();
        this.setState({
            filter: "MSAC"
        });
        var list;
        if (this.state.checked){
            list = this.props.unassigned;
        }else{
            list = this.props.applicants;
        }
        var sorted_applicants = filter(list, function(n) {
            return n.program === "MSAC";
        });
        this.props.dispatch(setApplicants(sorted_applicants));
    }
    PHD(e) {
        e.preventDefault();
        this.setState({
            filter: "PHD"
        });
        var list;
        if (this.state.checked){
            list = this.props.unassigned;
        }else{
            list = this.props.applicants;
        }
        var sorted_applicants = filter(list, function(n) {
            return n.program === "PHD";
        });
        this.props.dispatch(setApplicants(sorted_applicants));
    }
    GetAll(e) {
        e.preventDefault();
        this.setState({
            filter: "All"
        });
        var list;
        if (this.state.checked){
            list = this.props.unassigned;
        }else{
            list = this.props.applicants;
        }
        this.props.dispatch(setApplicants(list));
    }
    Unassigned(e) {
        if (this.state.checked){
            this.props.dispatch(setApplicants(this.props.unassigned));
            this.setState({
                checked: false,
                filter: "All"
            });
        }else{
            this.props.dispatch(setApplicants(this.props.applicants));
            this.setState({
                checked: true
            });
        }
    }



    render() {
        var header = null;
        if (this.state.value !== ""){
            header = <h4>Searching for {this.state.value}</h4>
        }

        return (
            <div>
            <FormGroup  style={{margin: 0, display: 'flex',flexDirection:"row"}}>
                    <FormControl
                        bsSize="large"
                        type="text"
                        placeholder="Search Applicant"
                        value={this.state.value}
                        onChange={this.handleChange}
                        style={{marginRight:8}}
                    />
                    <Checkbox onChange={this.Unassigned.bind(this)} checked={this.state.checked}>
                        Unassigned
                    </Checkbox>
                    <DropdownButton bsSize="large" title={this.state.filter} pullRight
                                    id="split-button-pull-right">
                        <MenuItem eventKey="1" onClick={this.YearInc.bind(this)}>Year
                            (ascending)</MenuItem>
                        <MenuItem eventKey="2" onClick={this.YearDes.bind(this)}>Year
                            (descending)</MenuItem>
                        <MenuItem eventKey="3" onClick={this.UG.bind(this)}>UG</MenuItem>
                        <MenuItem eventKey="4" onClick={this.MSC.bind(this)}>MSC</MenuItem>
                        <MenuItem eventKey="5" onClick={this.MSAC.bind(this)}>MSAC</MenuItem>
                        <MenuItem eventKey="6" onClick={this.PHD.bind(this)}>PHD</MenuItem>
                        <MenuItem eventKey="8" onClick={this.GetAll.bind(this)}>All
                            Applicants</MenuItem>

                    </DropdownButton>

            </FormGroup>
                {header}
            </div>
        );
    }
}
