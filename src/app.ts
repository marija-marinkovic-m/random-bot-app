import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { parse } from 'querystring';
import { slashCommandHandle } from './utils/slack/slashCommand';
import { interactionHandle } from './utils/slack/interativityCommand';
import { verifySlackRequest } from './utils/slack/api';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log(event.body);
        const valid = verifySlackRequest(event);
        if (!valid) {
            console.error('invalid request');
            return {
                statusCode: 400,
                body: 'invalid request',
            };
        }

        const body = parse(event.body ?? '') as SlackPayload;

        if (body.command) {
            return slashCommandHandle(body as SlackSlashCommandPayload);
        }

        if (body.payload) {
            const payload = JSON.parse(body.payload);
            return interactionHandle(payload);
        }

        return {
            statusCode: 200,
            body: 'Still work in progress',
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
            }),
        };
    }
};
