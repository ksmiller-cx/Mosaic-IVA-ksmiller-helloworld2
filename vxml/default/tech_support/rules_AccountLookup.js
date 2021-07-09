const testAPI = require('../../../apis/test_api');

exports.rules = async function account_lookup_rules({ logger, cxl }) {
    const routine = 'app:account_lookup_rules';
    let response;

    const start_time = new Date().toISOString();
    try {
        response = await testAPI(logger, '500');
    } catch (e) {
        logger.debug({ routine, message: 'Received an error from testAPI', e });
    }

    const end_time = new Date().toISOString();

    const dataRequestAttributes = {
        module: 'default',
        component: 'tech_support',
        start_time,
        stop_time: end_time,
        curr_node: 'account_lookup',
        request_type: 'Host',
        status: 'success',
        host_key: '',
        data_sent: '500',
        data_recv: response,
    };

    await cxl.data_request(dataRequestAttributes);

    logger.debug({ routine, message: 'response', response });
    return { next_action: 'always' };
};
