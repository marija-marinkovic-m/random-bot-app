import { saveReading } from '../notion/questionsTable';
import { slackApi } from './api';

const STORE_ACTION_ID = 'response-and-store-reading-modal';
const NUDGE_ACTION_ID = 'ask-oracle-nudge';

export async function interactionHandle(payload: SlackModalPayload) {
    const callback_id = payload.callback_id ?? payload.view.callback_id;

    switch (callback_id) {
        case STORE_ACTION_ID:
            const data = payload.view.state.values;
            const metaData: ModalArgs['metadata'] = JSON.parse(payload.view.private_metadata);

            const note = data.note_block.note.value;

            await saveReading({
                question: metaData.question,
                note: note ?? 'NA',
                kingWen: metaData.kingWen,
                change: metaData.change || [],
                submitter: payload.user.name,
            });

            const noteText = note ? `In the aftermath was noted:\n>${note}.` : 'No comment 😳';

            await slackApi('chat.postMessage', {
                channel: process.env.CHANNEL_GENERAL_ID,
                text: `Oh dang, y’all! :eyes: <@${payload.user.id}> just received this magical 🔮 message from a <@RandomOracle>\n${metaData.title}\n\n${noteText}\n...discuss...`,
            });
            break;

        case NUDGE_ACTION_ID:
            const channel = payload.channel?.id;
            const user_id = payload.user.id;
            const thread_ts = payload.message.thread_ts ?? payload.message.ts;

            await slackApi('chat.postMessage', {
                channel,
                thread_ts,
                text: `Hey <@${user_id}>, I'm an expert in this topic. Run the \`/ask\` slash command to start one! :crystal_ball:`,
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
