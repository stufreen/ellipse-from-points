const Matrix = require('functional-matrix');

// See: https://stackoverflow.com/questions/3441782/how-to-calculate-the-angle-of-a-vector-from-the-vertical
const getAngle = (v1) => {
  return Math.atan2(v1.y, v1.x);
};

// See: https://math.stackexchange.com/questions/163920/how-to-find-an-ellipse-given-five-points
const getConic = (points) => {
  const equations = points.map(({ x, y }) => {
    return [Math.pow(x, 2), x * y, Math.pow(y, 2), x, y, 1];
  })

  equations.unshift([0,0,0,0,0,0]); // Will not be used

  const matrix = new Matrix(equations);

  const determinants = equations.map((row, i) => {
    const minor = matrix.minor(0, i);
    return minor.determinant();
  });

  const ellipse = determinants.map((val, i) => {
    return i % 2 === 0 ? val : val * -1;
  });

  return ellipse;
}

const isEllipse = (a, b, c, d, e, f) => {
  return Math.pow(b, 2) - (4 * a * c) <= 0;
}

const getCenter = (a, b, c, d, e, f) => {
  return {
    x: ((2 * c * d) - (b * e)) /( Math.pow(b, 2) - (4 * a * c)),
    y: ((2 * a * e) - (d * b)) /( Math.pow(b, 2) - (4 * a * c)),
  }
};

const getRotation = (a, b, c, d, e, f) => {
  const tan2theta = b / (a - c);
  let theta = Math.atan(tan2theta) / 2;
  if(a > c) {
    theta += Math.PI / 2;
  }
  return theta;
};

const unRotate = ([a, b, c, d, e, f], theta) => {
  const ct = Math.cos(theta);
  const st = Math.sin(theta);

  const aPrime = (a * Math.pow(ct, 2)) + (b * ct * st) + (c * Math.pow(st, 2));
  const bPrime = 0;
  const cPrime = (a * Math.pow(st, 2)) - (b * ct * st) + (c * Math.pow(ct, 2));
  const dPrime = (d * ct) + (e & st);
  const ePrime = (-1 * d * st) + (e * ct);
  const fPrime = f;

  return [aPrime, bPrime, cPrime, dPrime, ePrime, fPrime];
};

// See: https://math.stackexchange.com/questions/280937/finding-the-angle-of-rotation-of-an-ellipse-from-its-general-equation-and-the-ot
const getWidthHeight = (a, b, c, d, e, f) => {
  const theta = getRotation(a, b, c, d, e, f);
  const [aP, bP, cP, dP, eP, fP] = unRotate([a, b, c, d, e, f], theta);

  const w = Math.abs((-1 * dP) / (2 * aP));
  const h = Math.abs((-1 * eP) / (2 * cP));

  return {
    width: w,
    height: h,
  };
};

// To do: Distance to ellipse function
// http://www.am.ub.edu/~robert/Documents/ellipse.pdf
const getDistance = (conic, p) => {
  const theta = getRotation(...conic);
  const center = getCenter(...conic);
  const { width, height } = getWidthHeight(...conic);

  const pT = { x: p.x - width, y: p.y - height };

  const pP = {
    x: (pT.x * Math.cos(-1 * theta)) - (pT.y * Math.sin(-1 * theta)),
    y: (pT.y * Math.cos(-1 * theta)) + (pT.x * Math.sin(-1 * theta)),
  };

  console.log(pT, pP);

  const angle = getAngle(pP);

  const d = Math.sqrt(
      Math.pow(p.x - (width * Math.cos(angle)), 2) +
      Math.pow(p.y - (height * Math.sin(angle)), 2)
    );
  return d;
};

const points = [
  {
    x: 2,
    y: 1,
  },
  {
    x: 2,
    y: 2,
  },
  {
    x: 3,
    y: 4,
  },
  {
    x: 4.5,
    y: 4.5,
  },
  {
    x: 4,
    y: 2,
  },
];

const conic = getConic(points);

console.log(getConic(points));
console.log('isEllipse: ', isEllipse(...conic));

if(isEllipse(...conic)) {
  console.log('center:', getCenter(...conic));
  const theta = getRotation(...conic);
  console.log('rotation:', theta * (180 / Math.PI), 'degrees');
  console.log('dimensions:', getWidthHeight(...conic));
  console.log(getDistance(conic, { x: 5, y: 5 }));
}
