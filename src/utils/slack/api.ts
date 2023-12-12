import type { APIGatewayProxyEvent } from 'aws-lambda';
import { createHmac } from 'crypto';

export async function slackApi(endpoint: SlackApiEndpoint, body: any) {
    const res = await fetch(`https://slack.com/api/${endpoint}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.SLACK_BOT_OAUTH_TOKEN}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(body),
    });
    return await res.json();
}

export function verifySlackRequest(request: APIGatewayProxyEvent) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const secret = process.env.SLACK_SIGNIN_SECRET!;
        const signature = request.headers['x-slack-signature'];
        const timestamp = Number(request.headers['x-slack-request-timestamp']);
        const now = Math.floor(Date.now() / 1000);

        if (Math.abs(now - timestamp) > 300) {
            return false;
        }

        const hash = createHmac('sha256', secret).update(`v0:${timestamp}:${request.body}`).digest('hex');

        return `v0:${hash}` === signature;
    } catch (err) {
        console.error(err);
        return false;
    }
}
