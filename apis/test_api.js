const axios = require('axios');
const { DOMParser } = require('xmldom');
const { select } = require('xpath');

/**
 * An example of doing an API hit via Apigee.
 * @param {*} logger Nerve logger object.
 * @param {*} number The number convert to words.
 */
module.exports = async function example_api(logger, number) {
    const { data } = await axios.post(
        'https://cx-nonprod-dev.apigee.net/feature-demo-example',
        `
            <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">
                        <ubiNum>${number}</ubiNum>
                    </NumberToWords>
                </soap:Body>
            </soap:Envelope>
        `,
        { headers: { 'Content-Type': 'text/xml' } }
    );
    const dom_parser = new DOMParser();
    const doc = dom_parser.parseFromString(data);

    return select('//*[local-name(.)="ubiNum"]', doc)[0]
        .firstChild
        .nodeValue;
};
