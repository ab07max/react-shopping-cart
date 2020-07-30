import React, { Component } from 'react';

import Shelf from '../Shelf';
import Filter from '../Shelf/Filter';
// import GithubCorner from '../github/Corner';
import FloatCart from '../FloatCart';
import NavBar from '../NavigationBar';
import firebase from '../../services/firebase';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

class App extends Component {
  state = {isSignedIn: false}
  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: () => false
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({isSignedIn: !!user})
      console.log("user", user);
    })
    
  }
  render(){
    return (
      <React.Fragment>
    {/* <GithubCorner /> */}
    <NavBar />
    <div className="App">
          {this.state.isSignedIn ? (
            <span>
              {/* <div>Signed In! </div> */}
              <button onClick={() => firebase.auth().signOut()}>Sign out</button>
              <h3> Welcome {firebase.auth().currentUser.displayName}</h3>
              {/* <img alt="profile picture" src={firebase.auth().currentUser.photoURL}/> */}
            </span>
          ): (
            <StyledFirebaseAuth 
              uiConfig={this.uiConfig}
              firebaseAuth={firebase.auth()}
            />
          )}
        </div>
    <main>
      <Filter />
      <Shelf />
    </main>
    <FloatCart />
  </React.Fragment>    
    )
  }
}


export default App;
