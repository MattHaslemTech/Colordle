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
      wrongLetters: [],
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


  /*
   * Handle everything that happens once a user hits submit
   */
  handleSubmit = () =>
  {
    var selectedLetters = this.state.selectedLetters.slice();
    var answer = this.state.answer.slice();
    var currentRow = this.state.currentRow;
    var allGuessTypes = this.state.guessTypes.slice();

    var correctLetters = this.state.correctLetters.slice();
    var misplacedLetters = this.state.misplacedLetters.slice();
    var wrongLetters = this.state.wrongLetters.slice();

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

        // Add to correctLetters array
        if( !correctLetters.includes(selectedLetters[i]) )
        {
          correctLetters.push(selectedLetters[i]);

          // Remove from misplacedLetters array if it's in there
          if( misplacedLetters.includes(selectedLetters[i]) )
          {
            var index = misplacedLetters.indexOf(selectedLetters[i]);
            misplacedLetters.splice(index, 1);
          }
        }

      }
      else
      {
        tempGuessTypes.push(0);
      }
    }


    /*
     * Check if letter is in  incorrect spot
     * 41: Make sure this letter hasn't already been marked as wrong-spot (ex: if the correct word is "RAISE" and the guess is "EVERY", we don't want to mark both E's as wrong-spot)
     */

    // Create associative array that will keep track of how many time the guessed letter has appeared in the word so far as we traverse it
    var trackLetter = [];
    for(var i = 0; i < this.state.maxLetters; i++)
    {
        trackLetter[selectedLetters[i]] = 0;
    }

    for(var i = 0; i < this.state.maxLetters; i++)
    {
      // 41: increment letter count
      trackLetter[selectedLetters[i]]++;

      // If it's already marked as correct, just move on
      if ( tempGuessTypes[i] == 2 )
      {
        continue;
      }

      // 41: Count how many times this letter occurs in the correct word
      var occurances = 0;
      for(var k = 0; k < this.state.maxLetters; k++)
      {
        if( selectedLetters[i] == answer[k] )
        {
          occurances++;
        }
      }

      // Go through correct word and check each letter
      for(var j = 0; j < this.state.maxLetters; j++)
      {
        // Make sure that occurance isn't already marked as correct
        if(selectedLetters[i] == answer[j] &&  tempGuessTypes[j] !== 2 )
        {
            if ( trackLetter[selectedLetters[i]] <= occurances )
            {
              tempGuessTypes[i] = 1;
            }

            // Add to misplacedLetters array if it's not in correctLetters array
            if( !correctLetters.includes(selectedLetters[i]) && !misplacedLetters.includes(selectedLetters[i]) )
            {
              misplacedLetters.push(selectedLetters[i]);
            }

        }

      }

    }

    // Save guess type
    allGuessTypes.push(tempGuessTypes);
    this.setState({ guessTypes: allGuessTypes });


    /*
     * Now we need to do all the stuff that updates colors on keyboard
     */
     // If the letter isn't in correctLetters or misplacedLetters arrays, put it in wrongLetters
     for(var i = 0; i < this.state.maxLetters; i++)
     {
       if( !correctLetters.includes(selectedLetters[i]) && !misplacedLetters.includes(selectedLetters[i]) && !wrongLetters.includes(selectedLetters[i]) )
       {
         wrongLetters.push(selectedLetters[i]);
       }
     }
     this.setState({correctLetters: correctLetters});
     this.setState({misplacedLetters: misplacedLetters});
     this.setState({wrongLetters: wrongLetters});

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
                  correctLetters={this.state.correctLetters}
                  misplacedLetters={this.state.misplacedLetters}
                  wrongLetters={this.state.wrongLetters}
                  />
      </div>
    )
  }

}



export default Game;
