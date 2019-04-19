import boom from 'boom';

import { reviewStore } from '../../../stores';

const addBaseReviewInformation = (review, user) => ({
  ...review,
  ...{ reviewedBy: user, reviewedDate: new Date().toISOString() },
});

export const tableauByConvId = async convIds => {
  try {
    return reviewStore.tableauByConvId(convIds);
  } catch (err) {
    throw boom.internal('Failed to get a review.', err);
  }
};

export const search = async options => {
  try {
    return reviewStore.search(options);
  } catch (err) {
    throw boom.internal('Failed to get a review.', err);
  }
};

export const getById = async id => {
  try {
    return reviewStore.getById(id);
  } catch (err) {
    throw boom.internal('Failed to get a review.', err);
  }
};

export const add = async (review, user) => {
  try {
    let toSave = { ...review, ...{ type: 'review' } };
    toSave = addBaseReviewInformation(toSave, user);
    return reviewStore.add(toSave);
  } catch (err) {
    throw boom.badImplementation('Failed to create review');
  }
};

export const update = async (review, user) => {
  try {
    const toSave = addBaseReviewInformation(review, user);
    return reviewStore.update(toSave);
  } catch (err) {
    throw boom.badImplementation('Failed to update review');
  }
};
