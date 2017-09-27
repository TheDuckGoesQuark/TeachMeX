// imports React library for us to use, and specifies the React.Component class
import React, {Component} from 'react';
// imports a static image to be used
import logo from './logo.svg';
// imports the css to be used for components in this file
import './App.css';
// imports the default exported class that we made!
import Doggos from './Doggo'

// Extend component to make App a React component
class App extends Component {
    // Every react component needs a render() method that can return null or JSX elements.
    render() {
        // Note: since 'class' is already a keyword in javascript, className is used to specify html classes
        // HTML tags work as normal in JSX
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React</h2>
                </div>
                <Doggos />
            </div>
        );
    }
}
// export - this class can be imported into other files
// default - if no specific class is specified, this class will be exported
export default App;
