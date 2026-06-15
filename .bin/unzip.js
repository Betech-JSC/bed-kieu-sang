const fs = require('fs');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
let zipPath = '';
let destPath = '';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '-d') {
    destPath = args[i + 1];
    i++;
  } else if (args[i] !== '-qo') {
    zipPath = args[i];
  }
}

if (zipPath && destPath) {
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }
  
  // Escape single quotes for PowerShell
  const escapedZip = zipPath.replace(/'/g, "''");
  const escapedDest = destPath.replace(/'/g, "''");
  const psCommand = `powershell -NoProfile -Command "Expand-Archive -Path '${escapedZip}' -DestinationPath '${escapedDest}' -Force"`;
  
  try {
    execSync(psCommand, { stdio: 'inherit' });
  } catch (err) {
    console.error('Extraction failed:', err);
    process.exit(1);
  }
}
