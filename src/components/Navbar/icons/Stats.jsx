import React from "react";

class Stats extends React.Component {

  handleClick = () => {
    this.props.onClick();
  }

  render(){
    return (
      <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
        <path fill="var(--color-tone-1)" d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"></path>
      </svg>
    )
  }
}

export default Stats;
