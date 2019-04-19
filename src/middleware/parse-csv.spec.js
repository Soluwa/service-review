/* eslint-disable import/first */
import boom from 'boom';

jest.mock('multiparty');
jest.mock('fs');
jest.mock('csv-parse/lib/sync');
jest.mock('winston');

import parse from 'csv-parse/lib/sync';
import fs from 'fs';

import ParseCsv from './parse-csv';
import Multiparty from 'multiparty';

describe('check middleware', () => {
  describe('parse method', () => {
    let parseCsv;
    let next;
    beforeEach(() => {
      jest.clearAllMocks();
      next = jest.fn();
      parseCsv = ParseCsv('conversations');
    });

    test('it should fail with Form error', async () => {
      Multiparty.Form.mockImplementation(() => ({
        parse: (req, callback) => callback('Error', {}, {}),
      }));

      parseCsv({}, {}, next);

      expect(next).toHaveBeenCalledWith(
        boom.badData('Failed to get file from form')
      );
    });

    test('it should fail with no file provided', async () => {
      Multiparty.Form.mockImplementation(() => ({
        parse: (req, callback) => callback(null, {}, {}),
      }));

      parseCsv({}, {}, next);

      expect(next).toHaveBeenCalledWith(boom.badData('No file provided'));
    });

    test('it should fail with no file provided', async () => {
      Multiparty.Form.mockImplementation(() => ({
        parse: (req, callback) => callback(null, {}, { conversations: [] }),
      }));

      parseCsv({}, {}, next);

      expect(next).toHaveBeenCalledWith(boom.badData('No file provided'));
    });

    test('it should fail with too many files', async () => {
      Multiparty.Form.mockImplementation(() => ({
        parse: (req, callback) =>
          callback(null, {}, { conversations: [{}, {}] }),
      }));

      parseCsv({}, {}, next);

      expect(next).toHaveBeenCalledWith(
        boom.badData('Only 1 upload at a time')
      );
    });

    test('it should fail on csv parse', async () => {
      parse.mockImplementation(() => {
        throw new Error();
      });
      fs.readFileSync.mockImplementation(() => '');
      Multiparty.Form.mockImplementation(() => ({
        parse: (req, callback) =>
          callback(null, {}, { conversations: [{ path: 'xxx' }] }),
      }));

      parseCsv({}, {}, next);

      expect(next).toHaveBeenCalledWith(boom.badData('Failed to parse csv'));
    });

    test('it should populate the csvData', async () => {
      parse.mockImplementation(() => 'data');
      fs.readFileSync.mockImplementation(() => '');
      Multiparty.Form.mockImplementation(() => ({
        parse: (req, callback) =>
          callback(null, {}, { conversations: [{ path: 'xxx' }] }),
      }));
      const req = {};
      parseCsv(req, {}, next);

      expect(req.csvData).toEqual('data');
    });
  });
});
