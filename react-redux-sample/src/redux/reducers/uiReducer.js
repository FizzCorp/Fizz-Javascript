import {
 CONNECTED,
 DISCONNECTED,
 MESSAGE_PUBLISHED,
 MESSAGE_UPDATED,
 MESSAGE_DELETED,
 MESSAGES_FETCHED,
 SENDING_MESSAGE,
 SENDING_MESSAGE_FAILURE
} from '../actions'; 


const initialState = {
  connected: false,
  messages: {}
};

export default function(state = initialState, action) {
  switch(action.type) {
    
    /* Update state on connected event */
    case CONNECTED: return {
      ...state,
      connected: true
    };

    /* Update state on disconnected event */
    case DISCONNECTED: return {
      ...state,
      connected: false
    };

    /* Merge all new messages in existing messages:Map */
    case MESSAGES_FETCHED: return {
      ...state,
      messages: Object.assign({}, action.messages.reduce((result, item) => { result[item._id] = item; return result; }, {}))
    }

    /* Add/Update for failure for new messages */
    case SENDING_MESSAGE: 
    case SENDING_MESSAGE_FAILURE:
    return {
      ...state,
      messages: {
        ...state.messages,
        ...{ [action.message._id]: action.message }
      }
    }

    /* Replace fake message record in state with actual one on `messagePublished` event */
    case MESSAGE_PUBLISHED: {
      let data = action.message._data && JSON.parse(action.message._data);
      let messageRefId = data && data._refId;
      let messages = JSON.parse(JSON.stringify(state.messages));
      if (messageRefId && messages[messageRefId]) delete messages[messageRefId];

      return {
        ...state,
        messages: {
          ...messages,
          ...{ [action.message._id]: action.message }
        }
      };
    }
    
    /* Replace message content with its updates  */
    case MESSAGE_UPDATED: return {
      ...state,
      messages: {
        ...state.messages,
        ...{ [action.message._id]: action.message }
      }
    };

    /* Delete message from state */
    case MESSAGE_DELETED: {
      let id = action.message._id;
      let messages = JSON.parse(JSON.stringify(state.messages));
      if (messages[id]) delete messages[id];
  
      return {
        ...state,
        messages
      }
    }

    
    default: return state;
  }
};