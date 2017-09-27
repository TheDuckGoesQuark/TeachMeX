/**
 * Created by USER on 26/09/2017.
 */
import React from 'react'
import {Button, Thumbnail, Alert} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css'
import firebase from 'firebase'

export default class Doggos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dogs: [],
            view: 'add-new'
        }
    }

    addDogs(dogObjs) {
        const noAddFunc = (self, key) => {
            self.setState({hidden: true})
        };
        if(!dogObjs) {return;}
        let images = dogObjs.map((dogObj, index) => {
            return <DogImage handleRemove={noAddFunc} url={dogObj.url} key={index+this.state.dogs.length} identifier={index+this.state.dogs.length}/>
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

    handleViewChange() {
        if (this.state.view == 'add-new') {
            const alreadyAddedRemove = (self, ref) => {
                firebase.database().ref('doggos/'+ref).remove();
                self.setState({hidden: true})
            };
            let database = firebase.database();
            database.ref('doggos/').once('value')
                .then((snapshot) => {
                    let doggos = [];
                    snapshot.forEach((doggo) => {
                        let key = doggo.ref.key;
                        doggos.push(<DogImage handleRemove={alreadyAddedRemove} url={doggo.val().url} key={key} identifier={key} />)
                    });
                    this.setState({view: 'added', dogs: doggos});
                });
        }
        else this.setState({view: 'add-new', dogs: []});
    }


    render() {
        const wellStyles = {maxWidth: 400, margin: '10px auto 10px'};
        return (<div>
            <div className="well" style={wellStyles}>
                {this.state.view == 'add-new' ? <Button onClick={() => {this.handleClick()}}
                        bsStyle="primary"
                        bsSize="large"
                        block
                >

                    Get a dog
                </Button> : <div></div>}
                <Button onClick={() => {this.handleViewChange()}}
                        bsStyle="primary"
                        bsSize="large"
                        block
                >
                    {this.state.view == 'add-new' ? "See Approved Doggos" : "Add More Doggos" }
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
        this.props.handleRemove(this, this.props.identifier)
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