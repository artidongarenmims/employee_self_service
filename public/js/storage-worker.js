self.onmessage = async event => {
    const answer = event.data;
	// console.log('answer:::::::::', answer)
    // Send result back to the main thread
    self.postMessage(answer);
};
function checkAnswer(answer) {
    // Simulate answer checking (replace with your actual grading logic)
    return answer.trim().toLowerCase() === 'web workers are awesome';
}
