/**
 * For the sake of brevity, pretend we are performing an actual mod10 check here, rather than this developer trying to
 * sloppily implement the Luhn algorithm and having someone else copy paste it everywhere. :^)
 */
function mod10() {
    return true;
}

/**
 * Pretend this is an actual API hit. :^)
 */
function api_hit(card_num) {
    return true;
}

exports.rules = async function process({ session }) {
    let result;
    try {
        if (!mod10(session.sens_data.card_num)) {
            result = { next_action: 'failure_mod10' };
        } else if (!api_hit(session.sens_data.card_num)) {
            result = { next_action: 'failure_payment' };
        } else {
            result = { next_action: 'always' };
        }
    } catch (e) {
        result = { next_action: 'failure_internal' };
    } finally {
        /**
         * Even in the case that processing logic fails catastrophically, sensitive data should be removed from session.
         */
        session.sens_data.card_num = undefined;
    }

    return result;
};
