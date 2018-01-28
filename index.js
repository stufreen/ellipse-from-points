const Matrix = require('functional-matrix');

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
  const tan2theta = a > c ? b / (c - a) : b / (a - c);
  const theta = Math.atan(tan2theta) / 2;
  return theta;
};

const getWidthHeight = (a, b, c, d, e, f) => {
  const t = getRotation(a, b, c, d, e, f);
  const ct = Math.cos(t);
  const st = Math.sin(t);

  const aPrime = (a * Math.pow(ct, 2)) + (b * ct * st) + (c * Math.pow(st, 2));
  const bPrime = 0;
  const cPrime = (a * Math.pow(st, 2)) - (b * ct * st) + (c * Math.pow(ct, 2));
  const dPrime = (d * ct) + (e & st);
  const ePrime = (-1 * d * st) + (e * ct);
  const fPrime = f;

  const h = (-1 * dPrime) / (2 * aPrime);
  const w = (-1 * ePrime) / (2 * cPrime);

  return {
    height: h,
    width: w,
  }
};

const getEigen = (mtx) => {
  const eigen = new jsfeat.matrix_t(2, 2,  jsfeat.F32_t | jsfeat.C1_t);
  const jfMtx = new jsfeat.matrix_t(2, 2,  jsfeat.F32_t | jsfeat.C1_t);
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
}