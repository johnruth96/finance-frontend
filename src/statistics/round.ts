export const adaRound = (value: number) => {
    return Math.abs(value) < 100 ?
        value :
        Math.abs(value) < 1000 ?
            Math.round(value / 10) * 10 :
            Math.round(value / 100) * 100
}