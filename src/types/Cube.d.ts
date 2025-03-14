
export type Cell = {
    /** no wall on right (can go to right) */
    r?: boolean;
    /** no wall downside (can go downside) */
    d?: boolean;
    /** a hole bottom (can go bottom) */
    b?: boolean;
    /**
     * special:
     * 0: none
     * 2: pin inside maze (at top of level)
     * -2: pin under maze (at bottom of level)
     */
    s?: number;
};
export type SimplifiedCell = {
    /** no wall on right */
    r?: 1;
    /** no wall downside */
    d?: 1;
    /** a hole bottom */
    b?: 1;
    /**
     * special:
     * 0: none
     * 2: pin inside maze (at top of level)
     * -2: pin under maze (at bottom of level)
     */
    s?: number;
};

export type CellPosition = {
    /** column */
    x: number;
    /** row */
    y: number;
    /** level */
    z: number;
};

/** [row, column, level]  _(Format in InsideWeCube)_ */
export type SimpleCellPosition = [number, number, number];

export type Dimensions = {
    levels: number;
    rows: number;
    cells: number;
};

export type CubeName = string;
export type LevelName = string;

export type CubeHistory = {
    timestamp: Date;
    description: string;
    cube: Cube;
    notUndoable: boolean;
};

export type SimplifiedLevel = {
    name: LevelName;
    cmt?: string;
    cells: SimplifiedCell[][];
    lid?: 1;
};

export type Level = {
    name: LevelName;
    cmt?: string;
    cells: Cell[][];
    lid?: boolean;
};

export type SimplifiedCube = {
    name: CubeName;
    color: string;
    levels: SimplifiedLevel[];
    ghost?: SimpleCellPosition[];
    start?: SimpleCellPosition;
    end?: SimpleCellPosition;
};

export type Cube = {
    name: CubeName;
    color: string;
    levels: Level[];
    ghost?: CellPosition[];
    start: CellPosition;
    end: CellPosition;
};
export type CompleteCube = Cube;

export type AllCubes = SimplifiedCube | Cube | CompleteCube;

export type Tools =
    | 'hole'
    | 'stairs'
    | 'start'
    | 'finish'
    | 'pin'
    | 'delete';
