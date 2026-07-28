import sharp from 'sharp';

function makeSvg(size) {
  const barH = Math.round(size * 0.06);
  const fontSize = Math.round(size * 0.52);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#186A4C" rx="${Math.round(size * 0.18)}"/>
  <rect x="0" y="${size - barH}" width="${size}" height="${barH}" fill="#B8863B" rx="0"/>
  <text
    x="50%" y="54%"
    dominant-baseline="middle"
    text-anchor="middle"
    font-family="serif"
    font-size="${fontSize}"
    fill="white"
  >م</text>
</svg>`;
}

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

for (const { name, size } of sizes) {
  await sharp(Buffer.from(makeSvg(size)))
    .png()
    .toFile(`public/${name}`);
  console.log(`✓ public/${name}`);
}
