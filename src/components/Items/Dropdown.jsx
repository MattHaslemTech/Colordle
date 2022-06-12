import React from 'react';

import $ from 'jquery';

import '../styles/items/dropdown.css';

/*
 * Pass a callback function in each optiion (prop: callback) if you want some function to execute once an option is clicked on
 *      Pass a value (prop: value) in each option if you want to pass a value to the callback
 */
class Dropdown extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      items: this.buildOptions(),
      open: "false",
      selected: "Select",
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
      results.push(<div key={i} className="item row" data-value={this.props.value} onClick={this.selectItem}>{value}</div>);

      i++;
    });

    // If this has custom Theme Options
    if(this.props.customThemeOptions)
    {
      var customOptions = this.props.customThemeOptions;
      var tempKey = "heading-" + i;
      results.push(<div key={tempKey} className="heading">Custom<div className="line"></div></div>);
      var j = i;
      customOptions.forEach((value, key) => {
          results.push(<div key={j} className="item row" data-value={this.props.value} onClick={this.selectItem}>{value}</div>)
        j++;
      });
    }

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
    // For testing ??
    this.setState({selected: e.target});

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

    // Update selected State
    var selectedValue = $(e.target).closest('.item').find('[data-value]').attr('data-value');
    this.setState({selected: selectedValue});

    // If this has a callback in props -> execute it
    if(this.props.callback)
    {
      var value = $(selectedItemHtml).find('[data-value]').attr('data-value');
      this.props.callback(value);
    }

    $('.dropdown-wrap .top-item').html(selectedItemHtml);
  }


  render()
  {

    return(
      <div className="dropdown-wrap" data-id={this.state.id} onClick={this.openDropdown} data-open={this.state.open}>
        <div className="top-item">
          <div className="item row">
            {this.props.default}
          </div>
        </div>
        <div className="options-wrap">
          {this.state.items}
        </div>
      </div>
    )
  }
}

export default Dropdown;
