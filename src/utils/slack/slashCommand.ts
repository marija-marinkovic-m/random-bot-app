import { APIGatewayProxyResult } from 'aws-lambda';
import { slackApi } from './api';
import { generateHexagram } from '../oracle';
import { getHexagramDetail } from '../notion/hexagramsTable';
import { saveReading } from '../notion/questionsTable';

export async function createResponse(question: string): Promise<{ oracle: any; reading: Hexagram }> {
    const oracle = generateHexagram();
    const reading = await getHexagramDetail(oracle.kingWen, [3, 5]);

    if (!reading) {
        throw new Error('Failed to get hexagram detail');
    }

    await saveReading({
        question,
        note: 'NA',
        kingWen: oracle.kingWen,
        change: oracle.change || [],
        submitter: '@bySlack',
    });

    return { oracle, reading };
}

export async function slashCommandHandle(payload: SlackSlashCommandPayload): Promise<APIGatewayProxyResult> {
    switch (payload.command) {
        case '/ask':
            const { reading } = await createResponse(payload.text || 'test');
            const response = await slackApi('chat.postMessage', {
                channel: payload.channel_id,
                text: `*${reading.title}*\n${reading.chars}\n\n${reading.judgement}\n\n`,
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
