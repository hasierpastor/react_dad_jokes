import React, { Component } from 'react';
import Joke from './Joke'
import axios from 'axios'
import './App.css'

class Jokes extends Component {
  constructor(props){
    super(props)
    this.state = {
      jokes: []
    }
  }

  async componentDidMount(){
    let pendingPromises = []
    for (let i=0; i<10; i++){
      let jokePromise = axios.get('https://icanhazdadjoke.com/')
      pendingPromises.push(jokePromise)
    }
    let resolvedJokes = await Promise.all(pendingPromises)
    this.setState({jokes: resolvedJokes}, ()=>console.log(this.state))
  }
  
  render() {
    return (
      <div className="App">
        <Joke />
      </div>
    );
  }
}

export default Jokes;
