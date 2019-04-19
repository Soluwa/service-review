import app from './app';

jest.mock('yamljs');

describe('when creating an app', () => {
  it('it returns an app object', () => {
    expect(app).toBeDefined();
  });
});
