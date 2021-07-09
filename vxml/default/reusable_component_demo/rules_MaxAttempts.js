exports.rules = function max_rc_phone_num_attempts_reached({ session, logger }) {
    const routine = `app:max_rc_phone_num_attempts_reached`;
    logger.debug({ routine, message: `Number of attempts: ${session.numRCPhoneNumAttempts}` });

    if (session.numRCPhoneNumAttempts < 3) {
        session.numRCPhoneNumAttempts++;
        return { next_action: 'no' };
    } else {
        logger.debug({ routine, message: `Max attempts reached!` });
        session.numRCPhoneNumAttempts = 1;
        return { next_action: 'yes' };
    }
};
