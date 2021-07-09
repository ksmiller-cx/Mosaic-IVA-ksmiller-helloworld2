exports.rules = async function make_payment_rules({session: {ani, payment_amount}, logger}) {
    const routine = `app:make_payment_rules`;
    logger.debug({routine, message: `applying payment of ${payment_amount} to account for customer ${ani}`});

    // Insert payment API here.
    logger.debug({ routine, message: `next_action: success` });
    return { next_action: 'success' };
};
