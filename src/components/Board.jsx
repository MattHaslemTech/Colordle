import React from 'react';

import $ from 'jquery';

import './styles/board.css';

class Board extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      numberOfGuesses: 6,
      guesses: [],
      rows: [],
      maxLetters: this.props.maxLetters,
      activeRow: 0,
    }

  }

  /*
   * Build the board after it is mounted (because we can't edit the state until it is)
   */
  componentDidMount() {
       this.buildBoard();
  }

  componentDidUpdate(prevProps) {

    if(this.props.currentRow !== prevProps.currentRow) // Check if current row is updated
    {
      this.setState({activeRow: this.props.currentRow });
    }

    if(this.props.selectedLetters !== prevProps.selectedLetters) // Check if letters are updated
    {
      this.refreshBoard();
    }


    if(this.props.guesses !== prevProps.guesses) // Check if current row is updated
    {
      this.setState({guesses: this.props.guesses });
    }
  }

  buildBoard()
  {
    // Fill empty guesses
    var guesses = [];
    for(var i = 0; i < this.state.numberOfGuesses; i++)
    {
      guesses.push("");
    }
    this.setState({guesses: guesses});

    var rows = [];
    for(var i = 0; i < this.state.numberOfGuesses; i++)
    {
        rows.push(<BoardRow key={i} letters={guesses[i]} maxLetters={this.state.maxLetters} rowNum={i} guessTypes={this.props.guessTypes} />);
    }
    this.setState({rows: rows});

  }

  refreshBoard()
  {
    // Update current guess
    var guesses = this.props.guesses.slice();
    var activeRow = this.props.currentRow;
    guesses[activeRow] = this.props.selectedLetters;

    var oldRows = this.state.rows.slice();
    var rows = [];
    for(var i = 0; i < this.state.numberOfGuesses; i++)
    {
      if(i <= activeRow)
      {
        rows.push(<BoardRow key={i} letters={guesses[i]} maxLetters={this.state.maxLetters} rowNum={i} guessTypes={this.props.guessTypes} />);
      }
      else
      {
        rows.push(oldRows[i]);
      }
    }

    this.setState({rows: rows});
  }


  render(){
    return(
      <div className="board-wrap">
        <h1>Letters {this.props.selectedLetters} </h1>
        <h1>Current Row {this.state.activeRow} </h1>
        {this.state.rows}
      </div>
    )
  }
}









class BoardRow extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        letters: this.props.letters,
        maxLetters: this.props.maxLetters
    }
  }

  componentDidMount() {
       this.buildRow();
  }

  componentDidUpdate(prevProps) {
    if(this.props.letters !== prevProps.letters) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
      this.refreshRow();
    }
  }

  buildRow()
  {
    var letters = [];
    for(var i = 0; i < this.state.maxLetters; i++)
    {
      letters.push(<BoardLetter key={"row=" + this.props.rowNum + "-letter-" + i} letter="" />)
    }
    this.setState({letters: letters});
  }

  refreshRow()
  {
    var letters = [];
    var selectedLetters = this.props.letters;
    var letter = "";
    var guessTypes = this.props.guessTypes;

    for(var i = 0; i < this.state.maxLetters; i++)
    {

      // Check if guess type exists for this row. If not set an array full of 4's
      if( guessTypes[this.props.rowNum] !== undefined )
      {
        var guessType = guessTypes[this.props.rowNum][i];
      }
      else
      {
        var guessType = 4;
      }

      // Set the letter if already set
      letter = "";
      if(i < selectedLetters.length)
      {
        letter = selectedLetters[i];
      }

      letters.push(<BoardLetter key={"row=" + this.props.rowNum + "-letter-" + i} letter={letter} guessType={guessType} />)
    }
    this.setState({letters: letters});
  }

  render(){
    return(
      <div className="board-row">
        {this.state.letters}
      </div>
    )
  }

}


class BoardLetter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      letter: this.props.letter,
      type: 4,
    }
  }

  // Change state as props change
  componentDidUpdate(prevProps) {
    if(this.props.guessType !== prevProps.guessType) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
      this.setState({type: this.props.guessType });
    }
  }

  render(){

    // Set class to add to letter
    var typeClass = "";
    switch(this.props.guessType){
      case 0:
        typeClass = "not-in-word";
        break;
      case 1:
        typeClass = "in-word";
        break;
      case 2:
        typeClass = "correct-spot";
        break;
      case 4:
        typeClass = "not-checked";
        break;

    }

    return(
      <div className="board-letter" data-type={typeClass}>
        {this.props.letter}
      </div>
    )
  }
}


export default Board;
