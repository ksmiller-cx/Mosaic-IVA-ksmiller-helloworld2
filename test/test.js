
const { readFileSync } = require('fs');
const supertest = require('supertest');
const { DOMParser } = require('xmldom');
const { select } = require('xpath');
const Koa = require('koa');

/*
 Note that these tests are the absolute bare minimum sanity checks in the form of integration tests,
 e.g. is this valid XML that contains a form tag, which contains one or more prompt tags, in the case
 of say nodes. It is not a replacement for true end-to-end testing and a pass does not guarantee
 things are working correctly, just not altogether broken.
 */

let app;
let server;

const conversation_id = 'example';
const dom_parser = new DOMParser();

const validate_error = (text) => {
    const doc = dom_parser.parseFromString(text);
    const forms = select('//*[local-name(.)="form"]', doc);
    expect(forms.length).toBeGreaterThan(0);

    const disconnects = select('//*[local-name(.)="exit"]', forms[0]);
    expect(disconnects.length).toBeGreaterThan(0);
};

const validate_end = (text) => {
    const doc = dom_parser.parseFromString(text);
    const forms = select('//*[local-name(.)="form"]', doc);
    expect(forms.length).toBeGreaterThan(0);

    const exits = select('//*[local-name(.)="exit"]', forms[0]);
    expect(exits.length).toBeGreaterThan(0);
};

const validate_prompt = (text) => {
    const doc = dom_parser.parseFromString(text);
    const forms = select('//*[local-name(.)="form"]', doc);
    expect(forms.length).toBeGreaterThan(0);

    const prompts = select('//*[local-name(.)="prompt"]', forms[0]);
    expect(prompts.length).toBeGreaterThan(0);

    const grammars = select('//*[local-name(.)="grammar"]', forms[0]);
    expect(grammars.length).toBeGreaterThan(0);
};

const validate_say = (text) => {
    const doc = dom_parser.parseFromString(text);
    const forms = select('//*[local-name(.)="form"]', doc);
    expect(forms.length).toBeGreaterThan(0);

    const prompts = select('//*[local-name(.)="prompt"]', forms[0]);
    expect(prompts.length).toBeGreaterThan(0);
};

const validate_transfer = (text) => {
    const doc = dom_parser.parseFromString(text);
    const forms = select('//*[local-name(.)="form"]', doc);
    expect(forms.length).toBeGreaterThan(0);

    const transfers = select('//*[local-name(.)="transfer"]', forms[0]);
    expect(transfers.length).toBeGreaterThan(0);
};

const validate_transfer_tones = (text) => {
    const doc = dom_parser.parseFromString(text);
    const forms = select('//*[local-name(.)="form"]', doc);
    expect(forms.length).toBeGreaterThan(0);

    const audios = select('//*[local-name(.)="audio"]', forms[0]);
    expect(audios.length).toBeGreaterThan(0);
};

test('Start server.', () => {
    const port = 8081;
    app = new Koa();
    require('@mosaic-cx/neuron').neuron(app);
    server = app.listen(port);
});

test('Request /vxml/default/global/start.', async () => {
    const { text } = await supertest(process.env.CBHOST || 'http://localhost:8080')
        .post('/vxml/default/global/start')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ conversation_id })
        .expect(200);
    validate_say(text);
});

test('Request /vxml/default/global/end.', async () => {
    let consoleOutput = [];
    const mockedLog = output => consoleOutput.push(output);
    let consoleLogger = console.log;
    console.log = mockedLog;

    const { text } = await supertest(process.env.CBHOST || 'http://localhost:8080')
        .post('/vxml/default/global/end')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ conversation_id })
        .expect(200);

    validate_end(text);
    expect(consoleOutput.join()).toMatch(/neuron:cxl_validator:validate_cxl_data.*slaStatus.*success/);
    console.log = consoleLogger;
    console.log(consoleOutput.join());
});

test('Request /vxml/default/global/error.', async () => {
    const { text } = await supertest(process.env.CBHOST || 'http://localhost:8080')
        .post('/vxml/default/global/error')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ conversation_id })
        .expect(200);
    validate_error(text);
});

test('Request /vxml/default/greeting/say_greeting.', async () => {
    const { text } = await supertest(process.env.CBHOST || 'http://localhost:8080')
        .post('/vxml/default/greeting/say_greeting')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ conversation_id })
        .expect(200);
    validate_say(text);
});

