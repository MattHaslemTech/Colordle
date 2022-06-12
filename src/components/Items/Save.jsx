import React from 'react';

class SaveButton extends React.Component
{
  constructor(props) {
      super(props);
      this.state = { apiResponse: "" };
  }

  callAPI() {
      fetch("http://localhost:9000/updateUserSettings?theme=cool")
          .then(res => res.text())
          .then(res => this.setState({ apiResponse: res }));
  }

  componentDidMount() {
      this.callAPI();
  }

  render()
  {
    return(
      <>
        <div className="close-popup button save" onClick={window.closePopUp}>
          ;{this.state.apiResponse}
        </div>
      </>
    )
  }
}

export default SaveButton;
