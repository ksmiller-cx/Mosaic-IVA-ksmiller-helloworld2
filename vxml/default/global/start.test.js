const ntu = require('@mosaic-cx/neuron').test_utilities;
const { logger, cxl, session } = ntu.app_args;
const start = require('./start.js');

test('start', async () => {
   expect(await start.rules({ session, logger })).toHaveProperty('next_action');
});

