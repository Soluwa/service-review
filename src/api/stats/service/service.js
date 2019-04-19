import boom from 'boom';
import { difference } from 'lodash';

import { contextStore } from '../../../stores';
import tableauSchema from './tableauSchema.json';

const setSchemaField = (def, conversation) => {
  let endPoint = process.env.DEFAULT_ENDPOINT;
  tableauSchema[def].forEach(scheme => {
    if (
      difference(scheme.fields, Object.keys(conversation.value)).length === 0
    ) {
      endPoint = scheme.response;
    }
  });

  return endPoint;
};

export const tableauByConvId = async (key, def) => {
  try {
    const conversations = await contextStore.getTableauByConvId(key);

    if (conversations.length !== 1) {
      throw new Error('Failed to find conversation');
    }
    conversations[0].value.endpoint = setSchemaField(def, conversations[0]);

    return conversations[0].value;
  } catch (err) {
    throw boom.internal('Failed to get stats.', err);
  }
};

export const tableauByDate = async (start, end, limit, skip, def) => {
  try {
    const conversations = await contextStore.getTableauByDate(
      start,
      end,
      limit,
      skip
    );

    for (let i = 0; i < conversations.length; i += 1) {
      conversations[i].value.endpoint = setSchemaField(def, conversations[i]);
    }

    return conversations;
  } catch (err) {
    throw boom.internal('Failed to get stats.', err);
  }
};

export const groupedEvents = async (start, end, limit, skip, def) => {
  try {
    const grouped = await contextStore.getGroupedEvents(
      start,
      end,
      limit,
      skip,
      3
    );

    for (let i = 0; i < grouped.length; i += 1) {
      grouped[i].endpoint = setSchemaField(def, { value: grouped[i].key[2] });
    }

    return grouped;
  } catch (err) {
    throw boom.internal('Failed to get stats.', err);
  }
};

export const groupedIntents = async (start, end, limit, skip) => {
  try {
    return contextStore.getGroupedIntents(start, end, limit, skip, 3);
  } catch (err) {
    throw boom.internal('Failed to get stats.', err);
  }
};
