function diagramText(horizontal, vertical, label, color = '#334155') {
  return `<text x="${horizontal}" y="${vertical}" fill="${color}" stroke="none" font-size="16">${label}</text>`;
}

function diagramLine(start, end, extra = '') {
  return `<line x1="${start[0]}" y1="${start[1]}" x2="${end[0]}" y2="${end[1]}" ${extra}/>`;
}

function diagramShape(points, extra = '') {
  return `<polygon points="${points.map(point => point.join(',')).join(' ')}" fill="none" ${extra}/>`;
}

function coordinateDiagram(vertices, extraPoint, extraLabel) {
  const project = ([horizontal, vertical]) => [50 + (horizontal + 4) * 32, 40 + (5 - vertical) * 32];
  const grid = Array.from({ length: 12 }, (_, index) => index - 4).map(value =>
    diagramLine(project([value, -4]), project([value, 5]), 'stroke="#e2e8f0" stroke-width="1"') +
    diagramText(project([value, 0])[0] - 4, project([value, 0])[1] + 19, value)
  ).join('') + Array.from({ length: 10 }, (_, index) => index - 4).map(value =>
    diagramLine(project([-4, value]), project([7, value]), 'stroke="#e2e8f0" stroke-width="1"') +
    (value === 0 ? '' : diagramText(project([0, value])[0] - 23, project([0, value])[1] + 5, value))
  ).join('');
  const labels = vertices.map(([label, horizontal, vertical]) => {
    const [screenX, screenY] = project([horizontal, vertical]);
    return `<circle cx="${screenX}" cy="${screenY}" r="3" fill="#4338ca"/>` + diagramText(screenX + 6, screenY - 10, label);
  }).join('');
  const [pointX, pointY] = project(extraPoint);
  return grid + diagramLine(project([-4, 0]), project([7, 0])) + diagramLine(project([0, -4]), project([0, 5])) +
    diagramText(420, 216, 'x') + diagramText(188, 28, 'y') +
    diagramShape(vertices.map(([, horizontal, vertical]) => project([horizontal, vertical])), 'stroke="#4338ca"') + labels +
    `<circle cx="${pointX}" cy="${pointY}" r="4" fill="#be123c" stroke="none"/>` + diagramText(pointX + 8, pointY + 22, extraLabel, '#be123c');
}

function symmetryDiagram() {
  const polygon = (centerX, star) => {
    const vertices = Array.from({ length: 12 }, (_, index) => {
      const angle = index * Math.PI / 6 - Math.PI / 2;
      return [centerX + 80 * Math.cos(angle), 145 + 80 * Math.sin(angle)];
    });
    return diagramShape(vertices) + vertices.filter((_, index) => index % 3 === 0).map(([horizontal, vertical], index) =>
      star && index === 0
        ? `<path d="M ${horizontal} ${vertical - 11} l 3 7 8 1 -6 5 2 8 -7 -4 -7 4 2 -8 -6 -5 8 -1 Z" fill="#be123c" stroke="white"/>`
        : `<circle cx="${horizontal}" cy="${vertical}" r="6" fill="#4338ca" stroke="white"/>`
    ).join('');
  };
  return polygon(125, false) + polygon(355, true) + diagramText(95, 270, 'Part (c)') + diagramText(325, 270, 'Part (d)');
}

function constructionDiagram(solution = false) {
  const base = diagramLine([60, 255], [300, 255]) + diagramText(40, 278, 'A') + diagramText(303, 278, 'B') +
    diagramText(170, 279, '8 cm') + diagramLine([60, 255], [420, 47], 'stroke="#4338ca"') +
    '<path d="M 103 255 A 43 43 0 0 0 97 233" fill="none"/>' + diagramText(112, 243, '30°');
  if (!solution) return base + diagramText(200, 32, 'C lies on the ray; BC = 5 cm');
  const nearer = [162.0577, 196.0770];
  const farther = [317.9423, 106.0770];
  return base + '<circle cx="300" cy="255" r="150" fill="none" stroke="#94a3b8" stroke-dasharray="5 5"/>' +
    diagramLine([300, 255], nearer, 'stroke="#be123c"') + diagramLine([300, 255], farther, 'stroke="#be123c"') +
    `<circle cx="${nearer[0]}" cy="${nearer[1]}" r="4" fill="#be123c"/>` +
    `<circle cx="${farther[0]}" cy="${farther[1]}" r="4" fill="#be123c"/>` +
    diagramText(128, 185, 'C₁') + diagramText(326, 98, 'C₂');
}

