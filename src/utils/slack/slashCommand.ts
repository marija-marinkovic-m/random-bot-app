import { APIGatewayProxyResult } from 'aws-lambda';
import { slackApi } from './api';
import { generateHexagram } from '../oracle';
import { getHexagramDetail } from '../notion/hexagramsTable';
import { blocks, modal } from './blocks';

export async function slashCommandHandle(payload: SlackSlashCommandPayload): Promise<APIGatewayProxyResult> {
    if (payload.command !== '/ask') {
        return {
            statusCode: 200,
            body: `Command ${payload.command} is not supported`,
        };
    }
    const oracle = generateHexagram();
    const reading = await getHexagramDetail(oracle.kingWen, oracle.change);

    if (!reading) {
        return {
            statusCode: 200,
            body: 'Failed to get reading',
        };
    }

    const answer = `>*${reading.chars} • ${reading.title}*\n>${reading.judgement}\n\nRead more: <${reading.url}|${reading.title}>`;

    const response = await slackApi(
        'views.open',
        modal({
            id: 'response-and-store-reading-modal',
            title: 'Oracle Says...',
            trigger_id: payload.trigger_id,
            blocks: [
                blocks.section({
                    text: `_New message for <@${payload.user_name}>_\n${answer}`,
                }),
                blocks.input({
                    id: 'note',
                    label: 'Note',
                    placeholder: 'Example: This one is for my friend',
                    hint: 'In case you want to store reading, please leave a note',
                }),
            ],
            metadata: {
                question: payload.text || 'General question',
                kingWen: reading.kingWen,
                title: answer,
                change: oracle.change || [],
            },
        }),
    );

    if (!response.ok) {
        return {
            statusCode: 200,
            body: 'Failed to open dialog',
        };
    }

    return {
        statusCode: 200,
        body: '',
    };
}
