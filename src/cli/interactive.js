import readline from 'readline';

const interactive = () => {
  // Write your code here
  // Use readline module for interactive CLI
  // Support commands: uptime, cwd, date, exit
  // Handle Ctrl+C and unknown commands
	  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  rl.prompt();

  rl.on('line', (input) => {
    const command = input.trim();

    if (command === 'uptime') {
      console.log(`Uptime: ${process.uptime().toFixed(2)}s`);
    } 
    else if (command === 'cwd') {
      console.log(process.cwd());
    } 
    else if (command === 'date') {
      console.log(new Date().toISOString());
    } 
    else if (command === 'exit') {
      //console.log('Goodbye!');
      rl.close();
      return;
    } 
    else {
      console.log('Unknown command');
    }

    rl.prompt();
  });

  rl.on('close', () => {
    console.log('Goodbye!');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    rl.close();
  });
};

interactive();
