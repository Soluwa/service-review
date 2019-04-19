import Cloudant from '@cloudant/cloudant';
import https from 'https';
import { omit, map } from 'lodash';

const {
  DB_URL: dbUrl,
  REVIEW_DB_COLLECTION: database,
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

const sanotiseItem = item =>
  omit(
    {
      id: item._id,
      ...item,
    },
    ['_id', '_rev', 'statusCode']
  );

export const getById = async id => sanotiseItem(await db.get(id));

export const add = async item => {
  const res = await db.insert(item);
  if (!res.ok) throw new Error(`Adding failed`);
  return { id: res.id, ...item };
};

export const update = async item => {
  const review = await db.get(item.id);
  const updt = { ...review, ...omit(item, ['id']) };
  const res = await db.insert(updt);
  if (!res.ok) throw new Error(`Updating failed`);
  return { id: res.id, ...item };
};

export const search = async options => {
  const query = {
    selector: options,
  };
  const res = await db.find(query);
  return map(res.docs, doc => sanotiseItem(doc));
};

export const tableauByConvId = async convIds => {
  const res = await db.view('reviews', 'tableauByConvId', {
    keys: convIds,
  });
  return res.rows;
};
