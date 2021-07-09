exports.setup = async function basic_sip_blind_uui_transfer_setup({ session }) {
    const destination = '8772469586';  // session.transfer_dest
    return {
        dest: destination,
        sip_headers: {
            // 'User-to-User': session.uui,
            'User-to-User': 'test uui string',
            'P-Sig-Info': 'I like data',
            'X-Client-Specific-Header': 'DEADBEEF'
        }
    };
};

exports.result = async function basic_sip_blind_uui_transfer_result({ session, result }) {
    session.transfer_result = result;
    if (result === 'success') {
        return {
            next_action: 'success',
            contained: false
        };
    } else if (result === 'hangup') {
        return {
            next_action: 'hangup',
            contained: true
        };
    } else {
        return { next_action: 'error' };
    }
};
