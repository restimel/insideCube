import type {
    AllCubes,
    Cube,
    Dimensions,
    SimplifiedCell,
    SimplifiedCube,
    SimplifiedLevel,
} from '@/types/Cube';

/**
 * Creates a deep copy of a given Cube object.
 *
 * @param cube - The Cube object to be copied.
 * @returns A new Cube object that is a deep copy of the input cube.
 */
export function copyCube(cube: Cube): Cube {
    return {
        name: cube.name,
        color: cube.color,
        start: { ...cube.start },
        end: { ...cube.end },
        levels: cube.levels.map((level) => ({
            name: level.name,
            cmt: level.cmt,
            lid: !!level.lid,
            cells: level.cells.map((row) =>
                row.map((cell) =>
                    ({ ...cell })
                )
            ),
        })),
    };
}

/**
 * Creates a new Cube object with default values.
 *
 * @returns A new Cube object with default name, color, and empty levels.
 */
export function createNewCube(dimensions: Dimensions): Cube {
    return {
        name: '',
        color: '#000000',
        start: { x: 1, y: 1, z: 0 },
        end: {
            x: dimensions.cells - 2,
            y: dimensions.rows - 2,
            z: dimensions.levels - 1,
        },
        levels: Array.from({ length: dimensions.levels }, (_, level) => ({
            name: `Level ${level + 1}`,
            lid: level === dimensions.levels - 1,
            cells: Array.from({ length: dimensions.rows }, () =>
                Array.from({ length: dimensions.cells }, () =>
                    ({})
                )
            ),
        })),
    };
}

/*
 * Use only hex color
 * conversion is mainly for retro-compatibility
 */
const mapColor = new Map([
    ['black', '#222623'],
    ['blue', '#3060e0'],
    ['brown', '#8b4513'],
    ['crystal', '#ffffff'],
    ['green', '#32cd32'],
    ['orange', '#ff8d1e'],
    ['red', '#ff0000'],
    ['yellow', '#ffff00'],
    ['pink', '#ff1493'],
]);
function fromColor(color: string): string {
    return mapColor.get(color) ?? color;
}


/**
 * Converts to a `Cube` object, ensuring that all mains property are set.
 * It should support the format of InsideWeCube
 *
 * @param {AllCubes} cube - The input cube object that needs to be converted.
 * @returns {Cube} - The newly created `Cube` object with complete properties.
 */
export function toCompleteCube(cube: AllCubes): Cube {
    let start = cube.start;
    let end = cube.end;

    if (!start) {
        start = { x: 1, y: 1, z: 0 };
    } else
        if (Array.isArray(start)) {
            start = { x: start[1], y: start[0], z: start[2] };
        }

    if (!end) {
        end = {
            x: cube.levels[0].cells[0].length - 2,
            y: cube.levels[0].cells.length - 2,
            z: cube.levels.length - 1,
        };
    } else
        if (Array.isArray(end)) {
            end = { x: end[1], y: end[0], z: end[2] };
        }

    const newCube: Cube = {
        name: cube.name,
        color: fromColor(cube.color),
        start: start,
        end: end,
        levels: cube.levels.map((level) => {
            return {
                name: level.name,
                cmt: level.cmt,
                lid: !!level.lid,
                cells: level.cells.map((row) =>
                    row.map((cell) => {
                        return ({
                            r: !!cell.r,
                            d: !!cell.d,
                            b: !!cell.b,
                            s: cell.s,
                        });
                    })
                ),
            };
        }),
    };

    return newCube;
}

/**
 * Converts a cube structure into a simplified cube structure
 * (with minimal characters).
 *
 * @param {AllCubes} cube - The complex cube structure to be simplified.
 * @returns {SimplifiedCube} The simplified cube structure.
 */
export function toSimplifiedCube(cube: AllCubes): SimplifiedCube {
    const newCube: SimplifiedCube = {
        name: cube.name,
        color: cube.color,
        levels: cube.levels.map((level) => {
            const newLevel: SimplifiedLevel = {
                name: level.name,
                cells: level.cells.map((row) =>
                    row.map((cell) => {
                        const newCell: SimplifiedCell = {};

                        if (cell.r) {
                            newCell.r = 1;
                        }

                        if (cell.d) {
                            newCell.d = 1;
                        }

                        if (cell.b) {
                            newCell.b = 1;
                        }

                        if (cell.s) {
                            newCell.s = cell.s;
                        }

                        return newCell;
                    })
                ),
            };

            if (level.cmt) {
                newLevel.cmt = level.cmt;
            }

            if (level.lid) {
                newLevel.lid = 1;
            }

            return newLevel;
        }),
    };

    if (cube.start) {
        let x: number;
        let y: number;
        let z: number;

        if (Array.isArray(cube.start)) {
            [y, x, z] = cube.start;
        } else {
            x = cube.start.x;
            y = cube.start.y;
            z = cube.start.z;
        }

        if (x !== 1 || y !== 1 || z !== 1 ) {
            newCube.start = [y, x, z];
        }
    }

    if (cube.end) {
        let x: number;
        let y: number;
        let z: number;

        if (Array.isArray(cube.end)) {
            [y, x, z] = cube.end;
        } else {
            x = cube.end.x;
            y = cube.end.y;
            z = cube.end.z;
        }

        if (
            x !== cube.levels[0].cells[0].length - 2 ||
            y !== cube.levels[0].cells.length - 2 ||
            z !== cube.levels.length -1
        ) {
            newCube.end = [y, x, z];
        }
    }

    return newCube;
}
