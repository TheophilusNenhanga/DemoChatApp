export function checkHighScores(messages){
    messages.sort((a, b) => {
        const aValue = a.message === "X"  ||  a.message === "x" ? -Infinity : parseInt(a.message);
        const bValue = b.message === "X"  ||  b.message === "x" ? -Infinity : parseInt(b.message);
        return aValue - bValue;
    });
    console.log(messages);
}