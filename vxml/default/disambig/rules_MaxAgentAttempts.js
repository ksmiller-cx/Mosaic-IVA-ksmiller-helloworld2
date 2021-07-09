exports.rules = function max_agent_attempts_rules({ session, logger }) {
    const routine = `app:max_agent_attempts_rules`;
    logger.debug({ routine, message: `Number of agent attempts: ${session.numAgentAttempts}` });

    if (session.numAgentAttempts < 2) {
        session.numAgentAttempts++;
        return { next_action: 'no' };
    } else {
        logger.debug({ routine, message: 'Max attempts reached!' });
        return { next_action: 'yes' };
    }
};
