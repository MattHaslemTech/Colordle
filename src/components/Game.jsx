import React from 'react';

import Keyboard from "./Keyboard";
import './styles/game.css';


class Game extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      letters: [],
    }
  }




  render()
  {
    return (
      <div className="all-content-wrap">
        <Keyboard letters={this.state.letters} />
      </div>
    )
  }

}



export default Game;
