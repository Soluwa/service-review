import { map, findIndex, omit, xor, uniq, compact } from 'lodash';
import boom from 'boom';
import moment from 'moment';

import { context } from '../../../connectors';
import { reviewStore } from '../../../stores';

const getStatus = async batch => {
  // get the review status information from db
  const reviews = await reviewStore.search({
    convId: {
      $or: map(batch.conversations, conversation => conversation.convId),
    },
  });

  // merge status into batch
  return {
    ...batch,
    ...{
      conversations: map(batch.conversations, conversation => ({
        ...conversation,
        ...{
          reviewStatus:
            findIndex(reviews, o => o.convId === conversation.convId) !== -1,
        },
      })),
    },
  };
};

export const getById = async batchId => {
  try {
    const result = await reviewStore.getById(batchId);
    return getStatus(result);
  } catch (err) {
    throw boom.internal('Failed to get a batch.', err);
  }
};

export const createBatch = async conversationIds => {
  // make sure we only have uniq records. ignore the others
  const distinctConversationIds = compact(uniq(conversationIds));
  // find the record in the context stores
  const conversations = map(
    await context.getConversations(distinctConversationIds),
    o => omit(o, ['configId', 'brand', 'channel', 'latestTurn', 'numTurns'])
  );

  // check to see if there are any missing
  const missing = xor(
    map(conversations, o => o.convId),
    distinctConversationIds
  );

  if (missing.length === distinctConversationIds.length) {
    throw boom.badData('Could not find any valid records');
  }

  // create the new batch
  const batch = await reviewStore.add({
    conversations,
    createdDate: moment.utc(new Date()).format(),
    type: 'batch',
  });

  return { batch: await getStatus(batch), missing };
};
