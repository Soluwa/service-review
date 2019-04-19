import Cloudant from '@cloudant/cloudant';
import https from 'https';

const {
  DB_URL: dbUrl,
  CONVERSATION_DB_COLLECTION: database,
  DB_USER: dbUser,
  DB_PASSWORD: dbPassword,
} = process.env;

let url = '';
if (dbUrl && dbUser && dbPassword)
  url = dbUrl.replace('://', `://${dbUser}:${dbPassword}@`);

const agent = new https.Agent({
  secureProtocol: 'TLSv1_2_method',
  keepAlive: true,
});

let db;
if (url.startsWith('https:'))
  db = Cloudant({
    url,
    plugins: 'promises',
    requestDefaults: { agent },
  }).db.use(database);
else
  db = Cloudant({
    url,
    plugins: 'promises',
  }).db.use(database);

export const getTableauByDate = async (startkey, endKey, limit, skip) => {
  const res = await db.view('reports', 'tableauByDate', {
    start_key: `"${startkey}"`,
    end_key: `"${endKey}"`,
    limit,
    skip,
  });
  return res.rows;
};

export const getTableauByConvId = async key => {
  const res = await db.view('reports', 'tableauByConvId', {
    key,
  });
  return res.rows;
};

export const getGroupedEvents = async (
  startkey,
  endKey,
  limit,
  skip,
  groupLevel
) => {
  const res = await db.view('reports', 'events', {
    start_key: `${startkey}`,
    end_key: `${endKey}`,
    group_level: groupLevel,
    skip,
    limit,
  });
  return res.rows;
};

export const getGroupedIntents = async (
  startkey,
  endKey,
  limit,
  skip,
  groupLevel
) => {
  const res = await db.view('reports', 'intents', {
    start_key: `${startkey}`,
    end_key: `${endKey}`,
    group_level: groupLevel,
    skip,
    limit,
  });
  return res.rows;
};
