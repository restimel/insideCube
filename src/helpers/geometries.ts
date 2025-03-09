import type {
    Options,
    Point,
    Rect,
    Shape,
    ShapeProjection,
    TextProjection,
    Txt,
    Vertex,
} from '@/types/Geometries';

export function midPoint(p1: Vertex, p2: Vertex): Vertex {
    return [
        (p1[0] + p2[0]) / 2,
        (p1[1] + p2[1]) / 2,
        (p1[2] + p2[2]) / 2,
    ];
}

type Direction = 'xy' | 'xz' | 'yx' | 'yz' | 'zx' | 'zy';

export function widthHeight([x1, y1, z1]: Vertex, [x2, y2, z2]: Vertex): [number, number, Direction] {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const dz = Math.abs(z2 - z1);
    let w: number;
    let h: number;
    let dir: Direction;

    if (dy === 0) {
        w = Math.max(dx, dz);
        h = Math.min(dx, dz);
        dir = dx < dz ? 'zx' : 'xz';
    } else
        if (dx === 0) {
            w = Math.max(dy, dz);
            h = Math.min(dy, dz);
            dir = dy < dz ? 'zy' : 'yz';
        } else {
            w = Math.max(dx, dy);
            h = Math.min(dx, dy);
            dir = dx < dy ? 'yx' : 'xy';
        }

    return [w, h, dir];
}

export function text(txt: string, p1: Vertex, p2: Vertex, fill: string, stroke: string, reverse = false): Txt {
    const strShape = drawString(txt, [p1, p2], reverse);

    return {
        type: 'text',
        fill,
        stroke,
        text: strShape,
        box: [p1 ,p2],
    };
}

export function rect([x1, y1, z1]: Vertex, [x2, y2, z2]: Vertex, fill: string, stroke: string, gradient?: boolean, adds?: Options[]): Rect {
    let z3: number;
    let z4: number;

    if (y1 === y2) {
        z3 = z1;
        z4 = z2;
    } else
        if (x1 === x2) {
            z3 = z2;
            z4 = z1;
        } else {
            z3 = z1;
            z4 = z1;
        }

    const [w, h, dir] = widthHeight([x1, y1, z1], [x2, y2, z2]);

    const points: Vertex[] = [
        [x1, y1, z1],
        [x2, y1, z3],
        [x2, y2, z2],
        [x1, y2, z4],
        [x1, y1, z1],
    ];

    function getBox(position: number, width: number, height: number): [Vertex, Vertex] {
        const cHeight = h * height;
        const cWidth = Math.min(w * width, w);
        const top = Math.max(0, Math.min(h - cHeight, h * position - cHeight / 2));
        const bottom = top + cHeight;
        const left = (w - cWidth) / 2;
        const right = left + cWidth;

        switch (dir) {
        case 'xy':
            return [
                [x1 + left, y1 + top, z1],
                [x1 + right, y1 + bottom, z1],
            ];
        case 'xz':
            return [
                [x1 + left, y1, z1 + top],
                [x1 + right, y1, z1 + bottom],
            ];
        case 'yx':
            return [
                [x1 + top, y1 + left, z1],
                [x1 + bottom, y1 + right, z1],
            ];
        case 'yz':
            return [
                [x1, y1 + left, z1 + top],
                [x1, y1 + right, z1 + bottom],
            ];
        case 'zx':
            return [
                [x1 + top, y1, z1 + left],
                [x1 + bottom, y1, z1 + right],
            ];
        case 'zy':
            return [
                [x1, y1 + top, z1 + left],
                [x1, y1 + bottom, z1 + right],
            ];
        }
    }

    const additional = adds?.map((add) => {
        const [p1, p2] = getBox(add.position, add.width, add.height);

        switch (add.type) {
        case 'text': {
            return text(add.detail ?? '', p1, p2, stroke, 'none', add.reverse);
        }
        case 'slot': {
            return rect(p1, p2, stroke, 'transparent');
        }
        case 'rect': {
            return rect(p1, p2, 'transparent', add.detail ?? stroke);
        }
        }
    });

    return {
        type: 'rect',
        fill,
        stroke,
        points,
        adds: additional,
        gradient: gradient,
    };
}

