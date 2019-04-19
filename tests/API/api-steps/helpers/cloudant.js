// eslint-disable-next-line
const request = require('request-promise-native');
const _ = require('lodash');

const { STORE_CLOUDANT_URL: cloudAntUrl, PROXY_URL: httpProxy } = process.env;

const getCloudantRecord = async (convId, dbName) => {
  let response;
  try {
    response = await request.get({
      url: `${cloudAntUrl}${dbName}/${convId}`,
      simple: false,
      resolveWithFullResponse: true,
      json: true,
      proxy: httpProxy,
    });
    return response.body;
  } catch (e) {
    throw Error(`Request error: ${e}`);
  }
};

const getCloudAntRecordByConvId = async (convId, dbName) => {
  let response;
  const query = {
    selector: {
      convId: {
        $regex: `${convId}`,
      },
    },
  };
  try {
    response = await request.post({
      url: `${cloudAntUrl}${dbName}/_find`,
      simple: false,
      resolveWithFullResponse: true,
      body: query,
      json: true,
      proxy: httpProxy,
    });
    const result = _.get(response, 'body.docs');
    return result;
  } catch (e) {
    throw Error(`Request error: ${e}`);
  }
};

async function getAllCloudantRecords(convId, dbName, id) {
  let response;
  const query = {
    selector: {
      $or: [
        {
          convId: {
            $regex: `${convId}`,
          },
        },
        {
          _id: {
            $regex: `${convId}`,
          },
        },
      ],
    },
    fields: ['_id', '_rev'],
  };

  if (id !== '') {
    query.selector.$or.push({
      _id: {
        $regex: `${id}`,
      },
    });
  }

  try {
    response = await request.post({
      url: `${cloudAntUrl}${dbName}/_find`,
      simple: false,
      resolveWithFullResponse: true,
      body: query,
      json: true,
      proxy: httpProxy,
    });
    const result = _.get(response, 'body.docs');
    this.response = response;
    this.response.body = response.body;
    this.response.status = response.statusCode;
    return result;
  } catch (e) {
    throw Error(`Request error: ${e}`);
  }
}

const deleteCloudantRecord = async (convId, dbName) => {
  const record = await getCloudantRecord(convId, dbName);
  let response;
  try {
    response = await request.delete({
      url: `${cloudAntUrl}${dbName}/${record._id}?rev=${record._rev}`,
      simple: false,
      resolveWithFullResponse: true,
      json: true,
      proxy: httpProxy,
    });
  } catch (e) {
    throw Error(`Request error: ${e}`);
  }
  this.response = response;
  this.response.body = response.body;
  this.response.status = response.statusCode;
};

const deleteMultipleDocuments = async (convId, dbName, id) => {
  const result = await getAllCloudantRecords(convId, dbName, id);
  const delResult = result.map(res => ({ ...res, _deleted: true }));
  try {
    await request.post({
      url: `${cloudAntUrl}${dbName}/_bulk_docs`,
      simple: false,
      resolveWithFullResponse: true,
      body: { docs: delResult },
      json: true,
      proxy: httpProxy,
    });
    return result;
  } catch (e) {
    throw Error(`Request error: ${e}`);
  }
};

module.exports = {
  getCloudantRecord,
  deleteCloudantRecord,
  getAllCloudantRecords,
  deleteMultipleDocuments,
  getCloudAntRecordByConvId,
};
