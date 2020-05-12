import { MESSAGE_STATE } from '../constants';
import moment from 'moment'
import {
  CONNECTED,
  DISCONNECTED,
  MESSAGE_PUBLISHED,
  MESSAGE_UPDATED,
  MESSAGE_DELETED,
  MESSAGES_FETCHED,
  SENDING_MESSAGE,
  SENDING_MESSAGE_FAILURE
 } from './actions'; 


const FizzClient  = require('fizz-client');
const APP_ID = "751326fc-305b-4aef-950a-074c9a21d461";
const APP_SECRET = "5c963d03-64e6-439a-b2a9-31db60dd0b34";
let client;

const generateMessageJson = (params) => {
  const _id = moment().valueOf();
  const { nick, message, channelId } = params;
  return {
    _id,
    _nick: nick,
    _from: nick,
    _created: _id,
    _to: channelId,
    _body: message,
    _topic: channelId,
    _status: MESSAGE_STATE.PENDING
  };
}

const connected = () => {
  return { type: CONNECTED };
};

const disconnected = () => {
  return { type: DISCONNECTED };
};

const messagesFetched = (messages) => {
  return { type: MESSAGES_FETCHED, messages};
};

const messagePublished = (message) => {
  return { type: MESSAGE_PUBLISHED, message };
};

const messageUpdated = (message) => {
  return { type: MESSAGE_UPDATED, message };
};

const messageDeleted = (message) => {
  return { type: MESSAGE_DELETED, message };
};

const sendingMessage = (message) => {
  return { type: SENDING_MESSAGE, message }
};

const sendingMessageFailure = (message) => {
  return { type: SENDING_MESSAGE_FAILURE, message }
};

/* if further state updation needed on promise success */
/*
const sendingMessageSuccess = (message) => {
  return { type: SENDING_MESSAGE_SUCCESS, message }
};
*/


export const fizzConnect = (channelId, userId, locale) => (dispatch) => {

  (async () => {
    console.log("Received", userId, locale)
    client = await FizzClient.create(APP_ID, APP_SECRET, userId, locale);
        
    // Hook connected event. Fired everytime the client connectes to the message broker.
    client.chat.on('connected', async (syncRequired) => {

      // Update state on UI (e.g. enable message input field)
      dispatch(connected());

      try {
          if (syncRequired) { // Sync client state, always subscribe in connected listener
              await client.chat.subscribe(channelId);

              // query the last(most recent) 50 messages published in the channel
              let messages = await client.chat.queryLatest(channelId, 50);

              // Update messages on UI
              dispatch(messagesFetched(messages));
          }
      }
      catch(err) {
          console.error(err);
      }
    });

    // Hook disconnected event. Fired everytime the client disconnects from the message broker.
    client.chat.on('disconnected', () => {
      // update state on UI (e.g. disable message input field)
      dispatch(disconnected());
    });
    // Hook the messagePublished event. Fired everytime a message is published to a subscribed channel.
    client.chat.on('messagePublished', message => {
      // update state on UI (append message to channel message list control)
      dispatch(messagePublished(message));
    });
    // Hook the messageUpdated event. Fired everytime a message is updated in a subscribed channel.
    client.chat.on('messageUpdated', message => {
      // update state on UI (update message in channel message list control)
      dispatch(messageUpdated(message));
    });
    // Hook the messageDeleted event. Fired everytime a message is deleted from a subscribed channel.
    client.chat.on('messageDeleted', message => {
      // update state on UI (delete message from channel message list control)
      dispatch(messageDeleted(message));
    });

  })();


};

export const sendMessage = (params = {}) => (dispatch) => {
  
  (async () => {

    const messageItem = generateMessageJson(params);
  
    const { _to, _body, _nick } = messageItem;
    // Update UI with new message with pending state
    dispatch(sendingMessage(messageItem));

    try {
      // Send the actual message, would be available later in a `messagePublished` socket event
      await client.chat.publishMessage(_to, _nick, _body, JSON.stringify({ _refId: messageItem._id }), true, true, true);
    }
    catch (err) {
      messageItem._status = MESSAGE_STATE.FAILED
      // Update sent message state to failure
      dispatch(sendingMessageFailure(messageItem));
    };
    

  })();

}