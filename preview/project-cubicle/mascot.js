// Odd Jobs — parametric mascot generator.
// One function draws every crew member: capsule body × hue × headgear × prop
// × expression × live state. Returns an SVG string, `size` px wide.
// The look is pure costume: none of this is ever sent to the model.

export const HUES = [
  { name: 'Clay', h: 24 },
  { name: 'Sage', h: 95 },
  { name: 'Marigold', h: 46 },
  { name: 'Plum', h: 315 },
  { name: 'Denim', h: 226 },
  { name: 'Teal', h: 176 },
  { name: 'Brick', h: 9 },
  { name: 'Moss', h: 135 },
];
export const GEAR = ['none', 'hardhat', 'beret', 'headset', 'cap', 'antenna'];
export const PROPS = ['none', 'wrench', 'magnifier', 'pencil', 'calculator', 'clipboard', 'megaphone', 'flask', 'coffee'];
export const EXPRESSIONS = ['happy', 'focused', 'worried', 'sleepy'];
export const STATES = ['idle', 'working', 'fumble'];

const INK = '#2e2b25';
const CREAM = '#f9f4ed';
const hsl = (h, s, l) => `hsl(${h} ${s}% ${l}%)`;

function expressionSVG(ex, ink) {
  if (ex === 'focused') return `
    <rect x="52" y="52" width="12" height="5.5" rx="2.75" fill="${ink}"/>
    <rect x="76" y="52" width="12" height="5.5" rx="2.75" fill="${ink}"/>
    <path d="M51 46 L64 49 M89 46 L76 49" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
    <path d="M64 66 H76" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`;
  if (ex === 'worried') return `
    <circle cx="58" cy="56" r="4.3" fill="${ink}"/><circle cx="82" cy="56" r="4.3" fill="${ink}"/>
    <path d="M52 47 Q58 43 64 47 M76 47 Q82 43 88 47" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="70" cy="68" rx="3.6" ry="4.4" fill="${ink}"/>`;
  if (ex === 'sleepy') return `
    <path d="M53 55 Q58 60 63 55 M77 55 Q82 60 87 55" stroke="${ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <path d="M65 67 H75" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
  // happy
  return `
    <circle cx="58" cy="55" r="4.3" fill="${ink}"/><circle cx="82" cy="55" r="4.3" fill="${ink}"/>
    <path d="M62 65 Q70 72 78 65" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`;
}

function visorEyes(ex, glow) {
  if (ex === 'focused') return `
    <rect x="52" y="54" width="12" height="5" rx="2.5" fill="${glow}"/>
    <rect x="76" y="54" width="12" height="5" rx="2.5" fill="${glow}"/>`;
  if (ex === 'worried') return `
    <rect x="53" y="49" width="10" height="14" rx="4" fill="${glow}"/>
    <rect x="78" y="53" width="8" height="8" rx="3.5" fill="${glow}"/>`;
  if (ex === 'sleepy') return `
    <path d="M53 58 h10 M77 58 h10" stroke="${glow}" stroke-width="4" stroke-linecap="round"/>`;
  return `
    <rect x="53" y="50" width="10" height="13" rx="4" fill="${glow}"/>
    <rect x="77" y="50" width="10" height="13" rx="4" fill="${glow}"/>`;
}

function gearSVG(gear, oc, hue) {
  switch (gear) {
    case 'hardhat': return `
      <path d="M47 33 a23 23 0 0 1 46 0 z" fill="#f6a06b"${oc}/>
      <rect x="41" y="31" width="58" height="7" rx="3.5" fill="#e08a4b"${oc}/>
      <rect x="66" y="12" width="8" height="12" rx="4" fill="#e08a4b"/>`;
    case 'beret': return `
      <ellipse cx="67" cy="25" rx="25" ry="12" fill="#56633f"${oc} transform="rotate(-9 67 25)"/>
      <circle cx="70" cy="12" r="3.2" fill="#56633f"/>`;
    case 'headset': return `
      <path d="M45 42 a25 25 0 0 1 50 0" fill="none" stroke="#474238" stroke-width="7"/>
      <rect x="37" y="38" width="10" height="17" rx="5" fill="#474238"${oc}/>
      <rect x="93" y="38" width="10" height="17" rx="5" fill="#474238"${oc}/>
      <path d="M42 55 q-8 12 9 16" fill="none" stroke="#474238" stroke-width="4" stroke-linecap="round"/>
      <circle cx="53" cy="72" r="4" fill="#474238"/>`;
    case 'cap': return `
      <path d="M47 34 a23 21 0 0 1 46 0 z" fill="#8fa073"${oc}/>
      <path d="M89 26 q16 2 14 11 l-16 -4 z" fill="#728157"${oc}/>
      <circle cx="70" cy="13" r="3.5" fill="#728157"/>`;
    case 'antenna': return `
      <rect x="68" y="6" width="4" height="20" rx="2" fill="#82796a"/>
      <circle cx="70" cy="6" r="5.5" fill="${hsl(hue, 60, 55)}"${oc}/>`;
    default: return '';
  }
}

function propSVG(prop, oc) {
  switch (prop) {
    case 'wrench': return `<g transform="rotate(24)">
      <rect x="-3.5" y="-10" width="7" height="26" rx="3.5" fill="#82796a"${oc}/>
      <circle cx="0" cy="-12" r="8" fill="#82796a"${oc}/>
      <circle cx="0" cy="-14.5" r="4" fill="${CREAM}"/></g>`;
    case 'magnifier': return `<g transform="rotate(12)">
      <circle cx="2" cy="-12" r="9" fill="${CREAM}" fill-opacity=".65" stroke="#474238" stroke-width="4"/>
      <rect x="6" y="-4" width="14" height="6" rx="3" transform="rotate(45 6 -4)" fill="#474238"/></g>`;
    case 'pencil': return `<g transform="rotate(-38)">
      <rect x="-3.5" y="-14" width="7" height="24" rx="2" fill="#f6a06b"${oc}/>
      <rect x="-3.5" y="-14" width="7" height="5" rx="2" fill="#c67139"/>
      <path d="M-3.5 10 L0 19 L3.5 10 Z" fill="#474238"/></g>`;
    case 'calculator': return `
      <rect x="-9" y="-20" width="18" height="27" rx="4" fill="#474238"${oc}/>
      <rect x="-5.5" y="-16.5" width="11" height="6" rx="1.5" fill="${CREAM}"/>
      <circle cx="-4.5" cy="-6" r="1.8" fill="${CREAM}"/><circle cx="4.5" cy="-6" r="1.8" fill="${CREAM}"/>
      <circle cx="-4.5" cy="0" r="1.8" fill="${CREAM}"/><circle cx="4.5" cy="0" r="1.8" fill="${CREAM}"/>`;
    case 'clipboard': return `<g transform="rotate(8)">
      <rect x="-9" y="-20" width="18" height="27" rx="3" fill="${CREAM}" stroke="#a19786" stroke-width="2"/>
      <rect x="-5" y="-23" width="10" height="7" rx="3" fill="#82796a"/>
      <path d="M-5 -12 h10 M-5 -6 h10 M-5 0 h6" stroke="#c0b6a5" stroke-width="2.5" stroke-linecap="round"/></g>`;
    case 'megaphone': return `<g transform="rotate(-14)">
      <path d="M-6 -10 L14 -20 L14 4 L-6 -6 Z" fill="#b2622d"${oc}/>
      <rect x="-12" y="-11" width="7" height="7" rx="2" fill="#8c491a"/>
      <path d="M18 -22 l5 -4 M20 -14 l7 -1 M19 -6 l6 3" stroke="#b2622d" stroke-width="2.5" stroke-linecap="round"/></g>`;
    case 'flask': return `
      <path d="M-3 -22 h6 v8 l8 13 q3 6 -4 6 h-14 q-7 0 -4 -6 l8 -13 z" fill="${CREAM}" fill-opacity=".8" stroke="#82796a" stroke-width="2.5"/>
      <ellipse cx="0" cy="1" rx="7.5" ry="4" fill="#8fa073"/>
      <circle cx="-2" cy="-6" r="1.6" fill="#8fa073"/>`;
    case 'coffee': return `
      <rect x="-9" y="-12" width="16" height="15" rx="3.5" fill="${CREAM}" stroke="#a19786" stroke-width="2.5"/>
      <path d="M7 -9 q7 1 0 9" fill="none" stroke="#a19786" stroke-width="2.5"/>
      <path d="M-5 -16 q2 -3 0 -6 M1 -16 q2 -3 0 -6" stroke="#c0b6a5" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    default: return '';
  }
}

