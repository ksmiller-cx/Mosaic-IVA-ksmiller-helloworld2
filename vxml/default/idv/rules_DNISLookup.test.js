const ntu = require('@mosaic-cx/neuron').test_utilities;
const node = require('./rules_DNISLookup.js');
let { session, logger, cxl } = ntu.app_args;

test('normal user path', async () => {
    session.dnis = '3633486';
    expect(await node.rules({ session, logger, cxl })).toHaveProperty('next_action', 'greeting');
});

test('transfer answer', async () => {
    session.dnis = '3633485';
    expect(await node.rules({ session, logger, cxl })).toHaveProperty('next_action', 'transfer_answer');
});
