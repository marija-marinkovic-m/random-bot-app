import { APIGatewayProxyResult } from 'aws-lambda';
import { slackApi } from './api';

export async function slashCommandHandle(payload: SlackSlashCommandPayload): Promise<APIGatewayProxyResult> {
    switch (payload.command) {
        case '/ask':
            const joke = await fetch('https://icanhazdadjoke.com', {
                headers: { accept: 'text/plain' },
            });
            const response = await slackApi('chat.postMessage', {
                channel: payload.channel_id,
                text: await joke.text(),
            });

            if (!response.ok) {
                console.log(response);
            }
            break;

        default:
            return {
                statusCode: 200,
                body: `Command ${payload.command} is not recognized`,
            };
    }

    return {
        statusCode: 200,
        body: '',
    };
}
