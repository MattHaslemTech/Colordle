import React from 'react';

import './styles/keyboard.css';


let allLetters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v","b","n","m"];



class Keyboard extends React.Component{
  constructor(props){
    super(props);
    this.handleKeyClick = this.handleKeyClick.bind(this);
    this.state = {
      letters: this.buildLetters(),
      addLetter: this.props.addLetter,
      correctLetters: [],
      misplacedLetters: [],
      wrongLetters: [],
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.correctLetters !== prevProps.correctLetters)
    {
      this.setState({ correctLetters: this.props.correctLetters });
      this.setState({ misplacedLetters: this.props.misplacedLetters });
      this.setState({ wrongLetters: this.props.wrongLetters });
      this.setState({ letters: this.buildLetters() });
    }
  }


  // Generate initial list of lettersl
  buildLetters()
  {
    var letters = [];

    var correctLetters = this.props.correctLetters.slice();
    var misplacedLetters = this.props.misplacedLetters.slice();
    var wrongLetters = this.props.wrongLetters.slice();

    var handleKeyClick = this.handleKeyClick;

    allLetters.forEach(function(letter){
      // Check for letter type
      var letterType = "";
      if( correctLetters.includes(letter) )
      {
        letterType = "correct-spot";
      }
      if( misplacedLetters.includes(letter) )
      {
        letterType = "in-word";
      }
      if( wrongLetters.includes(letter) )
      {
        letterType = "not-in-word";
      }


      letters.push(<Letters key={letter} letter={letter} type={letterType} handleClick={handleKeyClick} />);
    });

    return letters;
  }

  handleKeyClick = (letter) =>
  {
    // If the game is over, forget about it
    if(this.props.gameOver)
    {
        return 0;
    }

    // Copy current letters
    var currentLetters = this.props.selectedLetters.slice();

    // If we hit the delete button
    if(letter === "delete")
    {
      currentLetters.pop();
      this.props.updateSelectedLetters(currentLetters);
      return;
    }

    // If we hit submit
    if(letter === "enter")
    {
      this.props.handleSubmit();
      return;
    }


    // If the max number of letters is already there, don't do anything
    if(this.props.selectedLetters.length === this.props.maxLetters)
    {
      return;
    }


    currentLetters.push(letter);

    // Update selected letters
    this.props.updateSelectedLetters(currentLetters, letter);
  }


  /*
   * Generate the three rows of keyboard
   */
  buildKeyboard()
  {
    // Get copy of letters
    var letters = this.state.letters.slice();

    // Define add letter function so we can
    var handleKeyClick = this.handleKeyClick;

    var fullKeyboard = [];

    // Generate first row of keys
    var tempRow = [];
    for(var i = 0; i < 10; i++)
    {
      tempRow.push(letters[i]);
    }
    fullKeyboard.push(tempRow);

    // Generate second row of keys
    tempRow = [];
    for(var j = 0; j < 9; j++)
    {
      tempRow.push(letters[j + 10]);
    }
    fullKeyboard.push(tempRow);

    // Generate third row of keys (account for enter and delete)
    tempRow = [];
    tempRow.push(<Letters key={"delete"} letter={"delete"} type={"not-selected"} handleClick={handleKeyClick} />);

    for(var k = 0; k < 9; k++)
    {
      tempRow.push(letters[k + 19]);
    }

    tempRow.push(<Letters key={"enter"} letter={"enter"} type={"not-selected"} handleClick={handleKeyClick} />);
    fullKeyboard.push(tempRow);

    return fullKeyboard;

  }


  render(){
    var fullKeyboard = this.buildKeyboard();
    return(
      <>
        <div className={this.props.gameOver ? "disabled keyboard-wrap" : "keyboard-wrap"}>
          <div className="row">
            {fullKeyboard[0]}
          </div>
          <div className="row">
            {fullKeyboard[1]}
          </div>
          <div className="row">
            {fullKeyboard[2]}
          </div>
        </div>
      </>
    )
  }
}


/*
 * Hold the letters and there states
 *
 * Type: not-selected, not-in-word, in-word, correct-spot
 */

class Letters extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      letter: this.props.letter,
      type: this.props.type,
    }
  }

  // Change state as props change
  componentDidUpdate(prevProps) {
    if(this.props.type !== prevProps.type) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
      this.setState({type: this.props.type });
    }
  }


  handleClick = () => {
    this.props.handleClick(this.state.letter);
  }




  render(){

    var content = this.state.letter;

    // Return the delete button with image instead of the letter
    if(this.state.letter === "delete")
    {
      return(
        <div className="letter" data-type={this.props.type} data-value={this.state.type} onClick={() => this.handleClick()}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path fill="var(--keyboard-text-color)" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
        </svg>
        </div>
      )
    }

    return(
      <div className="letter" data-type={this.props.type} data-value={this.state.letter} onClick={() => this.handleClick()}>
        {content}
      </div>
    )
  }
}


export default Keyboard;
