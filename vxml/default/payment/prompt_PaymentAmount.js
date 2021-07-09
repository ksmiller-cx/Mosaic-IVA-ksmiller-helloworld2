exports.result = async function payment_amount_result({ session, user_input, logger }) {
    const routine = `app:payment_amount_result`;

    logger.debug({ routine, message: `Entered payment_amount_result: ${JSON.stringify(user_input)}` });
    session.payment_amount = user_input['unit-currency'].amount;

    logger.debug({
        routine,
        message: `session.payment_amount set to : ${session.payment_amount}`,
        next_action: 'payment_amount'
    });
    return { next_action: 'payment_amount' };
};
