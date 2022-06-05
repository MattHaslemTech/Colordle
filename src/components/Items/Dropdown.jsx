import React from 'react';

import $ from 'jquery';

import '../styles/items/dropdown.css';

class Dropdown extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      items: [],
      open: "false",
      selected: "",
      test: "",
    }

    this.openDropdown = this.openDropdown.bind(this);
  }

  // Put the options into a list of items to toss in dropdown
  buildOptions()
  {
    var options = this.props.options;
    var results = [];

    var i = 0;
    options.forEach((value, key) => {
      if($(value).hasClass('heading'))
      {
      results.push(<div key={i} className="heading row" onClick={this.selectItem}>{value}</div>)
      }
      else
      {
        results.push(<div key={i} className="item row" onClick={this.selectItem}>{value}</div>)
      }

      i++;
    });

    return results;
  }

  openDropdown()
  {

    var dropdownOpen = this.state.open;

    // If we're closing the menu
    if(dropdownOpen == "true")
    {
      this.setState({open: "false"});
    }
    else
    {
      this.setState({open: "true"});
    }
  }



  selectItem = (e) => {
    this.setState({selected: e.target});

    // If this is a header don't worry about it

    // Grab the .item wrap holding what we clicked on
    var selectedItemHtml;
    if(!$(e.target).hasClass('item'))
    {
      selectedItemHtml = $(e.target).closest('.item').clone();
    }
    else
    {
      selectedItemHtml = $(e.target).clone();
    }
    $('.dropdown-wrap .top-item').html(selectedItemHtml);
  }


  render()
  {
    var options = this.buildOptions();
    return(
      <div className="dropdown-wrap" data-value="" onClick={this.openDropdown} data-open={this.state.open}>
        <div className="top-item item">
          Select
        </div>
        <div className="options-wrap">
          {options}
        </div>
      </div>
    )
  }
}

export default Dropdown;