test('Request /vxml/default/greeting/prompt_MainMenu.', async () => {
    const { text } = await supertest(process.env.CBHOST || 'http://localhost:8080')
        .post('/vxml/default/greeting/prompt_MainMenu')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ conversation_id })
        .expect(200);
    validate_prompt(text);
});


test('Request /vxml/default/greeting/dtmf_menu.', async () => {
    const { text } = await supertest(process.env.CBHOST || 'http://localhost:8080')
        .post('/vxml/default/dtmf_test/prompt_DTMFMenu')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ conversation_id })
        .expect(200);
    validate_prompt(text);
});

test('Request /vxml/default/transfer/basic_bridge_uui.', async () => {
    const { text } = await supertest(process.env.CBHOST || 'http://localhost:8080')
        .post('/vxml/default/transfer/basic_bridge_uui')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ conversation_id })
        .expect(200);
    validate_transfer(text);
});

test('Request /vxml/default/transfer/transfer_network.', async () => {
    const { text } = await supertest(process.env.CBHOST || 'http://localhost:8080')
        .post('/vxml/default/transfer/transfer_network')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ conversation_id })
        .expect(200);
    validate_transfer_tones(text);
});

test('Request /vxml/default/transfer/basic_sip_blind_uui.', async () => {
    const { text } = await supertest(process.env.CBHOST || 'http://localhost:8080')
        .post('/vxml/default/transfer/basic_sip_blind_uui')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ conversation_id })
        .expect(200);
    validate_transfer(text);
});

test('Request /vxml/default/greeting/prompt_MainMenu postback.', async () => {
    const { text } = await supertest(process.env.CBHOST || 'http://localhost:8080')
        .post('/vxml/default/greeting/prompt_MainMenu')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
            conversation_id,
            results: readFileSync('test/dialogflow-response.json', 'utf-8')
        })
        .expect(200);
    validate_say(text);
});

test('Request /vxml/default/dtmf_test/prompt_DTMFMenu postback.', async () => {
    const { text } = await supertest(process.env.CBHOST || 'http://localhost:8080')
        .post('/vxml/default/dtmf_test/prompt_DTMFMenu')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
            conversation_id,
            results: readFileSync('test/dtmf-response.json', 'utf-8')
        })
        .expect(200);
    validate_say(text);
});

test('Request /vxml/default/tech_support/account_lookup.', async () => {
    const { text } = await supertest(process.env.CBHOST || 'http://localhost:8080')
        .post('/vxml/default/tech_support/account_lookup')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ conversation_id })
        .expect(200);
    validate_prompt(text);
});

test('Request /vxml/default/payment/payment_amount.', async () => {
    const results = JSON.stringify([{
        "action_type": "prompt",
        "event_type": "response",
        "event_data": [{
            "confidence": 0.75,
            "utterance": "agent",
            "interpretation": {
                "responseId": "73807072-c35a-4b1a-80f1-62467fc9b90c-ce5e18e2",
                "queryResult": {
                    "queryText": "",
                    "action": "",
                    "parameters": { "unit-currency": { "amount": 50, "currency": "USD" } },
                    "allRequiredParamsPresent": true,
                    "fulfillmentText": "",
                    "fulfillmentMessages": [{
                        "text": {
                            "text": [""]
                        }
                    }
                    ],
                    "outputContexts": [{
                        "name": "projects/ce-diva-mvp-va-01-prod-01/agent/sessions/$ConversationId/contexts/repair-gen-model-followup",
                        "lifespanCount": 2,
                        "parameters": {}
                    }],
                    "intent": {
                        "name": "projects/ce-diva-mvp-va-01-prod-01/agent/intents/3f7302d1-7f36-4394-b41f-764d8b7e9a26",
                        "displayName": "prompt_getCardNumber",
                        "liveAgentHandoff": true,
                        "endInteraction": true
                    },
                    "intentDetectionConfidence": 1,
                    "diagnosticInfo": {
                        "end_conversation": true
                    },
                    "languageCode": "en"
                }
            }
        }]
    }]);

    const { text } = await supertest(process.env.CBHOST || 'http://localhost:8080')
        .post('/vxml/default/payment/payment_amount')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ conversation_id, results })
        .expect(200);
    validate_prompt(text);
});

test('Request /vxml/default/payment/make_payment.', async () => {
    const { text } = await supertest(process.env.CBHOST || 'http://localhost:8080')
        .post('/vxml/default/payment/make_payment')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ conversation_id })
        .expect(200);
    validate_say(text);
});


test('Stop server.', () => {
    server.close();
});
