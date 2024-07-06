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

require('dotenv').config();

/**********************************************************************
 * @description Initialization of Express.js webserver.
 */

const ExpressApp = express();
const WebhookSecret = process.env.WEBHOOK_SECRET;

// Middleware to parse JSON body
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
    const RequestBody = req.body;

    /* Generate an expected HMAC signature with sha256 */
    const ExpectedSignature = crypto.createHmac('sha256', WebhookSecret)
                                    .update(RequestBody, "utf-8")
                                    .digest('hex');

    /* Verify the provided signature to see if it matches with our signature */
    if (!crypto.timingSafeEqual(Buffer.from(ExpectedSignature, 'utf-8'), Buffer.from(ProvidedSignature, 'utf-8'))) {
        console.warn("An incorrect signature was provided to the /webhook endpoint!")
        return res.status(403).send('Invalid signature provided');
    } 

    /* Signature was valid, convert the raw buffer into JSON */

    let RequestData;

    try {
        RequestData = JSON.parse(RequestBody.toString('utf-8'));
    } catch (error) {
        console.error('Error parsing the provided JSON buffer: ', error);
        return res.status(400).send('Error parsing the provided JSON buffer');
    }

    /* TODO: write the following part :) */


});

ExpressApp.listen(3000, () => {
    console.log('Server listening on port 3000');
});