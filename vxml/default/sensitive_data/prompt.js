exports.result = async function prompt({ session, user_input: { CardNum } }) {
    /**
     * Ideally, all sensitive data processing for a prompt would exist in the result function itself, allowing the
     * garbage collector to act as immediately as possible on the in-memory data. In practice, the data may be needed
     * downstream, e.g. in a series of client-provided API calls. This contrived example assumes we simply want to store
     * a fictional credit card number for future processing.
     */
    session.sens_data = session.sens_data || {};
    session.sens_data.card_num = CardNum;
    return { next_action: 'always' };
}