const DARKEN = 0.8;
function darken(val: string) {
    const value = parseInt(val, 16);
    const darkValue = Math.round(value * DARKEN);
    const strValue = darkValue.toString(16);

    if (strValue.length < 2) {
        return '0' + strValue;
    }

    return strValue;
}

type Details = {
    front?: Options[];
    back?: Options[];
    top?: Options[];
    bottom?: Options[];
    left?: Options[];
    right?: Options[];
};

export function cube(center: Vertex, dimension: [number, number, number], fill: string, stroke: string, adds: Details = {}): Shape[] {
    const color = fill.slice(1).split(/([a-z]{2})/i).filter(Boolean);
    const colorFront = fill;
    const colorBack = [
        '#',
        darken(color[0]),
        darken(color[1]),
        darken(color[2]),
    ].join('');

    const fillFront = colorFront;
    const fillBack = colorBack;

    const [cX, cY, cZ] = center;
    const offsetX = dimension[0] / 2;
    const offsetY = dimension[1] / 2;
    const offsetZ = dimension[2] / 2;

    const shapes: Shape[] = [
        /* front */
        rect(
            [cX - offsetX, cY - offsetY, cZ + offsetZ],
            [cX + offsetX, cY + offsetY, cZ + offsetZ],
            fillFront,
            stroke,
            true,
            adds.front
        ),
        /* back */
        rect(
            [cX - offsetX, cY - offsetY, cZ - offsetZ],
            [cX + offsetX, cY + offsetY, cZ - offsetZ],
            fillBack,
            stroke,
            true,
            adds.back
        ),
        /* top */
        rect(
            [cX - offsetX, cY - offsetY, cZ - offsetZ],
            [cX + offsetX, cY - offsetY, cZ + offsetZ],
            fillFront,
            stroke,
            true,
            adds.top
        ),
        /* bottom */
        rect(
            [cX - offsetX, cY + offsetY, cZ - offsetZ],
            [cX + offsetX, cY + offsetY, cZ + offsetZ],
            fillBack,
            stroke,
            true,
            adds.bottom
        ),
        /* left */
        rect(
            [cX - offsetX, cY - offsetY, cZ - offsetZ],
            [cX - offsetX, cY + offsetY, cZ + offsetZ],
            fillBack,
            stroke,
            true,
            adds.left
        ),
        /* right */
        rect(
            [cX + offsetX, cY - offsetY, cZ - offsetZ],
            [cX + offsetX, cY + offsetY, cZ + offsetZ],
            fillFront,
            stroke,
            true,
            adds.right
        ),
    ];

    return shapes;
}

