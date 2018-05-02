import { Icon } from 'leaflet';
const tinycolor = require("tinycolor2");

export function getPointIcon(color: string){
  const light = tinycolor(color).darken(75);
  const size = 12;
  const svg = `
    <svg height="${size}" width="${size}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.9 / 2}" stroke="${light}" stroke-width="1.5" fill="${color}" />
    </svg>
  `;

  return new Icon({
    iconUrl: `data:image/svg+xml;utf8,${svg}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
