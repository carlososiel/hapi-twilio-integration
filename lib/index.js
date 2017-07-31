'use strict';

const twilio = require('twilio');
const AccessToken = twilio.AccessToken;
const Boom = require('boom');

let twilioIntegration = {
    register: function (server, options, next) {
        let client = require('twilio')(options.accountSid, options.authToken);

        /**
         * Decorate a method in server object of HapiJS to provide the way to send SMS
         * @param to {number} A number that represent a recipient of message, need using prefix of country.
         * @param from {number} A number that represent a sender of message, need set a verified Twilio phone number o twilio phone number.
         * @param text {string} A message body.
         * */
        server.method('sendSMS', function(to, from, text){
            client.messages.create({
                to: to,
                from: from,
                body: text,
            }, function(err, message) {
                throw Boom.badData('The message cannot be sended');
            });
        });

        /**
         * Create a new route for use in twiml apps from twilio to accept calls.
         */
        server.route({
            method: 'GET',
            path: '/twilio/xml/',
            handler: function(request, reply) {
                let xml = "<Response><Dial callerId='"+request.query.From+"'>"+request.query.To+"</Dial></Response>";
                reply(xml).header('Content-type', 'application/xml');
            }
        });

        /**
         * Create a route to get a token for initiate a call from twilio.js client
         */
        server.route({
            method: 'GET',
            path: '/twilio/token/call',
            handler: function(request, reply) {
                let capability = new twilio.Capability(options.accountSid, options.authToken);
                capability.allowClientOutgoing(options.twimlAppSid);
                let token = {
                    token: capability.generate()
                };
                reply(token);
            }
        });
        /**
         * Create a route to get a token for initiate a call from twilio-video.js client
         * */
        server.route({
            method: 'GET',
            path: '/twilio/token/video',
            handler: function(request, reply) {
                const {identity} = request.query;
                if(identity) {
                    let accessToken = new AccessToken(
                        options.accountSid,
                        options.twilioAPIKey,
                        options.twilioAPIKeySecret
                    );
                    accessToken.identity = identity;
                    let grant = new AccessToken.VideoGrant();
                    grant.configurationProfileSid = options.applicationSid;
                    accessToken.addGrant(grant);
                    let token = {
                        token: accessToken.toJwt()
                    };
                    reply(token);
                }
                else {
                    throw new Boom.badRequest('The identity params is required');
                }
            }
        });
        next();
    }
};

twilioIntegration.register.attributes = {
    name: 'Twilio Integration',
    version: '1.0.0'
};

module.exports = twilioIntegration;