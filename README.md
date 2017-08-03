# hapi-twilio-integration
A plugin to integrate twilio into HAPIJS 

Installation
------------
`npm install @samsystems/hapi-twilio-integration`

Basic Setup
-------------
To setup a plugin you need some configurations as:

    accountSid: Identify a twilio account, that can see in dashboard of twilio
    authToken: The token for authorize twilio for determinate account, that can see in twilio dashboard`
    twimlAppSid: The ID for twiml application call
    applicationSid: Require for grant access for video call
    twilioAPIKey: Require for grant access for video call, founded in twilio dashboard
    twilioAPIKeySecret: Require for grant access for video call, founded in twilio dashboard

When you register a plugin in manifest you need setup previous options like: 

    plugin:  {

        register: '@samsystems/hapi-twilio-integration',                
        options: {
            accountSid: 'valid accountSid',
            authToken: 'valid authToken',
            twimlAppSid: 'valid twimlAppSid',
            applicationSid: 'valid applicationSid',
            twilioAPIKey: 'valid twilioAPIKey',
            twilioAPIKeySecret: 'valid twilioAPIKeySecret'
        }
    }