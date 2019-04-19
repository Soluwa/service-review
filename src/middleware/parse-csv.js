import boom from 'boom';
import multiparty from 'multiparty';
import fs from 'fs';
import parse from 'csv-parse/lib/sync';

export default field => (req, res, next) => {
  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(boom.badData('Failed to get file from form'));
      return;
    }

    if (!files[field] || files[field].length < 1) {
      next(boom.badData('No file provided'));
      return;
    }

    if (files[field].length > 1) {
      next(boom.badData(`Only 1 upload at a time`));
      return;
    }

    try {
      const file = fs.readFileSync(files[field][0].path);
      req.csvData = parse(file.toString(), { columns: true });
      next();
    } catch (e) {
      next(boom.badData(`Failed to parse csv`));
    }
  });
};
