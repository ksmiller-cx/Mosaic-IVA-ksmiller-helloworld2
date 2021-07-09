exports.rules = async function top_level_intent_action_rules({ session, logger }) {
    const routine = 'app:top_level_intent_action_rules';
    logger.debug({
        routine,
        message: `Setting intent_actions from the main intent: ${session.main_intent}`,
        params: session.main_params,
    });

    // set at another menu
    const next_action = session.main_intent;

    logger.debug({ routine, message: `next_action: ${next_action}` });
    return { next_action };
};
