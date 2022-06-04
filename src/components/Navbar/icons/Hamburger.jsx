import React from "react";

class Hamburger extends React.Component {

  constructor(props)
  {
    super(props);
  }

  handleClick = () => {
    this.props.onClick();
  }

  render(){
    return (
      <div id="hamburger-icon"  onClick={this.handleClick} data-menu-open={this.props.open}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 25.24">
          <defs>

          </defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
              <rect className="hamburger-line" width="30" height="5.23" rx="2.61"/>
              <rect className="hamburger-line" y="10.01" width="30" height="5.23" rx="2.61"/>
              <rect className="hamburger-line" y="20.01" width="30" height="5.23" rx="2.61"/>
            </g>
          </g>
        </svg>
      </div>
    )
  }
}

export default Hamburger;