function geometryDiagram(questionId) {
  let drawing = '';
  let description = '';
  let height = 320;
  switch (questionId) {
    case 1:
      description = 'Intersecting lines AC and BD, perpendicular ray OE, and ray OF inside angle AOB.';
      drawing = diagramLine([50, 180], [430, 180]) + diagramLine([187, 297], [293, 63]) +
        diagramLine([240, 180], [240, 40], 'stroke="#0f766e"') + diagramLine([240, 180], [350, 74], 'stroke="#be123c" stroke-dasharray="5 4"') +
        '<path d="M 240 160 H 260 V 180" fill="none"/>' +
        [[437, 186, 'A'], [297, 54, 'B'], [30, 186, 'C'], [170, 315, 'D'], [230, 30, 'E'], [356, 72, 'F'], [244, 202, 'O']].map(args => diagramText(...args)).join('') +
        diagramText(300, 160, '5x − 4') + diagramText(105, 222, '3x + 24') + diagramText(140, 100, '∠BOE = 2y + 4');
      break;
    case 2:
      description = 'Obtuse triangle ABC with D on AB, E on AC, DE parallel to BC, and BC extended to F.';
      drawing = diagramShape([[80, 40], [150, 245], [390, 245]]) + diagramLine([115, 142.5], [235, 142.5], 'stroke="#0f766e"') +
        diagramLine([390, 245], [455, 245]) + '<path d="M 174 136 l 8 6 -8 6 M 262 239 l 8 6 -8 6" fill="none" stroke="#0f766e"/>' +
        [[60, 30, 'A'], [129, 267, 'B'], [385, 268, 'C'], [90, 150, 'D'], [244, 137, 'E'], [455, 268, 'F']].map(args => diagramText(...args)).join('') +
        diagramText(150, 100, '2x + 16') + diagramText(126, 179, '7x + 1') + diagramText(305, 231, '3x + 5');
      break;
    case 3:
      description = 'Isosceles triangle ABC with D strictly between B and C. AB equals AC; AD equals BD.';
      drawing = diagramShape([[240, 95], [50, 245], [430, 245]]) + diagramLine([240, 95], [204.21, 245]) +
        '<path d="M 136 163 l 12 15 M 330 178 l 12 -15 M 212 168 l 18 4 M 211 175 l 18 4 M 122 237 v 16 M 129 237 v 16" fill="none"/>' +
        [[233, 78, 'A'], [30, 268, 'B'], [433, 268, 'C'], [195, 268, 'D'], [206, 139, 't']].map(args => diagramText(...args)).join('');
      break;
    case 4:
      description = 'Convex quadrilateral ABCD in vertex order, with the internal bisectors at A and B meeting at U.';
      drawing = diagramShape([[50, 260], [430, 260], [378.01, 100], [270.22, 100]]) +
        diagramLine([50, 260], [312.57, 174.68], 'stroke="#be123c" stroke-dasharray="5 4"') + diagramLine([430, 260], [312.57, 174.68], 'stroke="#be123c" stroke-dasharray="5 4"') +
        [[30, 282, 'A'], [437, 282, 'B'], [383, 92, 'C'], [254, 92, 'D'], [306, 165, 'U']].map(args => diagramText(...args)).join('') +
        diagramText(90, 309, '∠A : ∠B : ∠C : ∠D = 1 : 2 : 3 : 4');
      break;
    case 7:
      description = 'Coordinate grid showing the original triangle ABC and the given final point A double prime only.';
      height = 380;
      drawing = coordinateDiagram([['A', -3, 1], ['B', 0, 4], ['C', 2, 1]], [5, -3], "A''");
      break;
    case 8:
      description = 'Coordinate grid showing the original triangle PQR, centre K and the given final point P double prime.';
      height = 380;
      drawing = coordinateDiagram([['P', -2, 1], ['Q', 1, 1], ['R', -1, 3]], [2, -1], 'K') +
        '<circle cx="242" cy="200" r="4" fill="#be123c" stroke="none"/>' + diagramText(250, 190, "P''", '#be123c');
      break;
    case 9:
      description = 'Two regular dodecagons. The first has dots at every third vertex. The second replaces the top dot with a star.';
      drawing = symmetryDiagram();
      break;
    case 11:
      description = 'Convex kite ABCD with diagonals meeting at E. Only the given pairs AB equals AD and CB equals CD are marked.';
      drawing = diagramShape([[240, 30], [120, 120], [240, 290], [360, 120]]) +
        diagramLine([240, 30], [240, 290], 'stroke="#94a3b8"') + diagramLine([120, 120], [360, 120], 'stroke="#94a3b8"') +
        '<path d="M 173 68 l 12 16 M 295 84 l 12 -16 M 171 203 l 16 -12 M 177 211 l 16 -12 M 287 199 l 16 12 M 293 191 l 16 12" fill="none"/>' +
        [[233, 20, 'A'], [98, 126, 'B'], [233, 313, 'C'], [367, 126, 'D'], [250, 143, 'E']].map(args => diagramText(...args)).join('');
      break;
    case 12:
      description = 'Construction setup for parts c and d: AB is 8 centimetres and a ray from A makes 30 degrees with AB. C lies on the ray and BC is 5 centimetres.';
      drawing = constructionDiagram();
      break;
    default:
      return '';
  }
  return `<figure class="geometry-figure"><svg viewBox="0 0 480 ${height}" role="img" aria-label="${description}" xmlns="http://www.w3.org/2000/svg" stroke="#334155" stroke-width="2" stroke-linejoin="round"><title>${description}</title>${drawing}</svg><figcaption>${questionId === 7 || questionId === 8 ? 'Coordinate grid: 1 unit per square.' : 'Schematic diagram; not to scale.'}</figcaption></figure>`;
}
