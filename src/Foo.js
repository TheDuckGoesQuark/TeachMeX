/**
 * Created by USER on 26/09/2017.
 */
import React from 'react'
import {Button, Thumbnail, Alert} from 'react-bootstrap'
import firebase from 'firebase'


export default class Foo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dogs: []
        }
    }

    addDogs(dogObjs) {
        let images = dogObjs.map((dogObj, index) => {
            return <DogImage url={dogObj.url} key={index+this.state.dogs.length}/>
        });
        this.setState({
            dogs: [...images, ...this.state.dogs]
        })
    }

    handleClick() {
        let self = this;
        fetch('https://api.thedogapi.co.uk/v2/dog.php?limit=1')
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error(response.statusText)
                }
            }).then((json) => {
            self.addDogs(json.data);
        });
    }

    render() {
        const wellStyles = {maxWidth: 400, margin: '10px auto 10px'};
        return (<div>
            <div className="well" style={wellStyles}>
                <Button onClick={() => {this.handleClick()}}
                        bsStyle="primary"
                        bsSize="large"
                        block
                >
                    Get a dog
                </Button>
            </div>
            {this.state.dogs}
        </div>)
    }
}

class DogImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            added: false,
            hidden: false
        }
    }

    handleRemove() {
        this.setState({hidden: true})
    }

    handleAdd() {
        let database = firebase.database();
        let doggosRef = database.ref('doggos/');
        let newDoggoRef = doggosRef.push();
        newDoggoRef.set({
            url: this.props.url,
            time: (new Date().toDateString())
        }, (error)=>{
            if(error) {
                alert("Data could not be saved. "+error)
            } else {
                this.setState({added: true});
            }
        })
    }

    render() {
        const removed = <Alert bsStyle="warning">Removed</Alert>;
        const added = <Alert bsStyle="success">Added</Alert>;
        const thumbnail = (<Thumbnail src={this.props.url}>
            <h3>Doggo</h3>
            <p>
                <Button onClick={()=>this.handleAdd()} bsStyle="primary">Save this lil pupper?</Button>
                <Button onClick={()=>this.handleRemove()} bsStyle="default">B A D B O Y E</Button>
            </p>
        </Thumbnail>);
        if (this.state.added) return added;
        else if (this.state.hidden) return removed;
        else return thumbnail;
    }
}