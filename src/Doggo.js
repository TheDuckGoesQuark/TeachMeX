/**
 * Created by USER on 26/09/2017.
 */
import React from 'react'
// Imports the Button, Thumbnail and Alert components from react-bootstrap
import {Button, Thumbnail, Alert} from 'react-bootstrap'
// Import the css styling needed to make the react-bootstrap components pretty
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css'
// Imports the firebase library to allow us to communicate with the service
import firebase from 'firebase'

export default class Doggos extends React.Component {
    // Constructor is necessary to specify initial state
    constructor(props) {
        super(props);
        this.state = {
            // dogs will contain our JSX dog thumbnails
            dogs: [],
            // view will specify if we want to see new dogs, or previously added ones
            view: 'add-new'
        }
    }

    addDogsFromAPI(dogObjs) {
        // Specifies function for removing these dogs
        const noAddFunc = (self, key) => {
            self.setState({hidden: true})
        };
        // Exits function if no dogs are supplied :(
        if (!dogObjs) {
            return;
        }
        // Maps each doggo to a DogImage instance, supplying the image source, and a key
        let images = dogObjs.map((dogObj, index) => {
            return <DogImage handleRemove={noAddFunc} url={dogObj.url} key={index + this.state.dogs.length}
                             identifier={index + this.state.dogs.length}/>
        });
        // Adds these new doggos to our state to render the new doggo list
        // the ... operator (called 'spread') changes an array like [1,2,3] into separate parameters 1, 2, 3
        this.setState({
            dogs: [...images, ...this.state.dogs]
        })
    }

    getMoreDogsClick() {
        // keeps a reference to this Doggos Component as it goes out of scope inside the 'fetch' function
        let self = this;
        // Makes a GET request to the dog api for 1 doggo.
        fetch('https://api.thedogapi.co.uk/v2/dog.php?limit=1')
            .then((response) => {
                // Checks request was successful
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error(response.statusText)
                }
            }).then((json) => {
            // Adds our list of dogs to our page :)
            self.addDogsFromAPI(json.data);
        });
    }

    // Loads dogs from firebase
    loadDatabaseDogs() {
        // Since we want to remove these dogs from firebase, a different remove function is needed that tells firebase to
        // remove this dog
        const alreadyAddedRemove = (self, ref) => {
            firebase.database().ref('doggos/' + ref).remove();
            self.setState({hidden: true})
        };
        // Gets reference to doggo's in firebase, and maps each one to a DogImage instance
        let database = firebase.database();
        database.ref('doggos/').once('value')
            .then((snapshot) => {
                let doggos = [];
                snapshot.forEach((doggo) => {
                    let key = doggo.ref.key;
                    doggos.push(<DogImage handleRemove={alreadyAddedRemove} url={doggo.val().url} key={key}
                                          identifier={key}/>)
                });
                this.setState({view: 'added', dogs: doggos});
            });
    }

    // Changes the view between adding new dogs, and seeing already added dogs
    handleViewChange() {
        if (this.state.view == 'add-new') {
            this.loadDatabaseDogs();
        }
        else this.setState({view: 'add-new', dogs: []});
    }


    render() {
        // Inline styling example for the buttons container
        const wellStyles = {maxWidth: 400, margin: '10px auto 10px'};
        // JSX being treated as a JS variable
        const getMoreDogsButton = (<Button onClick={() => {this.getMoreDogsClick()}}
                                          bsStyle="primary"
                                          bsSize="large"
                                          block> Get a dog </Button>);
        const switchViewButton = (<Button onClick={() => {this.handleViewChange()}}
                                          bsStyle="primary"
                                          bsSize="large"
                                          block>{this.state.view == 'add-new' ? "See Approved Doggos" : "Add More Doggos" }</Button>);
        // bool ? val1 : val2 syntax => tertiary operator, i.e. fancy if-statement.
        // if (bool) then {return val1} else {return val2}
        return (<div>
            <div className="well" style={wellStyles}>
                {this.state.view == 'add-new' ? getMoreDogsButton : <div></div>}
                {switchViewButton}
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
        }, (error) => {
            if (error) {
                alert("Data could not be saved. " + error)
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
                <Button onClick={() => this.handleAdd()} bsStyle="primary">Save this lil pupper?</Button>
                <Button onClick={() => this.handleRemove()} bsStyle="default">B A D B O Y E</Button>
            </p>
        </Thumbnail>);
        if (this.state.added) return added;
        else if (this.state.hidden) return removed;
        else return thumbnail;
    }
}