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

const Pipeline = (params) => {
  const { locale, messages, sessionUserId, handleRetryClick, handleDeletionClick, handleModerationClick } = params;

  let pipeline = createPipeline({ locale, messages, handleRetryClick, handleDeletionClick, handleModerationClick });
  pipeline = transformForReceive({ pipeline, sessionUserId });
  pipeline = transformForSent({ pipeline, sessionUserId });
  pipeline = addSeperatators({ pipeline });

  return pipeline;
};

export default Pipeline;