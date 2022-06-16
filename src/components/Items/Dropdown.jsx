import React from 'react';
import {createRoot} from 'react-dom/client';

import $ from 'jquery';

import '../styles/items/dropdown.css';

import DownTriangle from './icons/DownTriangle';

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
      selected: this.props.default,
      test: "",
    }

    this.openDropdown = this.openDropdown.bind(this);
  }



  /*
   * When props are changed, update the dropdown (used to reset dropdown when 'cancel' is pressed)
   */
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.default !== prevProps.default) {
      this.setState({selected: this.props.default});

      // Get dropdown wrap
      var dropdownWrap = $('[data-name="' + this.props.name + '"]').find('top-item');

      var selectedItemHtml = this.props.default;

      const rootElement = document.getElementById('top-' + this.props.name);
      const root = createRoot(rootElement);
      root.render(selectedItemHtml);

    }
  }


  // Put the options into a list of items to toss in dropdown
  buildOptions()
  {
    var options = this.props.options;
    var results = [];

    var i = 0;
    options.forEach((value, key) => {
      results.push(<div key={i} className="item row" onClick={this.selectItem}>{value}</div>);

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





  openDropdown(e)
  {

    var dropdownOpen = this.state.open;

    var itemClickedOn = $(e.target);

    // If we're closing the menu
    if(dropdownOpen == "true")
    {
      // If we're using the color picker, don't worry about it.
      if(!itemClickedOn.closest('.react-colorful').length)
      {
        this.setState({open: "false"});
      }

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

    $('.dropdown-wrap[data-name="' + this.props.name + '"] .top-item').html(selectedItemHtml);
  }


  render()
  {

    /*
     *  Show dropdown triangle if props are set to do so
     */
    var dropdownTriangle = <></>;
    if(this.props.dropdownTriangle && this.props.dropdownTriangle == "true")
    {
      dropdownTriangle = <DownTriangle />;
      console.log('cool');
    }

    return(
      <div className="dropdown-wrap" data-id={this.state.id} data-name={this.props.name} data-type={this.props.type} onClick={this.openDropdown} data-open={this.state.open}>
        <div className="top-item" id={"top-" + this.props.name}>
          {this.props.default}
          {dropdownTriangle}
        </div>
        <div className="options-wrap">
          {this.state.items}
        </div>

      </div>
    )
  }
}

export default Dropdown;
