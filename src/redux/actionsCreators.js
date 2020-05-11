const FizzClient  = require('fizz-client');
const APP_ID = "751326fc-305b-4aef-950a-074c9a21d461";
const APP_SECRET = "5c963d03-64e6-439a-b2a9-31db60dd0b34";
const CHANNEL_ID = "global-channel";

const { actions } = require('./actions');

export const fizzConnect = () => (dispatch) => {

  (async () => {
    
    let client = await FizzClient.create(APP_ID, APP_SECRET, "userA", "en");
        
    // Hook connected event. Fired everytime the client connectes to the message broker.
    client.chat.on('connected', async (syncRequired) => {

      // Update state on UI (e.g. enable message input field)
      dispatch(actions.connected());

      try {
          if (syncRequired) { // Sync client state, always subscribe in connected listener
              await client.chat.subscribe(CHANNEL_ID);

              // query the last(most recent) 10 messages published in the channel
              let messages = await client.chat.queryLatest(CHANNEL_ID, 50);

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


// module.exports = {
//   foo: () => console.log(1)
// };