function drawChar(char: string, size: number): Point[] {
    const midSize = size / 2;
    const maxWidth = midSize * 0.7;

    switch (char) {
    case 'B':
        return [
            [-maxWidth, -midSize],
            [maxWidth * 0.3, -midSize],
            [maxWidth, -midSize * 0.5],
            [maxWidth * 0.3, 0],
            [-maxWidth, 0],
            [maxWidth * 0.3, 0],
            [maxWidth, midSize * 0.5],
            [maxWidth * 0.3, midSize],
            [-maxWidth, midSize],
            [-maxWidth, -midSize],
        ];
    case 'C':
        return [
            [maxWidth, -midSize],
            [0, -midSize],
            [-maxWidth * 0.5, -midSize * 0.9],
            [-maxWidth, 0],
            [-maxWidth * 0.5, midSize * 0.9],
            [0, midSize],
            [maxWidth, midSize],
        ];
    case 'D':
        return [
            [-maxWidth, -midSize],
            [0, -midSize],
            [maxWidth * 0.5, -midSize * 0.8],
            [maxWidth * 0.95, 0],
            [maxWidth, 0],
            [maxWidth * 0.95, 0],
            [maxWidth * 0.5, midSize * 0.8],
            [0, midSize],
            [-maxWidth, midSize],
            [-maxWidth, -midSize],
        ];
    case 'E':
        return [
            [maxWidth, -midSize],
            [-maxWidth, -midSize],
            [-maxWidth, 0],
            [maxWidth, 0],
            [-maxWidth, 0],
            [-maxWidth, midSize],
            [maxWidth, midSize],
        ];
    case 'I':
        return [
            [0, -midSize],
            [0, midSize],
        ];
    case 'L':
        return [
            [-maxWidth, -midSize],
            [-maxWidth, midSize],
            [0, midSize * 0.8],
        ];
    case 'M':
        return [
            [-maxWidth, midSize],
            [-maxWidth, -midSize],
            [0, 0],
            [maxWidth, -midSize],
            [maxWidth, midSize],
        ];
    case 'N':
        return [
            [-maxWidth, midSize],
            [-maxWidth, -midSize],
            [maxWidth, midSize],
            [maxWidth, -midSize],
        ];
    case 'O':
        return [
            [0, -midSize],
            [-maxWidth * 0.5, -midSize * 0.8],
            [-maxWidth, 0],
            [-maxWidth * 0.5, midSize * 0.8],
            [0, midSize],
            [maxWidth * 0.5, midSize * 0.8],
            [maxWidth, 0],
            [maxWidth * 0.5, -midSize * 0.8],
            [0, -midSize],
        ];
    case 'S':
        return [
            [-maxWidth, midSize * 0.8],
            [-maxWidth * 0.6, midSize * 0.9],
            [0, midSize],
            [maxWidth * 0.5, midSize * 0.8],
            [maxWidth, midSize * 0.3],
            [maxWidth * 0.5, midSize * 0.1],
            [0, 0],
            [-maxWidth * 0.5, -midSize * 0.1],
            [-maxWidth, -midSize * 0.3],
            [-maxWidth * 0.5, -midSize * 0.8],
            [0, -midSize],
            [maxWidth * 0.6, -midSize * 0.9],
            [maxWidth, -midSize * 0.8],
        ];
    case 'U':
        return [
            [-maxWidth, -midSize],
            [-maxWidth, midSize * 0.8],
            [0, midSize],
            [maxWidth, midSize * 0.8],
            [maxWidth, -midSize],
        ];
    case 'Z':
        return [
            [-maxWidth, -midSize],
            [maxWidth, -midSize],
            [-maxWidth, midSize],
            [maxWidth, midSize],
        ];

    case 'b':
        return [
            [-maxWidth, midSize * 0.1],
            [-maxWidth * 0.5, 0],
            [0, 0],
            [maxWidth * 0.5, midSize * 0.2],
            [maxWidth, midSize * 0.5],
            [maxWidth * 0.5, midSize * 0.8],
            [0, midSize],
            [-maxWidth * 0.5, midSize],
            [-maxWidth, midSize * 0.9],
            [-maxWidth, -midSize],
        ];
    case 'c':
        return [
            [maxWidth * 0.5, 0],
            [0, 0],
            [-maxWidth * 0.5, midSize * 0.2],
            [-maxWidth, midSize * 0.5],
            [-maxWidth * 0.5, midSize * 0.8],
            [0, midSize],
            [maxWidth * 0.5, midSize],
        ];
    case 'd':
        return [
            [maxWidth, midSize * 0.1],
            [maxWidth * 0.5, 0],
            [0, 0],
            [-maxWidth * 0.5, midSize * 0.2],
            [-maxWidth, midSize * 0.5],
            [-maxWidth * 0.5, midSize * 0.8],
            [0, midSize],
            [maxWidth * 0.5, midSize],
            [maxWidth, midSize * 0.9],
            [maxWidth, -midSize],
        ];
    case 'e':
        return [
            [0, midSize * 0.5],
            [maxWidth, midSize * 0.5],
            [maxWidth * 0.5, midSize * 0.2],
            [0, 0],
            [-maxWidth * 0.5, midSize * 0.2],
            [-maxWidth, midSize * 0.5],
            [-maxWidth * 0.5, midSize * 0.8],
            [0, midSize],
            [maxWidth, midSize],
        ];
    case 'i':
        return [
            [0, midSize],
            [0, 0],
        ];
    case 'n':
        return [
            [-maxWidth, midSize],
            [-maxWidth, 0],
            [-maxWidth, midSize * 0.1],
            [0, 0],
            [maxWidth, midSize * 0.1],
            [maxWidth, midSize],
        ];
    case 'm':
        return [
            [-maxWidth, midSize],
            [-maxWidth, 0],
            [-maxWidth, midSize * 0.1],
            [-maxWidth * 0.5, 0],
            [0, midSize * 0.1],
            [0, midSize],
            [0, midSize * 0.1],
            [maxWidth * 0.5, 0],
            [maxWidth, midSize * 0.1],
            [maxWidth, midSize],
        ];
    case 'o':
        return [
            [0, 0],
            [-maxWidth * 0.5, midSize * 0.2],
            [-maxWidth, midSize * 0.5],
            [-maxWidth * 0.5, midSize * 0.8],
            [0, midSize],
            [maxWidth * 0.5, midSize * 0.8],
            [maxWidth, midSize * 0.5],
            [maxWidth * 0.5, midSize * 0.2],
            [0, 0],
        ];
    case 's':
        return [
            [-maxWidth, midSize * 0.9],
            [0, midSize],
            [maxWidth, midSize * 0.75],
            [0, midSize * 0.5],
            [-maxWidth, midSize * 0.25],
            [0, 0],
            [maxWidth, midSize * 0.1],
        ];
    case 'u':
        return [
            [-maxWidth, 0],
            [-maxWidth, midSize * 0.8],
            [0, midSize],
            [maxWidth, midSize * 0.9],
            [maxWidth, 0],
            [maxWidth, midSize],
        ];
    case 'z':
        return [
            [-maxWidth, 0],
            [maxWidth, 0],
            [-maxWidth, midSize],
            [maxWidth, midSize],
        ];
    case '³':
        return [
            [-maxWidth, -midSize],
            [0, -midSize * 0.75],
            [-maxWidth * 0.5, -midSize * 0.5],
            [0, -midSize * 0.25],
            [-maxWidth, 0],
        ];
    case '.':
        return [
            [-maxWidth * .2, midSize],
            [-maxWidth * .1, midSize],
            [-maxWidth * .1, midSize * 0.9],
            [-maxWidth * .2, midSize * 0.9],
            [-maxWidth * .2, midSize],
        ];
    }

    return [];
}

