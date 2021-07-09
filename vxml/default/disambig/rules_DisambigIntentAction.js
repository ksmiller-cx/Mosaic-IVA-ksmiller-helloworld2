exports.rules = async function disambig_intent_action_rules({ session, logger }) {
    const routine = `app:disambig_intent_action_rules`;
    logger.debug({ routine, message: 'Setting disambig action' });

    // possibly set at another menu
    let action = session.main_intent;

    let intent_config = session.intent_config;
    let next_action = 'intent_actions';

    // Use call flow based on some intent driven configuration.
    if (intent_config && intent_config.data[action]) {
        const { auth_treatment } = intent_config.data[action];
        logger.debug({ routine, message: 'Found intent config.', action, intent_config: intent_config.data[action] });

        if (auth_treatment === 'required') {
            next_action = 'auth_required';
        } else if (auth_treatment === 'disambig') {
            next_action = action;
        }
    } else {
        // This may or not be an error based on the application design.
        logger.error({ routine, message: `Intent config did not contain data for the current action.`, action });
        next_action = 'error';
    }

    logger.debug({ routine, message: `next_action: ${next_action}` });
    return { next_action };
};
