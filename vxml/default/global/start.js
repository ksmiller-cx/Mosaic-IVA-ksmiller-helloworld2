exports.rules = async function start_rules({ session, logger }) {
    const routine = `app:start_rules`;
    logger.debug({ routine, message: 'Setting intent configs.' });
    session.numAgentAttempts = 1;
    session.numRCPhoneNumAttempts = 1;

    try {
        // Use call flow based on some intent driven configuration.
        session.intent_config = require('../../intent_config.json');
    } catch {
        logger.error({ routine, message: `Could find the intent_config file` });

        session.intent_config = {};
        logger.debug({ routine, message: `session.intent_config was set to {}` });
    }

    return { next_action: 'always' };
};
