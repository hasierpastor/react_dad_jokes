import React, { Component } from 'react'

class Joke extends Component {
  constructor(props){
    super(props)
    this.state = {
      score: this.props.score
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(evt){
   let delta = evt.target.name === 'VoteUp' ? 1 : -1;
   
   this.setState(st => ({score: this.state.score + delta}))
  }

  componentDidUpdate(prevProps, prevState) {
    // update score for this item in local storage
    let storedJokes = JSON.parse(localStorage.getItem('jokes'));

    for (let i=0; i<storedJokes.length; i++) {
      if (storedJokes[i].id === this.props.id) {
        storedJokes[i].score = this.state.score;
      }
    }

    localStorage.setItem("jokes", JSON.stringify(storedJokes))
  }
  
  render() {
    return (
      <div className="Joke">
       <h3>{this.props.text}</h3>
       <h5>{this.state.score}</h5>
       <button name="VoteUp" onClick={this.handleClick}>Vote Up</button>
       <button  name="VoteDown" onClick={this.handleClick}>VoteDown</button>
      </div>
    );
  }
}

export default Joke;
