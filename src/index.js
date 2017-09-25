import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase'
import registerServiceWorker from './registerServiceWorker';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAkQKVEvSYvWd0wB3vZZos1zsNqvPJG774",
    authDomain: "teachmex-5e854.firebaseapp.com",
    databaseURL: "https://teachmex-5e854.firebaseio.com",
    projectId: "teachmex-5e854",
    storageBucket: "teachmex-5e854.appspot.com",
    messagingSenderId: "460515468551"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
