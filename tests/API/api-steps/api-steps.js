// eslint-disable-next-line
const request = require('request-promise-native');
const fs = require('fs');
const { expect } = require('chai');
// eslint-disable-next-line
const get = require('lodash.get');

/* eslint-disable prefer-destructuring */
// eslint-disable-next-line
const { Given, When, Then, setDefaultTimeout } = require('cucumber');
setDefaultTimeout(-1);

// Set local variables
const utils = require('./helpers/cloudant');

let id = '';
let JWT;

Given(
  'I try to post {string} csv',
  { timeout: 60 * 1000 },
  async function httpRequest(csvName) {
    const formData = {
      conversations: fs.createReadStream(
        `./tests/API/api-steps/helpers/CSV/${csvName}.csv`
      ),
    };

    let response;
    try {
      response = await request({
        method: 'POST',
        url: `${process.env.SERVICE_URL}batch`,
        simple: false,
        formData,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-caf-api-key': process.env.API_KEY,
          'x-caf-api-secret': process.env.API_SECRET,
          'x-caf-cbaas-version': process.env.CBAAS_VERSION,
        },
      });
    } catch (e) {
      throw Error(`Request error: ${e}`);
    }
    this.response = response;
    this.response.body = response.body;
    this.response.status = response.statusCode;
  }
);

Given(
  'I try to post multiple csv',
  { timeout: 60 * 1000 },
  async function httpRequest() {
    const formData = {
      conversations: [
        fs.createReadStream(`./tests/API/api-steps/helpers/CSV/0lines.csv`),
        fs.createReadStream(`./tests/API/api-steps/helpers/CSV/0lines.csv`),
      ],
    };

    let response;
    try {
      response = await request({
        method: 'POST',
        url: `${process.env.SERVICE_URL}batch`,
        simple: false,
        formData,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-caf-api-key': process.env.API_KEY,
          'x-caf-api-secret': process.env.API_SECRET,
          'x-caf-cbaas-version': process.env.CBAAS_VERSION,
        },
      });
    } catch (e) {
      throw Error(`Request error: ${e}`);
    }
    this.response = response;
    this.response.body = response.body;
    this.response.status = response.statusCode;
  }
);

Given(
  'I try to post no csv',
  { timeout: 60 * 1000 },
  async function httpRequest() {
    const formData = {
      conversations: '',
    };
    let response;
    try {
      response = await request({
        method: 'POST',
        url: `${process.env.SERVICE_URL}batch`,
        simple: false,
        formData,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-caf-api-key': process.env.API_KEY,
          'x-caf-api-secret': process.env.API_SECRET,
          'x-caf-cbaas-version': process.env.CBAAS_VERSION,
        },
      });
    } catch (e) {
      throw Error(`Request error: ${e}`);
    }
    this.response = response;
    this.response.body = response.body;
    this.response.status = response.statusCode;
  }
);

Given(
  'I create {int} record(s) with convId {string} via context service',
  { timeout: 60 * 1000 },
  // eslint-disable-next-line
  async function httpRequest(numOfRecords, convId) {
    const requests = [];
    try {
      for (let i = 1; i <= numOfRecords; i += 1) {
        const body = JSON.parse(
          fs.readFileSync(
            './tests/API/api-steps/helpers/JSON/context_request.json'
          )
        );
        body.convId = `${convId}-${i}`;
        if (numOfRecords === 1) {
          body.convId = `${convId}`;
        }
        requests.push(
          request({
            method: 'POST',
            url: `${process.env.CONTEXT_SERVICE_URL}conversation`,
            simple: false,
            body,
            resolveWithFullResponse: true,
            json: true,
            headers: {
              'Content-Type': 'application/json',
              'x-caf-api-key': process.env.API_KEY,
              'x-caf-api-secret': process.env.API_SECRET,
              'x-caf-cbaas-version': process.env.CBAAS_VERSION,
            },
          })
        );
      }
      await Promise.all(requests);
    } catch (e) {
      throw Error(`Request error: ${e}`);
    }
  }
);

Then(
  'the response conversations array contains {int} record(s)',
  function checkResponseProperty(number) {
    expect(this.response.body.batch.conversations.length).to.equal(number);
  }
);

