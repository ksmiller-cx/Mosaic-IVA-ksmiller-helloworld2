const queryByPhone = require('../../../apis/api_QueryByPhone');

exports.rules = function account_status_rules({ session, logger }) {
    const routine = `app:account_status_rules`;
    logger.debug({ routine, message: `Setting account status rules.` });

    let next_action = 'not_found';

    // if phone_num not set, likely done so in the rc
    if (!session.phone_num) {
        logger.debug({ routine, message: `The phone number is not set: ${session.phone_num}` });
        return { next_action };
    }

    // send api request
    const response = queryByPhone(logger, session.phone_num);
    logger.debug({ routine, message: `Query by phone response: ${JSON.stringify(response)}` });
    if (response.recordCount === 1) {
        session.street_num_arr = response.data[0].StreetNumber;
        next_action = 'found';
    } else if (response.recordCount > 1) {
        // Create a Set from the response StreetNumbers to remove duplicates then convert to an array
        session.street_num_arr = response.data.map(x => x.StreetNumber);
        next_action = 'multiple';
    }

    logger.debug({ routine, message: `The street_num_arr was set: ${JSON.stringify(session.street_num_arr)}` });
    return { next_action };
};
