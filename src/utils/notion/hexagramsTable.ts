import { notionApi } from './api';

function normalizeLines(lines: HexagramLine[], change: number[] = []): string {
    return !change.length
        ? ''
        : lines
              .filter((line: HexagramLine) => change.includes(line.position))
              .map((line: HexagramLine) => line.text)
              .join('\n');
}

export async function getHexagramDetail(kingWen: number, change: number[] = []): Promise<Hexagram | null> {
    const notionData = await notionApi(`/databases/${process.env.NOTION_HEXAGRAMS_TABLE_ID}/query`, {
        filter: {
            property: 'kingWen',
            number: {
                equals: kingWen,
            },
        },
    });
    const props = notionData?.results?.[0].properties;

    if (!notionData?.results.length || !props) {
        return null;
    }

    return {
        kingWen: props.kingWen.number,
        title: props.title.title[0].plain_text,
        chars: props.chars.rich_text[0].plain_text,
        uniCode: props.uniCode.number,
        judgement: props.judgement.rich_text[0].plain_text,
        lines: normalizeLines(JSON.parse(props.lines.rich_text[0].plain_text), change),
        url: props.url.url,
    };
}
