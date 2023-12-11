export const blocks = {
    section: ({ text }: SectionBlockArgs): SlackBlockSection => {
        return {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text,
            },
        };
    },
    input: ({ id, label, placeholder, initial_value = '', hint = '' }: InputBlockArgs): SlackBlockInput => {
        return {
            block_id: `${id}_block`,
            type: 'input',
            label: {
                type: 'plain_text',
                text: label,
            },
            element: {
                action_id: id,
                type: 'plain_text_input',
                placeholder: {
                    type: 'plain_text',
                    text: placeholder,
                },
                initial_value,
            },
            hint: {
                type: 'plain_text',
                text: hint,
            },
        };
    },
    select: ({ id, label, placeholder, options }: SelectBlockArgs): SlackBlockInput => {
        return {
            block_id: `${id}_block`,
            type: 'input',
            label: {
                type: 'plain_text',
                text: label,
            },
            element: {
                action_id: id,
                type: 'static_select',
                placeholder: {
                    type: 'plain_text',
                    text: placeholder,
                    emoji: true,
                },
                options: options.map(({ label, value }) => {
                    return {
                        text: {
                            type: 'plain_text',
                            text: label,
                            emoji: true,
                        },
                        value,
                    };
                }),
            },
        };
    },
};
