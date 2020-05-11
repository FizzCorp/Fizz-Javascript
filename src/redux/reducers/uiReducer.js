import {
 CONNECTED,
 DISCONNECTED,
 MESSAGE_PUBLISHED,
 MESSAGE_UPDATED,
 MESSAGE_DELETED,
 MESSAGES_FETCHED
} from '../actions'; 


const initialState = {
  connected: false,
  messages: {}
};

export default function(state = initialState, action) {
  switch(action.type) {
    
    case CONNECTED: return {
      ...state,
      connected: true
    };

    case MESSAGES_FETCHED: return {
      ...state,
      messages: Object.assign({}, action.messages.reduce((result, item) => { result[item._id] = item; return result; }, {}))
    }
    
    default: return state;
  }
};