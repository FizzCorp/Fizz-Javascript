
// Socket Actions
export const CONNECTED = 'CONNECTED';
export const DISCONNECTED = 'DISCONNECTED';
export const MESSAGE_PUBLISHED = 'MESSAGE_PUBLISHED';
export const MESSAGE_UPDATED = 'MESSAGE_UPDATED';
export const MESSAGE_DELETED = 'MESSAGE_DELETED';

// REST-based Actions
export const MESSAGES_FETCHED = 'MESSAGES_FETCHED';

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
  messagesPublished: (message) => {
    return { type: MESSAGE_PUBLISHED, message };
  },
  messageUpdated: (message) => {
    return { type: MESSAGE_UPDATED, message };
  },
  messageDeleted: (message) => {
    return { type: MESSAGE_DELETED, message };
  }

}


