export const bulk = jest.fn();
export const create = jest.fn((db) => Promise.resolve({ name: db }));
export const fetch = jest.fn();
export const find = jest.fn();
export const getById = jest.fn();
export const get = jest.fn(() => Promise.resolve({ _id: '123', _rev: '456', data1: 'datum1' }));
export const insert = jest.fn(() => Promise.resolve({ id: '123', rev: '456', ok: true }));
export const list = jest.fn(() => Promise.resolve([]));
export const view = jest.fn();
export const use = jest.fn(() => ({
  bulk,
  fetch,
  find,
  get,
  insert,
  view,
  getById
}));

export const Cloudant = () => ({
  db: {
    create,
    list,    
    use
  }
});

export default Cloudant;
