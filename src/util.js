export function checkHighScores(messages){
    // delete duplicate wordle scores

    messages.sort((a, b) => {
        const aValue = a.message === "X"  ||  a.message === "x" ? Infinity : parseInt(a.message);
        const bValue = b.message === "X"  ||  b.message === "x" ? Infinity : parseInt(b.message);
        return aValue - bValue;
    });
}