export function drawString(str: string, box: [Vertex, Vertex], reverse = false): Vertex[][] {
    const strLength = str.length;
    const center = midPoint(box[0], box[1]);
    const [w, h, dir] = widthHeight(box[0], box[1]);
    const size = Math.min(h, w / strLength);
    const start = -strLength * size / 2;
    const order = reverse ? -1 : 1;

    const list = Array.from(str, ((char, idx) => {
        const charPts = drawChar(char, size);

        return charPts.map((point) => {
            const startChar = ( point[0] + start + size * idx ) * order;

            switch (dir) {
            case 'zx':
                return [
                    point[1] + center[0],
                    center[1],
                    startChar + center[2],
                ] as Vertex;
            case 'zy':
                return [
                    center[0],
                    point[1] + center[1],
                    startChar + point[1] + center[2],
                ] as Vertex;

            case 'yx':
                return [
                    point[1] + center[0],
                    startChar + center[1],
                    center[2],
                ] as Vertex;
            case 'yz':
                return [
                    center[0],
                    startChar + center[1],
                    point[1] + center[2],
                ] as Vertex;
            case 'xz':
                return [
                    startChar + center[0],
                    center[1],
                    point[1] + center[2],
                ] as Vertex;
            case 'xy':
            default:
                return [
                    startChar + center[0],
                    point[1] + center[1],
                    center[2],
                ] as Vertex;
            }
        });
    }));

    return list;
}

