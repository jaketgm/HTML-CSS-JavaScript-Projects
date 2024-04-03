const fs = require('fs');

const filename = 'output';

fs.readFile(filename, (err, data) => {
  if (err) throw err;

  const buffer = Buffer.from(data);
  const pixelData = [];

  for (let i = 0; i < buffer.length; i += 4) {
    const y = buffer[i];
    const cb = buffer[i + 1];
    const cr = buffer[i + 2];
    const a = buffer[i + 3];
    const r = Math.max(0, Math.min(255, Math.round(y + 1.402 * (cr - 128))));
    const g = Math.max(0, Math.min(255, Math.round(y - 0.34414 * (cb - 128) - 0.71414 * (cr - 128))));
    const b = Math.max(0, Math.min(255, Math.round(y + 1.772 * (cb - 128))));    
    pixelData.push({ x: i / 4, r, g, b });
  }

  console.table(pixelData);
});