interface ILine {
    old: boolean;
    binary: number;
    position: number;
}

interface IHexagram {
    kingWen: number;
    change?: number[];
}

const map = {
    '100000': 24,
    '100001': 27,
    '100010': 3,
    '100011': 42,
    '100100': 51,
    '100101': 21,
    '100110': 17,
    '100111': 25,
    '101000': 36,
    '101001': 22,
    '101010': 63,
    '101011': 37,
    '101100': 55,
    '101101': 30,
    '101110': 49,
    '101111': 13,
    '110000': 19,
    '110001': 41,
    '110010': 60,
    '110011': 61,
    '110100': 54,
    '110101': 38,
    '110110': 58,
    '110111': 10,
    '111000': 11,
    '111001': 26,
    '111010': 5,
    '111011': 9,
    '111100': 34,
    '111101': 14,
    '111110': 43,
    '111111': 1,
    '000000': 2,
    '010001': 4,
    '010111': 6,
    '010000': 7,
    '000010': 8,
    '000111': 12,
    '001000': 15,
    '000100': 16,
    '011001': 18,
    '000011': 20,
    '000001': 23,
    '011110': 28,
    '010010': 29,
    '001110': 31,
    '011100': 32,
    '001111': 33,
    '000101': 35,
    '001010': 39,
    '010100': 40,
    '011111': 44,
    '000110': 45,
    '011000': 46,
    '010110': 47,
    '011010': 48,
    '011101': 50,
    '001001': 52,
    '001011': 53,
    '001101': 56,
    '011011': 57,
    '010011': 59,
    '001100': 62,
    '010101': 64,
};

export const resolveSeparation: (numberOfStalks: number) => 3 | 2 = (numberOfStalks: number) => {
    const observer = 1;
    const westPile = Math.floor(Math.random() * numberOfStalks);
    const eastPile = numberOfStalks - westPile - observer;

    const westRemainder = westPile % 4 || 4;
    const eastRemainder = eastPile % 4 || 4;

    return observer + westRemainder + eastRemainder > 5 ? 2 : 3;
};

const resolveLine: () => Omit<ILine, 'position'> = () => {
    let numberOfStalks = 49;

    const draws = Array.from({ length: 3 }, () => {
        const draw = resolveSeparation(numberOfStalks);
        numberOfStalks -= draw;
        return draw;
    });

    switch (draws.reduce((acc, curr) => acc + curr, 0)) {
        case 6:
            return { old: true, binary: 0 }; // old yin
        case 7:
            return { old: false, binary: 1 }; // young yang
        case 8:
            return { old: false, binary: 0 }; // young yin
        case 9:
            return { old: true, binary: 1 }; // old yang
        default:
            throw new Error('Something went wrong!');
    }
};

export const generateHexagram: () => IHexagram = () => {
    const hexagram: ILine[] = [];
    for (let position = 1; position < 7; position++) {
        const line = resolveLine();
        hexagram.push({
            ...line,
            position,
        });
    }

    const binary = hexagram.reduce((acc: string, curr: ILine) => acc + curr.binary, '');
    const kingWen = map[binary as keyof typeof map];
    const change = hexagram.filter((line) => line.old).map((line) => line.position);

    return {
        kingWen,
        change,
    };
};
