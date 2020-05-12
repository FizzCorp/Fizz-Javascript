//React Redux
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

// Local Imports
import MessagePipeline from './containers/Pipeline';

export class Messages extends Component {


  componentDidUpdate(prevProps) {
    const msgDiv = document.getElementsByClassName('fizz-messages')[0];
    msgDiv.scrollTop = msgDiv.scrollHeight;
  }

  renderMessageList() {

    const { locale, messages, sessionUserId, handleRetryClick, handleDeletionClick, handleModerationClick } = this.props;
    const transformed = MessagePipeline({ locale, messages, sessionUserId, handleRetryClick, handleDeletionClick, handleModerationClick });

    return (
      <div className='fizz-messages'>
        <div className='fizz-message-items ui segment'>
          {transformed.map(item => item.component)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3 className="ui header">{'Room: ' + this.props.roomId}</h3>
        {this.renderMessageList()}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  ...props,
  ...state.UI,
})

const mapDispatchToProps = {
  handleRetryClick: (/* params*/) => { },
  handleDeletionClick: (/* params*/) => { },
  handleModerationClick: (/* params*/) => { }
}

// component meta
Messages.propTypes = {
  roomId: PropTypes.string.isRequired,
  sessionUserId: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
  handleRetryClick: PropTypes.func.isRequired,
  handleDeletionClick: PropTypes.func.isRequired,
  handleModerationClick: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages)
