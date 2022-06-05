import React from 'react';

import '../../styles/popups.css';
import '../../styles/items/dropdown.css';

class ColorPopUp extends React.Component {

  constructor(props)
  {
    super(props);
  }

  render(){
    return(
      <div className="pop-up-wrap">
        <div className="content-wrap">
          <h1>Edit Colors</h1>
          <div className="row">
            <div className="title">Theme:</div>
            <div className="right-side option">
              <div className="dropdown-wrap" data-value="">
                <div className="top-item">
                  Select
                </div>
                <div className="options-wrap">
                  <div className="item row">
                    <div className="title">
                      Sweet
                    </div>
                    <div className="colors">
                      Cool
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ColorPopUp;
