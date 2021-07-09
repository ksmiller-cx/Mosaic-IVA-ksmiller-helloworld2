const { app_args } = require('@mosaic-cx/neuron').test_utilities;
const { logger, session } = app_args;
const node = require('./prompt_PaymentAmount.js');

test('fifty dollars', async () => {
    const user_input = { 'unit-currency': { amount: 50, currency: 'USD' } };
    expect(await node.result({ session, logger, user_input })).toHaveProperty('next_action');
});