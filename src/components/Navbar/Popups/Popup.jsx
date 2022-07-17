import React from 'react';


import ThemesPopUp from './ManageThemes';
import ColorPopUp from './ColorPopup';

class PopUp extends React.Component {

  constructor(props)
  {
    super(props);

    this.state = {
      content: <></>,
    }

  }

  componentDidUpdate(prevProps) {
    if (this.props.popupName !== prevProps.popupName) {
      this.getPopup();
    }
  }

  getPopup()
  {
    var popupName = this.props.popupName;
    var content;
    switch(popupName)
    {
      case "manageThemes":
        content = <ThemesPopUp closePopup={this.props.closePopup} />
        break;
      case "color":
        content = <ColorPopUp closePopup={this.props.closePopup} />
        break;
      default:
        content = <></>
    }

    this.setState({content: content});
  }

  render()
  {
    var open = "";
    if(this.props.open)
    {
      open = "open";
    }

    //var content = this.getPopup();

    return(

      <div className={open + " pop-up-wrap"} data-name={this.props.popupName}>
        <div className="content-wrap">
          {this.state.content}
        </div>
      </div>
      /*
      <div className={"open pop-up-wrap"} data-name="color">
        <div className="content-wrap">
          <ColorPopUp closePopup={this.props.closePopup} />
        </div>
      </div>
      */
    )
  }

}

export default PopUp;
