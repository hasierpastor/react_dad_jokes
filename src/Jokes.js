import React, { Component } from 'react';
import Joke from './Joke'
import axios from 'axios'
import {ReactSpinner} from 'react-spinning-wheel';
import 'react-spinning-wheel/dist/style.css';

function isDuplicate(id,jokes){
 let duplicate = true;
  for (let joke of jokes) {
    if (id === joke.id)
      duplicate = false;
  }
  return duplicate
}

class Jokes extends Component {
  constructor(props){
    super(props)
    this.state = {
      jokes: [],
      isLoading: true
    }

    this.handleClick = this.handleClick.bind(this);
  }

  async requestJokes() {
    let jokes = [];
    while (jokes.length<10) {
      let jokeObject = await axios.get('https://icanhazdadjoke.com/',{headers:{"Accept": "application/json"}})
      
      let id = jokeObject.data.id;
      if (isDuplicate(id,jokes)) jokes.push({joke:jokeObject.data.joke, id:jokeObject.data.id, score: 0})        
    }
    return jokes
  }

  async handleClick(evt) {
    // set isLoading to true while we await the jokes
    this.setState({isLoading: true});

    // clear local storage
    localStorage.clear();

    // request 10 new jokes
    let jokes = await this.requestJokes();
    
    // after all jokes are received, set to local storage and set isLoading to false
    this.setState({jokes, isLoading: false}, function() {
      let storage = jokes.map(joke => ({id: joke.id, joke: joke.joke, score: 0}));
      localStorage.setItem("jokes", JSON.stringify(storage));
    });

  }

  async componentDidMount(){
    
    let storedJokes = JSON.parse(localStorage.getItem("jokes"));

    // if there are jokes in local storage, do not request request cards
    if (!storedJokes) {
      // request array of jokes
      let jokes = await this.requestJokes();
      // set state to local storage after state is set
      this.setState({jokes, isLoading: false}, function() {
        let storage = jokes.map(joke => ({id: joke.id, joke: joke.joke, score: 0}))
        localStorage.setItem("jokes", JSON.stringify(storage));
      })
    } else {
      // already jokes in local storage, place the stored jokes on state
      this.setState({jokes: storedJokes, isLoading: false}) 
    }

  }
  
  render() {
   if (!this.state.isLoading){
    return (
      <div className="Jokes">
        <h1>Dad Jokes!</h1>
        <button onClick={this.handleClick}>Gimme Better Jokes</button>
        {this.state.jokes.map(joke=> <Joke text={joke.joke} key={joke.id} id={joke.id} score={joke.score}/>)}
      </div>
    );
  }
  else{
    return  (
      <div>
        <h1>Loading...</h1>
        <ReactSpinner />
      </div>
      )
    }
  }
}

export default Jokes;
