import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { parse } from 'querystring';
import { slashCommandHandle } from './utils/slack/slashCommand';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log(event.body);
        // @todo: uncomment this
        // const valid = verifySlackRequest(event);
        // if (!valid) {
        //     console.error('invalid request');

        //     return {
        //         statusCode: 400,
        //         body: 'invalid request',
        //     };
        // }

        const body = parse(event.body ?? '') as SlackPayload;

        if (body.command) {
            return slashCommandHandle(body as SlackSlashCommandPayload);
        }

        // @todo: handle interactivity (e.g. context commands, modals)
        // if (body.payload) {
        //     const payload = JSON.parse(body.payload);
        //     return handleInteractivity(payload);
        // }

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