Then(
  'I review the convId {string} with intentUnderstood {int}, topicUnderstood {int}, conversationUnderstandable {int}, multipleIntents {string}, followUpQuestion {string}, outOfScope {string}, expectedPerformance {int}, areaForImprovement {string}, otherReason {string}, conversationRating {string}, tags {string}',
  { timeout: 60 * 1000 },
  async function httpRequest(
    convId,
    intentUnderstood,
    topicUnderstood,
    conversationUnderstandable,
    multipleIntents,
    followUpQuestion,
    outOfScope,
    expectedPerformance,
    areaForImprovement,
    otherReason,
    conversationRating,
    tags
  ) {
    const tagString = tags.split(',');
    const areaForImprovementString = areaForImprovement.split(',');
    const body = {
      intentUnderstood: `${intentUnderstood}`,
      topicUnderstood: `${topicUnderstood}`,
      conversationUnderstandable: `${conversationUnderstandable}`,
      multipleIntents: JSON.parse(multipleIntents),
      followUpQuestion: JSON.parse(followUpQuestion),
      outOfScope: JSON.parse(outOfScope),
      expectedPerformance: `${expectedPerformance}`,
      areaForImprovement: areaForImprovementString,
      otherReason: `${otherReason}`,
      conversationRating: `${conversationRating}`,
      tags: tagString,
      convId: `${convId}`,
    };
    let response;
    try {
      response = await request({
        method: 'POST',
        url: `${process.env.SERVICE_URL}review`,
        simple: false,
        body,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          'Content-Type': 'application/json',
          'x-caf-api-key': process.env.API_KEY,
          'x-caf-api-secret': process.env.API_SECRET,
          'x-caf-cbaas-version': process.env.CBAAS_VERSION,
          Authorization: `Bearer ${JWT}`,
        },
      });
    } catch (e) {
      throw Error(`Request error: ${e}`);
    }
    this.response = response;
    this.response.body = response.body;
    this.response.status = response.statusCode;
  }
);

Given(
  'I update the convId {string} with intentUnderstood {int}, topicUnderstood {int}, conversationUnderstandable {int}, multipleIntents {string}, followUpQuestion {string}, outOfScope {string}, expectedPerformance {int}, areaForImprovement {string}, otherReason {string}, conversationRating {string}, tags {string}',
  { timeout: 60 * 1000 },
  async function httpRequest(
    convId,
    intentUnderstood,
    topicUnderstood,
    conversationUnderstandable,
    multipleIntents,
    followUpQuestion,
    outOfScope,
    expectedPerformance,
    areaForImprovement,
    otherReason,
    conversationRating,
    tags
  ) {
    const tagString = tags.split(',');
    const areaForImprovementString = areaForImprovement.split(',');
    id = this.response.body[0]._id;
    const body = {
      id: `${id}`,
      intentUnderstood: `${intentUnderstood}`,
      topicUnderstood: `${topicUnderstood}`,
      conversationUnderstandable: `${conversationUnderstandable}`,
      multipleIntents: JSON.parse(multipleIntents),
      followUpQuestion: JSON.parse(followUpQuestion),
      outOfScope: JSON.parse(outOfScope),
      expectedPerformance: `${expectedPerformance}`,
      areaForImprovement: areaForImprovementString,
      otherReason: `${otherReason}`,
      conversationRating: `${conversationRating}`,
      tags: tagString,
      convId: `${convId}`,
    };
    let response;
    try {
      response = await request({
        method: 'POST',
        url: `${process.env.SERVICE_URL}review`,
        simple: false,
        body,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          'Content-Type': 'application/json',
          'x-caf-api-key': process.env.API_KEY,
          'x-caf-api-secret': process.env.API_SECRET,
          'x-caf-cbaas-version': process.env.CBAAS_VERSION,
          Authorization: `Bearer ${JWT}`,
        },
      });
    } catch (e) {
      throw Error(`Request error: ${e}`);
    }
    this.response = response;
    this.response.body = response.body;
    this.response.status = response.statusCode;
  }
);

