
export type Cell = {
    r?: number;
    d?: number;
    b?: number;
    s?: number;
};

export type CubeName = string;
export type LevelName = string;

export type CubeHistory = {
    timestamp: Date;
    description: string;
    cube: Cube;
    notUndoable: boolean;
};

export type Level = {
    name: LevelName;
    cells: Cell[][];
};

export type Cube = {
    name: CubeName;
    color: string;
    levels: Level[];
};
