const ntu = require('@mosaic-cx/neuron').test_utilities;
const {session,logger,cxl} = ntu.app_args;
const consoleLogger = console.log;
let consoleOutput = [];
const node = require('./end_CallBusinessRules.js');

beforeAll(() => {
    const mockedLog = output => consoleOutput.push(output)
    console.log = mockedLog;
});

afterAll(() => {
    console.log = consoleLogger;
});

test('check exitRecord', async () => {
    expect(await node.rules({session, logger,cxl})).toHaveProperty('next_action', 'always');
    expect(consoleOutput.join()).toMatch(/slastatus.{1,20}success/);
});