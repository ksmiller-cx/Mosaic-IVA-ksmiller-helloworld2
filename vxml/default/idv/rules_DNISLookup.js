exports.rules = async function dnis_lookup_rules({
    session: { dnis }, session, logger, cxl,
}) {
    const routine = 'app:dnis_lookup_rules';

    let next_action = 'greeting';
    session.client_id = 'Intrado';

    const customerAttributes = {
        node: 'DNIS Lookup',
        company: 'Intrado',
        department: 'Mosaic',
        framework: 'Nerve',
    };

    await cxl.customer_attributes(customerAttributes);

    if (dnis === '3633486') {
        next_action = 'transfer_answer';
    }

    logger.debug({ routine, message: `next_action: ${next_action}` });
    return { next_action };
};
