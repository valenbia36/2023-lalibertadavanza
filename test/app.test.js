const sinon = require('sinon');
const dbConnect = require('../config/mongo');
const mongoose = require('mongoose');

test('The connection to the database should fail', async () => {
  const connectStub = sinon.stub(mongoose, 'connect').throws(new Error('Connection error'));

  const consoleErrorSpy = sinon.spy(console, 'error');

  await dbConnect();

  expect(connectStub.calledOnce).toBe(true);
})