exports.setup = async function basic_bridge_uui_transfer_setup({ session }) {
    const routing_prefix = '999000017';
    const destination = '8772469586';  // session.transfer_dest
    return {
        dest: `${routing_prefix}${destination}`,
        sip_headers: {
            // 'User-to-User': session.uui,
            'User-to-User': 'test uui bridge string',
            'P-Sig-Info': 'This is bridge transfer uui data',
            'X-Client-Specific-Header': 'DEADBEEF'
        }
    };
};

exports.result = async function basic_bridge_uui_transfer_result({ session, result, logger }) {
    const routine = `app:basic_bridge_uui_transfer_result`;
    logger.debug({ routine, message: `Transfer Result: ${result}` });
    session.transfer_result = result;
    if (result === 'success') {
        return {
            next_action: 'always',
            contained: false
        };
    } else if (result === 'hangup') {
        return {
            next_action: 'hangup',
            contained: true
        };
    } else {
        return {
            next_action: 'error'
        };
    }
};
