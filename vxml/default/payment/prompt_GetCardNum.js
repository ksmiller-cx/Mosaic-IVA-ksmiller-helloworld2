exports.result = function prompt_GetCardNum_result({ session, user_input, logger }) {
    const routine = `app:prompt_GetCardNum_result`;
    session.card_num = user_input['number_16digits_2'];

    logger.debug({ routine, message: `Caller entered cardNum: ${user_input}`, next_action: 'card_num' });
    return { next_action: 'card_num' };
};
