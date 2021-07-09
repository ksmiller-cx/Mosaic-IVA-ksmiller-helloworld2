const ntu = require('@mosaic-cx/neuron').test_utilities;
const node = require('./rules_AccountLookup.js');
let { session, logger, cxl } = ntu.app_args;

test('account_lookup', async () => {
    session.dnis = '3633485';
    expect(await node.rules({ logger, cxl })).toHaveProperty('next_action', 'always');
});