function rotate(x: number, y: number, r: number): Point {
    if (!r) {
        return [x, y];
    }

    const dist = Math.sqrt(x * x + y * y);

    if (!dist) {
        return [x, y];
    }

    const angleOrig = Math.acos(x / dist) * (y >= 0 ? 1 : -1);

    const x2 = Math.cos(r + angleOrig) * dist;
    const y2 = Math.sin(r + angleOrig) * dist;

    return [x2, y2];
}

/**
 * @param {Number} rX - in radian
 * @param {Number} rY - in radian
 * @param {Number} rZ - in radian
 */
export function shapeProjection(shapes: Shape[], rX: number, rY: number, rZ: number): ShapeProjection[] {
    function projection(vertex: Vertex): Vertex {
        let [x, y, z] = vertex;

        [y, x] = rotate(y, x, rZ);
        [z, y] = rotate(z, y, rX);
        [x, z] = rotate(x, z, rY);

        return [x, y, z];
    }

    const shapeProjections: ShapeProjection[] = shapes.map((shape) => {
        switch (shape.type) {
        case 'text': {
            const shapeText = shape.text.map((char) => char.map((point) => projection(point)));

            const points: Point[] = [];
            let xMin = Infinity;
            let xMax = -Infinity;
            let yMin = Infinity;
            let yMax = -Infinity;
            let zMin = Infinity;
            let zMax = -Infinity;

            for (const charPoints of shapeText) {
                for (const vertex of charPoints) {
                    const [x, y, z] = vertex;

                    points.push([x, y]);
                    xMin = Math.min(xMin, x);
                    xMax = Math.max(xMax, x);
                    yMin = Math.min(yMin, y);
                    yMax = Math.max(yMax, y);
                    zMin = Math.min(zMin, z);
                    zMax = Math.max(zMax, z);
                }
            }

            const box = [[xMin, yMin], [xMax, yMax]];

            return {
                type: 'text',
                fill: shape.fill,
                stroke: shape.stroke,
                text: shapeText,
                box,
                zMin,
                zMax,
            } as TextProjection;
        }
        case 'rect':
        default: {
            const projections = (shape as Rect).points.map((point) => projection(point));
            const points: Point[] = [];
            let xMin = Infinity;
            let xMax = -Infinity;
            let yMin = Infinity;
            let yMax = -Infinity;
            let zMin = Infinity;
            let zMax = -Infinity;

            for (const vertex of projections) {
                const [x, y, z] = vertex;

                points.push([x, y]);
                xMin = Math.min(xMin, x);
                xMax = Math.max(xMax, x);
                yMin = Math.min(yMin, y);
                yMax = Math.max(yMax, y);
                zMin = Math.min(zMin, z);
                zMax = Math.max(zMax, z);
            }

            const box: [Point, Point] = [[xMin, yMin], [xMax, yMax]];

            const additional = shape.adds ? shapeProjection(shape.adds, rX, rY, rZ) : undefined;

            return {
                type: 'rect',
                fill: shape.fill,
                stroke: shape.stroke,
                points,
                box,
                zMin,
                zMax,
                adds: additional,
                gradient: shape.gradient,
            } as ShapeProjection;
        }
        }
    });

    shapeProjections.sort((v1, v2) => {
        return v1.zMin - v2.zMin;
    });

    return shapeProjections;
}
