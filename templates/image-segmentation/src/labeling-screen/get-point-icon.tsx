import { Icon } from 'leaflet';
const tinycolor = require("tinycolor2");

export function getPointIcon(color: string){
  const light = tinycolor(color).lighten(25);
  const height = 41;
  const width = 28;
  const svg = `
    <svg height="${height}" width="${width}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="b">
          <stop offset="0" stop-color="${color}"/>
          <stop offset="1" stop-color="${color}"/>
        </linearGradient>
        <linearGradient id="a">
          <stop offset="0" stop-color="${color}"/>
          <stop offset="1" stop-color="${light}"/>
        </linearGradient>
        <linearGradient id="c" x1="0.498125" x2="0.498125" xlink:href="#a" y1="0.971494" y2="-0.004651"/>
        <linearGradient id="d" x1="0.415917" x2="0.415917" xlink:href="#b" y1="0.490437" y2="-0.004651"/>
      </defs>
      <g>
        <title>Layer 1</title>
        <path d="m14.095833,1.55c-6.846875,0 -12.545833,5.691 -12.545833,11.866c0,2.778 1.629167,6.308 2.80625,8.746l9.69375,17.872l9.647916,-17.872c1.177083,-2.438 2.852083,-5.791 2.852083,-8.746c0,-6.175 -5.607291,-11.866 -12.454166,-11.866zm0,7.155c2.691667,0.017 4.873958,2.122 4.873958,4.71s-2.182292,4.663 -4.873958,4.679c-2.691667,-0.017 -4.873958,-2.09 -4.873958,-4.679c0,-2.588 2.182292,-4.693 4.873958,-4.71z" fill="url(#c)" id="svg_2" stroke="url(#d)" stroke-linecap="round" stroke-width="1.1"/>
        <path d="m347.488007,453.719c-5.944,0 -10.938,5.219 -10.938,10.75c0,2.359 1.443,5.832 2.563,8.25l0.031,0.031l8.313,15.969l8.25,-15.969l0.031,-0.031c1.135,-2.448 2.625,-5.706 2.625,-8.25c0,-5.538 -4.931,-10.75 -10.875,-10.75zm0,4.969c3.168,0.021 5.781,2.601 5.781,5.781c0,3.18 -2.613,5.761 -5.781,5.781c-3.168,-0.02 -5.75,-2.61 -5.75,-5.781c0,-3.172 2.582,-5.761 5.75,-5.781z" fill="none" id="svg_3" stroke="red" stroke-linecap="round" stroke-opacity="0.122" stroke-width="1.1"/>
      </g>
    </svg>
  `;

  return new Icon({
    iconUrl: `data:image/svg+xml;utf8,${svg}`,
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
  });
}
