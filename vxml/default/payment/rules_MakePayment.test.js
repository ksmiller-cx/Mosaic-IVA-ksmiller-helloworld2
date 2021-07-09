const ntu = require('@mosaic-cx/neuron').test_utilities;
const {logger} = ntu;
const node = require('./rules_MakePayment.js');

test('good payment info', async () => {
    const session = ntu.new_session();
    session.payment_amount = 50;
    expect(await node.rules({session, logger})).toHaveProperty('next_action', 'success');
});