import React from "react";

class DownTriangle extends React.Component {

  constructor(props)
  {
    super(props);
  }

  handleClick = () => {
    this.props.onClick();
  }

  render(){
    return (

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 10" className="dropdownTriangle">
        <defs>
        </defs><g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <polygon className="dropdown-triangle" fill="var(--color-tone-1)" points="7.5 10 15 0 0 0 7.5 10"/>
          </g>
        </g>
      </svg>

    )
  }
}

export default DownTriangle;
