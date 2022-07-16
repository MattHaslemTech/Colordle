import React from 'react';
import $ from 'jquery';

import Keyboard from "./Keyboard";
import Board from "./Board";
import Message from "./Message";
import Navbar from "./Navbar/Navbar";
import LoadingScreen from "./Items/LoadingScreen";

import './styles/game.css';
import raw from '../files/wordle-dictionary.txt';

/*
 * Load Dictionary
 */
let DICTIONARY;
fetch(raw)
  .then(r => r.text())
  .then(text => {
    DICTIONARY = text;
  });

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


  componentDidMount()
  {
    this.setInitialTheme();

    // Set session for the user
    if(!localStorage.getItem("userId"))
    {
      var tempId = this.makeid(15)
      localStorage.setItem("userId", tempId);

      // Need to create a new user in the database
      const res = fetch(process.env.REACT_APP_API_URL + "/insertUser?user=" + tempId)
                  .then(res => console.log('New User Created'));

    }

  }

  /*
   * Update letters on board from keyboard interaction
   */
  updateSelectedLetters = (letters, letter) =>
  {
    this.setState({ selectedLetters: letters });
    // Remove Previous errors
    this.setState({error: ""});


    // Add little pop effect to letter
    $('.board-letter.pop').removeClass('pop');
    if(letter !== undefined) // If we didn't hit delete
    {
      var newLetterTile = $('.board-row[data-active="active"] .board-letter:empty').first();

      newLetterTile.addClass('pop');

    }



    // If we reached max letters and the word isn't in the dictionary, the letters should be red
    var activeRow = $('.board-row[data-active="active"]');
    if(letters.length == this.state.maxLetters && !this.checkDictionary(letters))
    {
      activeRow.addClass('not-in-dictionary');

      // Do shake animation
      if(activeRow.hasClass('shake'))
      {
        activeRow.removeClass('shake');
      }
      // Set timeout is so it doesn't add class immediately after it was removed (was preventing animation trigger)
      setTimeout(function(){
        activeRow.addClass('shake');
      }, 100);

    }
    else
    {
      if($('.board-row[data-active="active"]').hasClass('not-in-dictionary'))
      {
        $('.board-row[data-active="active"]').removeClass('not-in-dictionary');
      }
    }




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

    var activeRow = $('.board-row[data-active="active"]');

    // Make sure there are enough letters
    if(selectedLetters.length < this.state.maxLetters)
    {
      this.setState({error: "Not Enough Letters"});
      return;
    }

    /*
     * Make sure word is in dictionary
     */
     if(!this.checkDictionary(selectedLetters))
     {
       this.setState({error: "Word Not Included In List"});

       // Do shake animation
       if(activeRow.hasClass('shake'))
       {
         activeRow.removeClass('shake');
       }
       // Set timeout is so it doesn't add class immediately after it was removed (was preventing animation trigger)
       setTimeout(function(){
         activeRow.addClass('shake');
       }, 100);

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


  checkDictionary(letters)
  {
    // Get word
    var word = "";
    var selectedLetters = this.state.selectedLetters;
    letters.forEach(function(letter){
      word += letter;
    })

    if(DICTIONARY.includes(word))
    {
      return true;
    }
    else
    {
      return false;
    }
  }



  /*
   * Set initial theme that's set in user-settings
   *
   * This gets an object from the DB and passes it to 'setInitialThemeValues()' which actually sets the theme values
   */
   setInitialTheme = async() => {

     // Grab set theme from 'users' table
     const userReq = await fetch(process.env.REACT_APP_API_URL + "/getUser?user=" + localStorage.getItem("userId"));
     let userData = await userReq.json();

     const currentThemeName = userData.currentTheme;

     // Check if the theme is a default one
     this.getDefaultTheme(currentThemeName)
      .then(data => {

        var themeArr;
        // If the theme exist in default-themes;
        if(Object.keys(data).length > 0)
        {
          this.setInitialThemeValues(data);
        }

        // If it's not a default theme
        else
        {
          this.getUserTheme(currentThemeName)
           .then(data2 => {
             this.setInitialThemeValues(data2);
           });
        }
      });

   }


   setInitialThemeValues = (themeObject) => {

     const themeKeys = [
       "game-bg-color",
       "navbar-bg-color",
       "menu-bg-color",
       "hamburger-open-bg-color",
       "text-color",
       "keyboard-text-color",
       "board-text-color",
       "keyboard-letter-background",
       "letter-selected-row-bg-color",
       "letter-bg-color",
       "letter-color-glow",
       "letter-correct-spot-bg-color",
       "letter-bg-in-word-color",
       "letter-not-in-word-text-color",
       "not-in-dictionary-bg-color"
     ];

     for(var key in themeObject)
     {
       var value = themeObject[key];

       // The key from the SQL table doesn't have hyphens in it, so we have to match it to one that does.
       var keyName;
       for(var index in themeKeys)
       {
         var varName = themeKeys[index].replace(/-/g, "");
         if(varName === key)
         {
           keyName = themeKeys[index];
         }
         console.log("Var name : " + varName);
       }

       // Make sure we only get the color values
       if(keyName === undefined)
       {
         continue;
       }

       keyName = "--" + keyName;
       $('#game-master').get(0).style.setProperty(keyName, value);
     }

   }


   /*
    * Get data from default theme
    *
    * Used to check if a theme is default or not.
    */
   getDefaultTheme = (themeName) => {
     var results;
     return fetch(process.env.REACT_APP_API_URL + "/getDefaultThemes?themeName=" + themeName)
                        .then(res => res.json())
                        .then(data => {
                          return data;
                        });

   }

   getUserTheme = (themeName) => {
     var results;
     return fetch(process.env.REACT_APP_API_URL + "/getUserThemes?themeName=" + themeName + "&user=" + localStorage.getItem("userId"))
                        .then(res => res.json())
                        .then(data => {
                          return data;
                        });

   }


   makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *  charactersLength));
     }
     return result;
  }

  render()
  {
    return (
      <>
      <div id="game-master">
        <Navbar />
        <div className="all-content-wrap">

          <LoadingScreen />

          <Message message={this.state.error} />
          <Board  maxLetters={this.state.maxLetters}
                  selectedLetters={this.state.selectedLetters}
                  selectedLettersSize={this.state.selectedLetters.length}
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
      </div>
      </>
    )
  }

}



export default Game;
