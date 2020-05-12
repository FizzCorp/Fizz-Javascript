//React Redux
import React from 'react'
import moment from 'moment';

//local imports
import { getColorFromString, datesAreDifferent } from '../helpers'
import {
  Seperator,
  SentFirst,
  SentNormal,
  ReceiveFirst,
  ReceiveNormal
} from './MessageItem.js';

// helper methods - items / cells transformation
const transformItem = (params) => {
  const { item, lastUserId, Components } = params;
  const newItem = { ...item };

  if (!newItem.transformed) {
    if (newItem.props.message._from === lastUserId) {
      newItem.component = (<Components.normal {...newItem.props} />);
    }
    else {
      newItem.component = (<Components.different {...newItem.props} />);
    }
    newItem.transformed = true;
  }
  return newItem;
};

const transformItems = (params) => {
  let lastUserId;
  const { pipeline, userIdCb, Components } = params;

  return pipeline.map((item) => {
    let updatedItem = item;
    if (typeof userIdCb === 'function' && userIdCb(updatedItem.props.message._from)) {
      updatedItem = transformItem({ item, lastUserId, Components });
    }
    lastUserId = updatedItem.props.message._from;
    return updatedItem;
  });
};

const transformForSent = (params) => {
  const { pipeline, sessionUserId } = params;
  return transformItems({
    pipeline,
    userIdCb: userId => userId === sessionUserId,
    Components: {
      normal: SentNormal,
      different: SentFirst
    }
  });
};

const transformForReceive = (params) => {
  const { pipeline, sessionUserId } = params;
  return transformItems({
    pipeline,
    userIdCb: userId => userId !== sessionUserId,
    Components: {
      normal: ReceiveNormal,
      different: ReceiveFirst
    }
  });
};

// helper methods - message transformation
const createPipeline = (params) => {
  const { locale, messages, handleRetryClick, handleDeletionClick, handleModerationClick } = params;
  return Object.keys(messages).reduce((pipeline, key) => {
    const message = messages[key];
    const nick = message._from;
    pipeline.push({
      transformed: false,
      component: undefined,
      props: {
        locale,
        key, message,
        handleRetryClick,
        handleDeletionClick,
        handleModerationClick,
        nickColor: getColorFromString(nick)
      }
    });
    return pipeline;
  }, []);
};

const addSeperatators = (params) => {
  const temp = [];
  let lastInserted;
  const { pipeline } = params;

  pipeline.forEach((item) => {
    const currentItemTS = item.props.message._created;
    if (!lastInserted || datesAreDifferent(lastInserted, currentItemTS)) {
      const currMoment = moment();
      const currItemMoment = moment(currentItemTS);

      let timeInWords;
      if (currItemMoment.isSame(currMoment, 'day')) {
        timeInWords = 'Today';
      }
      else if (currMoment.diff(currItemMoment, 'hours') <= 24) {
        timeInWords = 'Yesterday';
      }
      else if (currItemMoment.isSame(currMoment, 'week')) {
        timeInWords = currItemMoment.format('dddd');
      }
      else {
        timeInWords = currItemMoment.format('Do MMM YY');
      }

      temp.push({
        transformed: true,
        component: <Seperator key={currentItemTS} text={timeInWords} />
      });
      lastInserted = item.props.message._created;
    }
    temp.push(item);
  });
  return temp;
};

/*
  Pipline.js receives an array of messages and make an intermediary structure 
  that would display the messages in presentable format like in normal chat UIs 

  Map array of objects with additional attributes to used later in respective components.

*/
const Pipeline = (params) => {
  const { locale, messages, sessionUserId, handleRetryClick, handleDeletionClick, handleModerationClick } = params;

  /* Step 1: Pipeline creation
    For each message object, map component with additional attributes.
    processed flag is false for all initially.
  */
  let pipeline = createPipeline({ locale, messages, handleRetryClick, handleDeletionClick, handleModerationClick });

  /* Step 2: Transform for Receive
    Replace 'component' attribute with transformForReceive for all the received messages.
    Update processed flag to true.
    Note: 
      Received Messages from same user are grouped together in UI
      Two types are
        ReceiveFirst: The first message by a user (shown in UI as box having top-left border not rounded)
        ReceiveNormal: The remaining messages by this same user (shown in UI with all rounded borders)
  */
  pipeline = transformForReceive({ pipeline, sessionUserId });

  /* Step 3: Transform for Receive
    Replace 'component' attribute with transformForSent for all the sent messages.
    Update processed flag to true.
    Note: 
      Sent Messeges of current session user are grouped together in UI
      Two types are
       SentFirst: The first sent message by the current user (top-right border not rounded)
       SentNormal: The remaining messages by current user (shown in UI with all rounded borders)
  */
  pipeline = transformForSent({ pipeline, sessionUserId });

  /* Step 4: Transform for Receive
    Add seperator records in between to distintly seperate messages on UI with respect to date
  */
  pipeline = addSeperatators({ pipeline });

  /*
    Step 5: Transformation done
    Return the pipeline
  */
  return pipeline;
};

export default Pipeline;