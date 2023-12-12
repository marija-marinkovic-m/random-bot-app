import { saveReading } from '../notion/questionsTable';
import { slackApi } from './api';

export async function interactionHandle(payload: SlackModalPayload) {
    const callback_id = payload.callback_id ?? payload.view.callback_id;

    switch (callback_id) {
        case 'response-and-store-reading-modal':
            const data = payload.view.state.values;
            const metaData: ModalArgs['metadata'] = payload.view.private_metadata;

            const note = data.note_block.note.value;

            await saveReading({
                question: metaData.question,
                note: note ?? 'NA',
                kingWen: metaData.kingWen,
                change: metaData.change || [],
                submitter: payload.user.name,
            });

            const noteText = note ? `and left a note:\n>${note}.` : 'and left no note.';

            await slackApi('chat.postMessage', {
                channel: process.env.CHANNEL_GENERAL_ID,
                text: `Oh dang, y’all! :eyes: <@${payload.user.id}> just started received this magical message from a <@RandomOracle> ${noteText}\n\n...discuss.`,
            });
            break;

        case 'ask-oracle-nudge':
            const channel = payload.channel?.id;
            const user_id = payload.user.id;
            const thread_ts = payload.message.thread_ts ?? payload.message.ts;

            await slackApi('chat.postMessage', {
                channel,
                thread_ts,
                text: `Hey <@${user_id}>, this statement could be run against Random Oracle. Run the \`/ask\` slash command to start one!`,
            });

            break;

        default:
            console.log(`No handler defined for ${payload.view.callback_id}`);
            return {
                statusCode: 400,
                body: `No handler defined for ${payload.view.callback_id}`,
            };
    }

    return {
        statusCode: 200,
        body: '',
    };
}
