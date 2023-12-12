import { notionApi } from './api';
import getDate from '../getDate';

export async function getFeaturedItems(): Promise<OracleItem[]> {
    const notionData = await notionApi(`/databases/${process.env.NOTION_QUESTIONS_TABLE_ID}/query`, {
        filter: {
            property: 'Status',
            status: {
                equals: 'Featured',
            },
        },
        page_size: 100,
    });

    const openItems: OracleItem[] = notionData?.results.map((item: any) => {
        return {
            question: item.properties.question.title[0].plain_text,
            submitter: item.properties.submitter.rich_text[0].plain_text,
            note: item.properties.note.rich_text[0].plain_text,
            kingWen: item.properties.kingWen.number,
            change: item.properties.change.number,
        };
    });

    return openItems;
}

export async function saveReading(item: OracleItem) {
    const res = await notionApi('/pages', {
        parent: {
            type: 'database_id',
            database_id: process.env.NOTION_QUESTIONS_TABLE_ID,
        },
        properties: {
            question: {
                title: [{ text: { content: item.question } }],
            },
            note: {
                rich_text: [{ text: { content: item.note } }],
            },
            kingWen: {
                number: item.kingWen,
            },
            change: {
                multi_select: item.change?.map((change) => ({ name: String(change) })) || null,
            },
            submitter: {
                rich_text: [{ text: { content: `@${item.submitter} on Slack` } }],
            },
            Date: {
                type: 'date',
                date: {
                    start: getDate(),
                },
            },
        },
    });

    if (!res.ok) {
        console.log(res);
    }
}
