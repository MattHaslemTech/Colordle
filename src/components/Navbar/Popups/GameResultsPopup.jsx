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

  /*
   * Build guess Number items (the guesses)
   */
   buildNumberItems = () => {
     var results = [];

     for(var i = 1; i < this.props.maxGuesses + 1; i++)
     {
       results.push(<div className="guess-number-wrap"><div className="stat-number">10</div><div className="label">2</div></div>);
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
