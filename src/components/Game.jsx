import React from 'react';
import $ from 'jquery';

import Keyboard from "./Keyboard";
import Board from "./Board";
import Message from "./Message";
import Navbar from "./Navbar/Navbar";
import LoadingScreen from "./Items/LoadingScreen";

import GameResultsPopup from "./Navbar/Popups/GameResultsPopup";

import './styles/game.css';
import raw from '../files/wordle-dictionary.txt';
import wordleAnswerList from '../files/wordle-answer-list.txt';

import {updateGameTheme} from '../functions/updateGameTheme';

/*
 * Load Dictionary
 */
let DICTIONARY;
  async function getDictionary() {
    return fetch(raw)
    .then(r => r.text())
    .then(text => {
      DICTIONARY = text;
      return DICTIONARY;
    });
  }

  // Get answers
  let ANSWER_LIST;
  async function getAnswers(type) {

    var answerFile;

    switch(type) {
      case ("wordle") :
        answerFile = wordleAnswerList;
        break;
      default :
        answerFile = wordleAnswerList;
        break;
    }

    return fetch(answerFile)
    .then(r => r.text())
    .then(text => {
      ANSWER_LIST = text;
      return ANSWER_LIST;
    });
  }

class Game extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      answer: [],
      guesses: [],
      selectedLetters: [],
      maxLetters: 5,
      maxGuesses: 6,
      currentRow: 0,
      wrongLetters: [],
      misplacedLetters: [],
      correctLetters: [],
      guessTypes: [], // This is going to be a matrix with guesses. each value is going to be an array lik [0, 1, 2, 0, 2]. 0: not in word, 1: in word, 2: in correct spot
      error: "",
      type: "wordle",

      gameResultsPopupOpen: false,

      win: false,
      gameOver: false,

      totalWins: 0,
      totalLosses: 0,
      guessesStatistics: [],
      winPercentage: 0,

    }
  }


  async componentDidMount()
  {

    // Set the DICTIONARY
    await getDictionary();

    // Set answer list
    await getAnswers(this.state.type);

    // Set session for the user
    if(!localStorage.getItem("userId"))
    {
      var tempId = this.makeid(15)
      localStorage.setItem("userId", tempId);

      // Need to create a new user in the database
      fetch(process.env.REACT_APP_API_URL + "/insertUser?user=" + tempId)
        .then(res => {
          console.log('New User Created => ' + res);
          updateGameTheme('Slate (default)');
        });

    }
    else
    {
      this.setInitialTheme();
    }

    // Set the answer word
    var todaysAnswer = await this.setAnswer();

    // Get the game results for this user for todays word
    // Check if user already did this answer
    var currentGameResultsRow = await fetch(process.env.REACT_APP_API_URL + "/getGameResults?userId=" + localStorage.getItem("userId") + "&word=" + todaysAnswer);
    var currentGameResultsData = {};
    try {
      currentGameResultsData = await currentGameResultsRow.json();
    }
    catch (err) {
      console.log("No game results!", err);
    }

    if(Object.keys(currentGameResultsData).length > 0)
    {
      currentGameResultsData = currentGameResultsData[0];
      var won = 0;
      if(currentGameResultsData.won)
      {
        won = 1;
      }
      this.setState({
        win: won,
        gameOver: true,
        gameResultsPopupOpen: true,
      });

      var guesses = currentGameResultsData.guesses.split(",");
      var guessesArr = [];
      for(var guessesIndex in guesses)
      {
        guessesArr.push(guesses[guessesIndex].split(""));
      }

      this.setState({
        guesses: guessesArr,
      });
    }


    // Get all the game results for this user
    this.getAllGameResults();

  }


  /*
   * Sets the answer for the day
   */
  setAnswer = async () => {
    var answersArr = ANSWER_LIST.split(/\r?\n/);

    var currDate = new Date()
    currDate.setUTCHours(0,0,0,0);// Set hours to very beginning of the day


    //currDate = currDate.toISOString().slice(0, 19).replace('T', ' '); // This sets it to SQL standard

    // Get the last answer from the database
    return fetch(process.env.REACT_APP_API_URL + "/getMetaData?keyName=currentAnswer")
      .then(res => res.json())
      .then(res => {
        // Get the date of the last word answer
        var lastAnswerDate = new Date(res.time);
        lastAnswerDate.setUTCHours(0,0,0,0); // Set hours to very beginning of the day

        // Calculate the number of days between today and the last answers date
        var Difference_In_Time = currDate.getTime() - lastAnswerDate.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        // If the last answer isn't from today, update it
        if(Difference_In_Days > 0)
        {
          // Find the index of the last answer in the dictionary
          var lastAnswerIndex = answersArr.indexOf(res.valueData);

          // get the new answer
          var newAnswer = answersArr[lastAnswerIndex + Difference_In_Days];

          // Set the state
          var newAnswerArr = newAnswer.split('');
          this.setState({answer: newAnswerArr});

          currDate = currDate.toISOString().slice(0, 19).replace('T', ' '); // This sets it to SQL standard

          // Update the database
          fetch(process.env.REACT_APP_API_URL + "/updateMetaData?keyName=currentAnswer&valueData=" + newAnswer + "&time=" + currDate);

          return newAnswer;
        }
        else
        {
          // Set the current answer as todays answer
          var todaysAnswerString = res.valueData;
          var todaysAnswer = todaysAnswerString.split('');
          this.setState({answer: todaysAnswer});

          return todaysAnswerString;
        }

      });


  }


  /*
   * Get all game results data with this user
   */
  getAllGameResults = async () => {
    var allGameResultsRow = await fetch(process.env.REACT_APP_API_URL + "/getGameResults?userId=" + localStorage.getItem("userId"));
    var allGameResultsData = {};
    try {
      allGameResultsData = await allGameResultsRow.json();
    }
    catch (err) {
      console.log("No game results!", err);
    }

    if(Object.keys(allGameResultsData).length > 0)
    {
      console.log("gameResultsData : ", allGameResultsData);
      console.log("gameResultsData 2: ", Object.keys(allGameResultsData).length);

      var wins = 0;
      var losses = 0;
      var guessesStatistics = Array(this.state.maxGuesses).fill(0); // Holds the amount of times this amout of guesses was used
      for(var dataIndex in allGameResultsData)
      {
        // get the count of rows (if there's only one row, it won't be an object of objects, just an object with that one row with 7 keys )

        var row = allGameResultsData[dataIndex];
        if(row.won)
        {
          wins++;
        }
        else
        {
          losses++;
        }

        var guesses = row.guesses.split(",");

        guessesStatistics[guesses.length-1]++;

        var totalNumberOfGames = Object.keys(allGameResultsData).length;

        // Calculate the Percentage of wins
        var winPercentage = (wins / totalNumberOfGames) * 100;
        winPercentage = Math.ceil(winPercentage);

        this.setState({
          totalWins: wins,
          totalLosses: losses,
          guessesStatistics: guessesStatistics,
          totalNumberOfGames: totalNumberOfGames,
          winPercentage: winPercentage,
        });
      }

    }
  }

  /*
   * Gets results from game-results with query
   */
  getGameResults = async () => {

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
    if(letters.length === this.state.maxLetters && !this.checkDictionary(letters))
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
    //var currentRow = this.state.currentRow;
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
      if(selectedLetters[i] === answer[i])
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
    for(var l = 0; l < this.state.maxLetters; l++)
    {
        trackLetter[selectedLetters[l]] = 0;
    }

    for(var m = 0; m < this.state.maxLetters; m++)
    {
      // 41: increment letter count
      trackLetter[selectedLetters[m]]++;

      // If it's already marked as correct, just move on
      if ( tempGuessTypes[m] === 2 )
      {
        continue;
      }

      // 41: Count how many times this letter occurs in the correct word
      var occurances = 0;
      for(var k = 0; k < this.state.maxLetters; k++)
      {
        if( selectedLetters[m] === answer[k] )
        {
          occurances++;
        }
      }

      // Go through correct word and check each letter
      for(var j = 0; j < this.state.maxLetters; j++)
      {
        // Make sure that occurance isn't already marked as correct
        if(selectedLetters[m] === answer[j] &&  tempGuessTypes[j] !== 2 )
        {
            if ( trackLetter[selectedLetters[m]] <= occurances )
            {
              tempGuessTypes[m] = 1;
            }

            // Add to misplacedLetters array if it's not in correctLetters array
            if( !correctLetters.includes(selectedLetters[m]) && !misplacedLetters.includes(selectedLetters[m]) )
            {
              misplacedLetters.push(selectedLetters[m]);
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
     for(var n = 0; n < this.state.maxLetters; n++)
     {
       if( !correctLetters.includes(selectedLetters[n]) && !misplacedLetters.includes(selectedLetters[n]) && !wrongLetters.includes(selectedLetters[n]) )
       {
         wrongLetters.push(selectedLetters[n]);
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

    /*
     * If the answer is correct
     */
    if(selectedLetters.toString() === answer.toString())
    {
      this.setState({
        win: true,
        gameOver: true,
      });

      setTimeout(() => {
        this.setState({gameResultsPopupOpen: true});
      }, 1500)

      this.updateStatistics("win");
    }

    /*
     * If we lost
     */
     if(guesses.length >= this.state.maxGuesses)
     {
       this.setState({
         gameOver: true,
       });

       setTimeout(() => {
         this.setState({gameResultsPopupOpen: true});
       }, 1500)

       this.updateStatistics("loss");
     }


  }

  /*
   * Update the statistics once the game is over
   */
   updateStatistics = async (winOrLose) => {
     var totalLosses = this.state.totalLosses;

     var totalNumberOfGames = this.state.totalNumberOfGames;
     totalNumberOfGames++;

     var totalWins = this.state.totalWins;

     var guessesStatistics = this.state.guessesStatistics;
     guessesStatistics[this.state.guesses.length]++;

     var won = 0;
     if(winOrLose == "win")
     {
       won = 1;
       this.setState({win: true});
       totalWins++;
     }
     else
     {
       totalLosses++;
     }

     /*
      * Update the data we're sending to the gameResults popup
      */
     var winPercentage = totalWins / totalNumberOfGames * 100;
     winPercentage = Math.ceil(winPercentage);
     this.setState({
       totalLosses: totalLosses,
       totalNumberOfGames: totalNumberOfGames,
       totalWins: totalWins,
       guessesStatistics: guessesStatistics,
       winPercentage: winPercentage,
     });

     // Set the current date
     var currDate = new Date()
     currDate.setUTCHours(0,0,0,0)
     currDate = currDate.toISOString().slice(0, 19).replace('T', ' '); // This sets it to SQL standard

     // Get the answer
     var answer = this.state.answer.join("");

     // Set the guesses seperated by comma
     var guesses = this.state.guesses;
     var guessesString = "";
     for(var guessIndex in guesses)
     {
       guessesString += guesses[guessIndex].join("") + ",";
     }
     guessesString += answer;

     console.log("guessesString : ", guessesString);

     var query = process.env.REACT_APP_API_URL + "/insertGameResults?userId=" + localStorage.getItem("userId") + "&won=" + won + "&numberOfGuesses=" + this.state.guesses.length + "&date=" + currDate + "&word=" + answer + "&guesses=" + guessesString;

     await fetch(query);
   }


  checkDictionary(letters)
  {
    // Get word
    var word = "";
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

     updateGameTheme(currentThemeName);

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
            gameOver={this.state.gameOver}
          />
          <GameResultsPopup
            gameResultsPopupOpen={this.state.gameResultsPopupOpen}
            wordSize={this.state.maxLetters}
            won={this.state.win}
            maxGuesses={this.state.maxGuesses}
            totalNumberOfGames={this.state.totalNumberOfGames}
            totalWins={this.state.totalWins}
            totalLosses={this.state.totalLosses}
            guessesStatistics={this.state.guessesStatistics}
            winPercentage={this.state.winPercentage}
            guesses={this.state.guesses}
          />
        </div>
      </div>
      </>
    )
  }

}



export default Game;
