import React from 'react'
import {Helper} from './utils/helper'
import Button from './Button'

export interface IDemoProps{

}

export interface IDemoState{

    userinfo: any
    name: string
    designation: string
    company: string
    message: string
    isSubmit: boolean
}


class ReactDemo extends React.Component<IDemoProps,IDemoState> {
    constructor(props:IDemoProps) {
        super(props)

        this.state = {
            userinfo : [],
            name: '',
            designation:'',
            company: '',
            message: '',
            isSubmit: false
        }
    }

    public componentDidMount() {

        Helper.getUsers().then((data) =>{
            this.setState({
                     userinfo : data
            })

        })
    }

    render() {
        return (
            <React.Fragment>
                <h2 className="container">React App Demo</h2>
                <h4 className="container">Add Users : </h4>
                
                <form className="container">
                   <label> Name : </label>
                        <input type="text" className="form-control col-md-4" name="name" value={this.state.name} onChange={this.handleChange}/>
                   
                   <label> Designation : </label>
                        <input type="text" className="form-control col-md-4" name="designation" value={this.state.designation}  onChange={this.handleChange} />
                   
                    <label>Company : </label> 
                        <input type="text" className="form-control col-md-4" name="company" value={this.state.company}  onChange={this.handleChange} />

                <Button label="Submit" click={this.handleSubmit}/> <br/><br/>

                {this.state.isSubmit === true? <div className="alert alert-success col-md-4">{this.state.message}</div> : "" }<br/><br/>
                
                <Button label="Get Users" click={this.handleGetItems}/>

                </form> <br />

                <h3 className="container">List of Users:</h3>

                <table className="container table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>Company</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                        {this.state.userinfo.map((e, idx)=>
                            <tr>
                                <td>{e.Title}</td>
                                <td>{e.Designation}</td>
                                <td>{e.Company}</td>
                                <td style={{ width: '20px'}}> <button type="button" className="btn btn-danger" onClick={() => this.DeleteRow(idx)}> Remove </button> </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </React.Fragment>
        )
    }

    handleChange = (e) => {
        const { name, value } = e.target;

        let {userinfo} = this.state
        this.setState({ 
        [name] : value 
        } as IDemoState)
 
    }
    
    handleSubmit = (e) => {
        e.preventDefault()

        const UserData = {Name: this.state.name, Designation: this.state.designation, Company: this.state.company}
        Helper.addUser(UserData).then((success) => {
            if (success) {
                this.setState({
                    message: 'User Added Successfully',
                    isSubmit: true
                })
            }
    })
}
    handleGetItems = (e) => {
        e.preventDefault()

        Helper.getUsers().then((data) =>{
            this.setState({
                     userinfo : data
            })

        })
    }

DeleteRow = (idx) => {
    let retVal = window.confirm("Do you really want to delete?");
    if(retVal == true){
    
    const userinfo = [...this.state.userinfo]
    Helper.GetIDCDelete(userinfo[idx],idx) 
    userinfo.splice(idx, 1)
    this.setState({ userinfo })

    
}
}

}

export default ReactDemo