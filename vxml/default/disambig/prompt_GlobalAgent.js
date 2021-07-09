exports.result = async function prompt_GlobalAgent_result({ session, logger, action, user_input }) {
    const routine = `app:prompt_GlobalAgent_result`;
    logger.debug({ routine, message: 'Setting deferred intent rules.', action, user_input });

    session.main_intent = action;
    session.main_params = user_input;

    let intent_config = session.intent_config;
    let next_action = 'intent_actions';

    // Use call flow based on some intent driven configuration.
    if (intent_config && intent_config.data[action]) {
        const { auth_treatment } = intent_config.data[action];
        logger.debug({ routine, message: 'Found intent config.', action, intent_config: intent_config.data[action] });

        // Add whatever config based rules to drive call flow here.
        if (auth_treatment === 'required') {
            next_action = 'auth_required';
        } else if (auth_treatment === 'disambig') {
            // ambiguous action ==> need more specific intent
            next_action = 'disambig';
        }
    } else {
        // This may or not be an error based on the application design.
        logger.error({ routine, message: `Intent config did not contain data for the current action.`, action });
        next_action = 'error';
    }

    logger.debug({ routine, message: `next_action: ${next_action}` });
    return { next_action };
};
