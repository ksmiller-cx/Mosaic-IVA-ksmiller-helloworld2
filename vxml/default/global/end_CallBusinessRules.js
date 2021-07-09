exports.rules = async function end_CallBusinessRules({ session, logger }) {
    session.slastatus = "success";
    logger.debug({ routine: 'neuron:end_callbusinessrules rules', message: `session.slastatus: ${session.slastatus}` });

    return { next_action: 'always' };
};
