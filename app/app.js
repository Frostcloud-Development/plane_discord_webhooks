/**
 * @file Primary application handler that runs everything, initializes modules etc.
 * @author Avenze
 * @since 1.0.0
 * @version 1.0.0
 */

/**********************************************************************
 * @description Initialize all variables & dependencies.
 */

const express = require('express');
const crypto = require('crypto');
const stringify = require('json-stable-stringify');
const bodyParser = require('body-parser');
const { env } = require('process');

const { Logging } = require("../libraries")

/**********************************************************************
 * @description Initialization of Express.js webserver.
 */

const ExpressApp = express();
const WebhookSecret = "";

// Middleware to parse JSON body
//ExpressApp.use(express.json());
//ExpressApp.use(bodyParser.raw({ type: '*/*' }));
ExpressApp.use(express.raw({ type: '*/*' }));

/**********************************************************************
 * @description Demo initialization of rawBody middleware handler.
 * @status Unusable, keeping here for future reference, express.raw works :)
 

ExpressApp.use((req, res, next) => {
    let rawBody = '';
    req.on('data', chunk => {
        rawBody += chunk.toString();
    });
    req.on('end', () => {
        req.rawBody = rawBody;
        next();
    });
});

/**********************************************************************
 * @description Webserver endpoint initialization/registration.
 */

ExpressApp.post('/webhook', (req, res) => {
    const ProvidedSignature = req.headers['x-plane-signature'];
    const RequestBody = stringify(req.body);
    const RequestBody2 = JSON.stringify(req.body);
    const RequestBody3 = req.body.toString('utf-8');
    const RequestBody4 = req.body;

    console.log(RequestBody)

    /* Generate an expected HMAC signature with sha256 */
    const ExpectedSignature = crypto.createHmac('sha256', WebhookSecret)
                                    .update(RequestBody, "utf-8")
                                    .digest('hex');

    const ExpectedSignature2 = crypto.createHmac('sha256', WebhookSecret)
                                    .update(RequestBody2, "utf-8")
                                    .digest('hex');

    const ExpectedSignature3 = crypto.createHmac('sha256', WebhookSecret)
                                    .update(RequestBody3, "utf-8")
                                    .digest('hex');

    const ExpectedSignature4 = crypto.createHmac('sha256', WebhookSecret)
                                    .update(RequestBody3, "utf-8")
                                    .digest('hex');


    console.log(ProvidedSignature);
    console.log("...........")
    console.log(ExpectedSignature);
    console.log(ExpectedSignature2);
    console.log(ExpectedSignature3);
    console.log(ExpectedSignature4);

    /* Verify the provided signature to see if it matches with our signature */
    if (!crypto.timingSafeEqual(Buffer.from(ExpectedSignature, 'utf-8'), Buffer.from(ProvidedSignature, 'utf-8'))) {
        console.warn("An incorrect signature was provided to the /webhook endpoint!")
        return res.status(403).send('Invalid signature provided');
    } 

    /* Signature was valid, continue processing the request... */

    console.log(json.stringify(RequestBody.data))


});

ExpressApp.listen(3000, () => {
    console.log('Server listening on port 3000');
});