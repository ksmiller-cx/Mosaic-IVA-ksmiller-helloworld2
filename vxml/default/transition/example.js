exports.setup = async function example_setup({ logger: { debug } }) {
    debug('Transitioning to example-subdomain-that-probably-does-not-exist.intrado.com.');
    return { dest: 'http://example-subdomain-that-probably-does-not-exist.intrado.com' };
};