Given(
  'I update the convId {string} with intentUnderstood {int}, topicUnderstood {int}, conversationUnderstandable {int}, multipleIntents {}, followUpQuestion {}, outOfScope {}, expectedPerformance {int}, areaForImprovement {string}, otherReason {string}, conversationRating {string}, tags {string}',
  { timeout: 60 * 1000 },
  async function httpRequest(
    convId,
    intentUnderstood,
    topicUnderstood,
    conversationUnderstandable,
    multipleIntents,
    followUpQuestion,
    outOfScope,
    expectedPerformance,
    areaForImprovement,
    otherReason,
    conversationRating,
    tags
  ) {
    const tagString = tags.split(',');
    id = this.response.body[0]._id;
    const body = {
      id: `${id}`,
      intentUnderstood: `${intentUnderstood}`,
      topicUnderstood: `${topicUnderstood}`,
      conversationUnderstandable: `${conversationUnderstandable}`,
      multipleIntents: `${multipleIntents}`,
      followUpQuestion: `${followUpQuestion}`,
      outOfScope: `${outOfScope}`,
      expectedPerformance: `${expectedPerformance}`,
      areaForImprovement: [`${areaForImprovement}`],
      otherReason: `${otherReason}`,
      conversationRating: `${conversationRating}`,
      tags: tagString,
      convId: `${convId}`,
    };
    let response;
    try {
      response = await request({
        method: 'POST',
        url: `${process.env.SERVICE_URL}review`,
        simple: false,
        body,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          'Content-Type': 'application/json',
          'x-caf-api-key': process.env.API_KEY,
          'x-caf-api-secret': process.env.API_SECRET,
          'x-caf-cbaas-version': process.env.CBAAS_VERSION,
          Authorization: `Bearer ${JWT}`,
        },
      });
    } catch (e) {
      throw Error(`Request error: ${e}`);
    }
    this.response = response;
    this.response.body = response.body;
    this.response.status = response.statusCode;
  }
);

Given(
  'I delete document(s) with convId {string} from {string} db',
  { timeout: 60 * 1000 },
  async (convId, dbName) => {
    await utils.deleteMultipleDocuments(convId, dbName, id);
  }
);

Given(
  'I view document with convId {string} from {string} db',
  { timeout: 60 * 1000 },
  async (convId, dbName) => {
    await utils.getCloudantRecord(convId, dbName);
  }
);

Given(
  'I view review data for convId {string} from {string} db',
  { timeout: 60 * 1000 },
  async function viewReviewData(convId, dbName) {
    const result = await utils.getCloudAntRecordByConvId(convId, dbName);
    this.response.body = result;
  }
);

Given(
  'I try to search for convId {string}',
  { timeout: 60 * 1000 },
  async function httpRequest(convId) {
    let response;
    try {
      response = await request({
        method: 'POST',
        url: `${process.env.SERVICE_URL}batch/${convId}`,
        simple: false,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-caf-api-key': process.env.API_KEY,
          'x-caf-api-secret': process.env.API_SECRET,
          'x-caf-cbaas-version': process.env.CBAAS_VERSION,
        },
      });
    } catch (e) {
      throw Error(`Request error: ${e}`);
    }
    this.response = response;
    this.response.body = response.body;
    this.response.status = response.statusCode;
  }
);

Then(
  'I search for all documents with convId {string} in {string} db',
  { timeout: 60 * 1000 },
  async (convId, dbName) => {
    await utils.getAllCloudantRecords(convId, dbName);
  }
);

Then('the id has been updated', function checkResponseProperty() {
  expect(this.response.body.id).to.include(id, 'value not found');
});

Then(
  'the response property {string} array includes {string}',
  function isIncluded(path, value) {
    expect(get(this.response.body, path)).to.include.members(value.split(','));
  }
);

When(
  'I try to authenticate with {word} credentials',
  { timeout: 60 * 1000 },
  async function httpRequest(word) {
    let authKey;
    switch (word) {
      case 'valid':
        authKey = 'Basic ODc3ODQ2OTpUZXN0MTIzNCE=';
        break;
      case 'invalid':
        authKey = 'Basic ODc3ODpUZXN0MTIzNCE=';
        break;
      default:
    }
    let response;
    try {
      response = await request({
        method: 'POST',
        url: `${process.env.AUTH_SERVICE_URL}auth/basic`,
        simple: false,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: authKey,
        },
      });
    } catch (e) {
      throw Error(`Request error: ${e}`);
    }
    this.response = response;
    this.response.body = response.body;
    this.response.status = response.statusCode;
    JWT = response.body.access_token;
  }
);
