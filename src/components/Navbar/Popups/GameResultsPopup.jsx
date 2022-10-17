import React from 'react';

import $ from 'jquery';


import {updateGameTheme} from '../../../functions/updateGameTheme';

import '../../styles/popups/gameResults.css';

class GameResultsPopup extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
    }
  }


  componentDidMount()
  {
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
                <div className="guess-number-wrap">
                  <div className="stat-number">
                    20
                  </div>
                  <div className="label">
                    1
                  </div>
                </div>
                <div className="guess-number-wrap">
                  <div className="stat-number">
                    10
                  </div>
                  <div className="label">
                    2
                  </div>
                </div>
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
