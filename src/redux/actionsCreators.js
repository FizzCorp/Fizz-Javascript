import { MESSAGE_STATE } from '../constants';
import moment from 'moment'

const FizzClient  = require('fizz-client');
const APP_ID = "751326fc-305b-4aef-950a-074c9a21d461";
const APP_SECRET = "5c963d03-64e6-439a-b2a9-31db60dd0b34";

const { actions } = require('./actions');

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

let client;

export const fizzConnect = (roomId, userId, locale) => (dispatch) => {

  (async () => {
    console.log("Received", userId, locale)
    client = await FizzClient.create(APP_ID, APP_SECRET, userId, locale);
        
    // Hook connected event. Fired everytime the client connectes to the message broker.
    client.chat.on('connected', async (syncRequired) => {

      // Update state on UI (e.g. enable message input field)
      dispatch(actions.connected());

      try {
          if (syncRequired) { // Sync client state, always subscribe in connected listener
              await client.chat.subscribe(roomId);

              // query the last(most recent) 50 messages published in the channel
              let messages = await client.chat.queryLatest(roomId, 50);

              // Update messages on UI
              dispatch(actions.messagesFetched(messages));
          }
      }
      catch(err) {
          console.error(err);
      }
    });

    // Hook disconnected event. Fired everytime the client disconnects from the message broker.
    client.chat.on('disconnected', () => {
      // update state on UI (e.g. disable message input field)
      dispatch(actions.disconnected());
    });
    // Hook the messagePublished event. Fired everytime a message is published to a subscribed channel.
    client.chat.on('messagePublished', message => {
      // update state on UI (append message to channel message list control)
      dispatch(actions.messagePublished(message));
    });
    // Hook the messageUpdated event. Fired everytime a message is updated in a subscribed channel.
    client.chat.on('messageUpdated', message => {
      // update state on UI (update message in channel message list control)
      dispatch(actions.messageUpdated(message));
    });
    // Hook the messageDeleted event. Fired everytime a message is deleted from a subscribed channel.
    client.chat.on('messageDeleted', message => {
      // update state on UI (delete message from channel message list control)
      dispatch(actions.messageDeleted(message));
    });

  })();


};

export const sendMessage = (params = {}) => (dispatch) => {
  
  (async () => {
    console.log("This should work", params);
    const messageItem = generateMessageJson(params);
  
    const { _to, _body, _nick } = messageItem;
    dispatch(actions.sendingMessage(messageItem));

    try {
      await client.chat.publishMessage(_to, _nick, _body, JSON.stringify({ _refId: messageItem._id }), true, true, true);
    }
    catch (err) {
      messageItem._status = MESSAGE_STATE.FAILED
      dispatch(actions.sendingMessageFailure(messageItem));
    };
    

  })();

}