export function mascotSVG(opts = {}) {
  const {
    styleDir = 'a', hue = 24, gear = 'none', prop = 'none',
    expr, state = 'idle', size = 120,
  } = opts;
  const ex = expr || (state === 'fumble' ? 'worried' : 'happy');
  const body = styleDir === 'c' ? hsl(hue, 55, 66) : hsl(hue, 48, 58);
  const dark = hsl(hue, 42, 40);
  const light = hsl(hue, 52, 78);
  const glow = hsl(hue, 72, 82);
  const oc = styleDir === 'c' ? ` stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"` : '';

  const outerAnim = state === 'fumble'
    ? 'oj-fumble .55s ease-in-out infinite'
    : state === 'working'
      ? 'oj-bob 1.1s ease-in-out infinite'
      : 'oj-bob 2.8s ease-in-out infinite';
  const armAnim = state === 'working'
    ? 'animation:oj-work .5s ease-in-out infinite alternate;'
    : state === 'fumble' ? 'animation:oj-drop .55s ease-in-out infinite alternate;' : '';

  const arm = (d) => styleDir === 'c'
    ? `<path d="${d}" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>
       <path d="${d}" fill="none" stroke="${body}" stroke-width="7" stroke-linecap="round"/>`
    : `<path d="${d}" fill="none" stroke="${body}" stroke-width="11" stroke-linecap="round"/>`;

  const feet = styleDir === 'c'
    ? `<ellipse cx="55" cy="130" rx="10" ry="6.5" fill="${body}" stroke="${INK}" stroke-width="3.5"/>
       <ellipse cx="85" cy="130" rx="10" ry="6.5" fill="${body}" stroke="${INK}" stroke-width="3.5"/>`
    : `<ellipse cx="55" cy="130" rx="10" ry="6.5" fill="${dark}"/>
       <ellipse cx="85" cy="130" rx="10" ry="6.5" fill="${dark}"/>`;

  let bodyShape, face;
  if (styleDir === 'b') {
    bodyShape = `
      <rect x="35" y="24" width="70" height="104" rx="35" fill="${body}"/>
      <ellipse cx="53" cy="38" rx="7" ry="12" fill="#fff" opacity=".18" transform="rotate(18 53 38)"/>
      <path d="M37 88 q33 12 66 0" stroke="${dark}" stroke-width="2.5" fill="none" opacity=".45"/>
      <circle cx="70" cy="102" r="7.5" fill="${dark}"/><circle cx="70" cy="102" r="3.5" fill="${glow}"/>`;
    face = `
      <rect x="44" y="44" width="52" height="26" rx="13" fill="#26231f"/>
      <rect x="48" y="47" width="18" height="5" rx="2.5" fill="#fff" opacity=".18"/>
      ${visorEyes(ex, glow)}`;
  } else if (styleDir === 'c') {
    bodyShape = `
      <rect x="35" y="24" width="70" height="104" rx="35" fill="${body}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="70" cy="100" rx="22" ry="18" fill="${light}"/>`;
    face = `
      ${expressionSVG(ex, INK)}
      <path d="M46 66 l7 -3 M46 71 l7 -3 M94 66 l-7 -3 M94 71 l-7 -3" stroke="${hsl(hue, 45, 48)}" stroke-width="2.5" stroke-linecap="round"/>`;
  } else {
    bodyShape = `
      <rect x="35" y="24" width="70" height="104" rx="35" fill="${body}"/>
      <ellipse cx="70" cy="100" rx="23" ry="19" fill="${light}" opacity=".8"/>`;
    face = `
      <rect x="45" y="40" width="50" height="37" rx="18.5" fill="${CREAM}"/>
      ${expressionSVG(ex, INK)}
      <circle cx="50" cy="70" r="3.6" fill="${hsl(hue, 55, 72)}"/>
      <circle cx="90" cy="70" r="3.6" fill="${hsl(hue, 55, 72)}"/>`;
  }

  const workFx = state === 'working' ? `
    <g style="animation:oj-blink .5s steps(2) infinite">
      <path d="M126 70 l7 -6 M129 80 l9 -2 M123 60 l4 -9" stroke="${hsl(hue, 50, 42)}" stroke-width="3" stroke-linecap="round" fill="none"/>
    </g>` : '';

  const badge = state === 'fumble' ? `
    <g style="transform-box:fill-box;transform-origin:center;animation:oj-pulse 1s ease-in-out infinite">
      <path d="M104 8 L114 26 H94 Z" fill="#b2622d" stroke="#b2622d" stroke-width="7" stroke-linejoin="round"/>
      <text x="104" y="24" text-anchor="middle" font-family="Figtree, sans-serif" font-weight="700" font-size="13" fill="${CREAM}">!</text>
    </g>` : '';

  return `<svg width="${size}" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;display:block">
  <g style="transform-box:fill-box;transform-origin:50% 100%;animation:${outerAnim}">
    ${feet}
    ${arm('M40 86 Q26 94 29 106')}
    ${bodyShape}
    ${face}
    ${gearSVG(gear, oc, hue)}
    <g style="transform-box:fill-box;transform-origin:12% 18%;${armAnim}">
      ${arm('M100 86 Q114 92 113 102')}
      <g transform="translate(115 98)${state === 'fumble' ? ' rotate(32)' : ''}">${propSVG(prop, oc)}</g>
    </g>
    ${workFx}
    ${badge}
  </g>
</svg>`;
}
