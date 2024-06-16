const { spawn } = require('child_process');

// Daftar perintah untuk dijalankan
const commands = [
  { script: 'startBot.js', cwd: './core' },
  { script: 'index.js', cwd: './server' },
  { script: 'npm start', cwd: 'client', isReact: true }
];

function runWithNodemon(script, cwd, isReact = false) {
  const cmd = isReact ? 'npm' : 'npx';
  const args = isReact ? ['start'] : ['nodemon', '--watch', script, '--exec', `node ${script}`];
  const child = spawn(cmd, args, { cwd, shell: true });

  child.stdout.on('data', (data) => {
    console.log(`stdout (${script}): ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr (${script}): ${data}`);
  });

  child.on('close', (code) => {
    console.log(`Child process (${script}) exited with code ${code}`);
  });

  return child;
}

// Jalankan semua perintah dalam daftar
commands.forEach(({ script, cwd, isReact }) => {
  runWithNodemon(script, cwd, isReact);
});
