const progress = () => {
  // Write your code here
  // Simulate progress bar from 0% to 100% over ~5 seconds
  // Update in place using \r every 100ms
  // Format: [████████████████████          ] 67%
  const total = 20; // Total blocks in the progress bar
  let current = 0; // Current progress
  const interval = setInterval(() => {
	current++;
	const percent = Math.round((current / total) * 100);
	const blocks = '█'.repeat(current) + ' '.repeat(total - current);
	process.stdout.write(`\r[${blocks}] ${percent}%`);
	if (current >= total) {
	  clearInterval(interval);
	  console.log('\nProgress complete!');
	}
  }, 250); // Update every 250ms
};

progress();
