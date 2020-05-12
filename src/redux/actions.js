
// Socket Actions
export const CONNECTED = 'CONNECTED';
export const DISCONNECTED = 'DISCONNECTED';
export const MESSAGE_PUBLISHED = 'MESSAGE_PUBLISHED';
export const MESSAGE_UPDATED = 'MESSAGE_UPDATED';
export const MESSAGE_DELETED = 'MESSAGE_DELETED';

// REST-based Actions and their variations
export const MESSAGES_FETCHED = 'MESSAGES_FETCHED';

export const SENDING_MESSAGE = 'SENDING_MESSAGE';
export const SENDING_MESSAGE_FAILURE = 'SENDING_MESSAGE_FAILURE';

/* if further state updation needed on promise success */
// export const SENDING_MESSAGE_SUCCESS = 'SENDING_MESSAGE_SUCCESS';


export const actions = {
  connected: () => {
    return { type: CONNECTED };
  },
  disconnected: () => {
    return { type: DISCONNECTED };
  },
  messagesFetched: (messages) => {
    return { type: MESSAGES_FETCHED, messages};
  },
  messagePublished: (message) => {
    return { type: MESSAGE_PUBLISHED, message };
  },
  messageUpdated: (message) => {
    return { type: MESSAGE_UPDATED, message };
  },
  messageDeleted: (message) => {
    return { type: MESSAGE_DELETED, message };
  },
  sendingMessage: (message) => {
    return { type: SENDING_MESSAGE, message }
  },
  sendingMessageFailure: (message) => {
    return { type: SENDING_MESSAGE_FAILURE, message }
  },
  /* if further state updation needed on promise success */
  /*
      sendingMessageSuccess: (message) => {
        return { type: SENDING_MESSAGE_SUCCESS, message }
      },
  */


}


