import React from 'react';

import Keyboard from "./Keyboard";
import Board from "./Board";
import './styles/game.css';


class Game extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      answer: ["r","a","i","s","r"],
      guesses: [],
      selectedLetters: [],
      maxLetters: 5,
      currentRow: 0,
      misplacedLetters: [],
      correctLetters: [],
      guessTypes: [], // This is going to be a matrix with guesses. each value is going to be an array lik [0, 1, 2, 0, 2]. 0: not in word, 1: in word, 2: in correct spot
      error: "",
    }
  }


  updateSelectedLetters = (letters) =>
  {
    this.setState({ selectedLetters: letters });
    this.setState({error: ""});
  }


  // When a user hits enter
  handleSubmit = () =>
  {
    var selectedLetters = this.state.selectedLetters.slice();
    var answer = this.state.answer.slice();
    var currentRow = this.state.currentRow;
    var allGuessTypes = this.state.guessTypes.slice();

    // Make sure there are enough letters
    if(selectedLetters.length < this.state.maxLetters)
    {
      this.setState({error: "Not Enough Letters"});
      return;
    }

    // Check if letter is in right spot ( we're going to put arrays in each )
    var tempGuessTypes = [];
    for(var i = 0; i < this.state.maxLetters; i++)
    {
      // If in correct spot
      if(selectedLetters[i] == answer[i])
      {
        tempGuessTypes.push(2);
      }
      else
      {
        tempGuessTypes.push(0);
      }
    }


    // Check if letter is in  incorrect spot
    for(var i = 0; i < this.state.maxLetters; i++)
    {
      // If it's already marked as correct, just move on
      if ( tempGuessTypes[i] == 2 )
      {
        continue;
      }

      // Go through correct word and check each letter
      for(var j = 0; j < this.state.maxLetters; j++)
      {

        if(selectedLetters[i] == answer[j] &&  tempGuessTypes[j] !== 2 )
        {
            tempGuessTypes[i] = 1;
        }

      }

    }

    // Save guess type
    allGuessTypes.push(tempGuessTypes);
    this.setState({ guessTypes: allGuessTypes });
    console.log("Guess types: " + this.state.guessTypes);


    // Save Guess
    var guesses = this.state.guesses.slice();
    guesses.push(selectedLetters);
    this.setState({guesses: guesses});

    // Reset selected letters
    var emptyArr = [];
    this.setState({selectedLetters: emptyArr});

    // Move to next row
    var nextRow = this.state.currentRow+ 1;
    this.setState({currentRow: nextRow});


  }

  render()
  {
    return (

      <div className="all-content-wrap">
        <Board  maxLetters={this.state.maxLetters}
                selectedLetters={this.state.selectedLetters}
                currentRow={this.state.currentRow}
                guesses={this.state.guesses}
                guessTypes={this.state.guessTypes}
        />
        <Keyboard addLetter={this.addSelectedLetters}
                  updateSelectedLetters={this.updateSelectedLetters}
                  handleSubmit={this.handleSubmit}
                  selectedLetters={this.state.selectedLetters}
                  maxLetters={this.state.maxLetters}
                  />
      </div>
    )
  }

}



export default Game;
