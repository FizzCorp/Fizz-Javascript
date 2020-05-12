import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import {sendMessage} from '../redux/actionsCreators';

export class Input extends Component {

  componentDidUpdate(/* prevProps, prevState*/) {
    const textArea = document.getElementById('w-input-text');
    textArea.focus();
  }

  sendMessage = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // const textArea = $('#w-input-text');
    const textArea = document.getElementById('w-input-text');
    const message = textArea.textContent.trim();
    console.log("message: ", message);
    textArea.textContent = '';

    if (message.length === 0) {
      console.error('cannot send empty message!');
    }
    else {
      const { roomId, userId } = this.props;
      this.props.sendMessage({ message, channelId: roomId, nick: userId });
    }
  }

  handleMessageInput = (event) => {
    if (event.charCode === 13 && !event.shiftKey) {
      this.sendMessage(event);
      return false;
    }

    return true;
  }

  render() {
    const { connected } = this.props;
    const buttonStyle = {
      marginTop: "auto",
      paddingBottom: "15px",
      background: "transparent",
      color: "rgb(33, 133, 208)"
    };
    return (
      <div className='chat-controls-container'>
        <div id='w-input-container'>
          <div className='w-input-text-group'>
            <div id='w-input-text' contentEditable={connected} onKeyPress={this.handleMessageInput} />
            <div className='w-placeholder'>{'Type a message'}</div>
          </div>
        </div>
        <button onClick={this.sendMessage} className="ui blue button circular icon" style={buttonStyle}>
           <i className="large paper plane icon"></i>
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { roomId, userId } = props;
  const { connected } = state.UI;

  return {
    roomId,
    userId,
    connected
  };

};

const mapDispatchToProps = {
  sendMessage
}

// component meta
Input.propTypes = {
  roomId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(Input)
