import React from 'react';

import $ from 'jquery';


import {updateGameTheme} from '../../../functions/updateGameTheme';

import '../../styles/popups/gameResults.css';

class GameResultsPopup extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      numberItems: [],
    }
  }


  componentDidMount()
  {
    // Build the numbers (stats) elements that will show
    this.buildNumberItems();
  }

  componentDidUpdate(prevProps)
  {
    if (this.props.guessesStatistics !== prevProps.guessesStatistics) {
      // Build the numbers (stats) elements that will show
      console.log("Prev guesses : ", this.props.guessesStatistics);
      this.buildNumberItems();
    }
  }

  /*
   * Build guess Number items (the guesses)
   */
   buildNumberItems = () => {
     var results = [];

     for(var i = 0; i < this.props.maxGuesses; i++)
     {
       results.push(<div className="guess-number-wrap"><div className="stat-number">{this.props.guessesStatistics[i]}</div><div className="label">{i+1}</div></div>);
     }

     this.setState({numberItems: results});
   }


  /*
   * Close Popup when 'close' is clicked
   */
  handleClose = () => {
    $('.pop-up-wrap.open').removeClass('open');
  }

  render(){
    return(
      <div className={(this.props.gameResultsPopupOpen ? "open" : "") + " pop-up-wrap"} data-name="game-results-wrap">
        <div className="content-wrap">
            <h1>{this.props.won ? "Congrats!" : "Better luck next time!"}</h1>


              <div className="statistics-wrap">
                <div className="stats-item-wrap"><div className="stat-number">{this.props.totalNumberOfGames}</div><div className="label">Games Played</div></div>
                <div className="stats-item-wrap"><div className="stat-number">{this.props.totalWins}</div><div className="label">Wins</div></div>
                <div className="stats-item-wrap"><div className="stat-number">{this.props.totalLosses}</div><div className="label">Losses</div></div>
                <div className="stats-item-wrap"><div className="stat-number">{this.props.winPercentage}%</div><div className="label">Win Percentage</div></div>
              </div>

              <h3>Guesses</h3>
              <div className="statistics-wrap">
                {this.state.numberItems}
              </div>

              <div className="row center buttons bottom-sticky">
                <div className="close-popup button" onClick={() => {this.handleClose()}}>
                  Close
                </div>
              </div>
        </div>



      </div>
    )
  }
}

export default GameResultsPopup;
