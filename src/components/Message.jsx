import React from 'react';
import './styles/message.css';

class Message extends React.Component
{
  constructor(props)
  {
    super(props);
  }

/*
  shouldComponentUpdate(nextProps) {
      if (nextProps.message !== this.props.message) {
        return true;
      }

      return false;

   }
*/
   render(){
     var show = "";
     if(this.props.message !== "")
     {
       show = "show";
     }

     // Set random key so it rerenders and shows the animation every time
     return <div key={Math.random()} data-show={show} className="message-pop-up-wrap">{this.props.message}</div>
   }

}

export default Message;
