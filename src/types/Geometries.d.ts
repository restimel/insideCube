
/** [x, y, z] */
export type Vertex = [number, number, number];

/** [x, y] */
export type Point = [number, number];

export type Options = {
    /** % from second direction */
    position: number;
    /** % from first direction */
    width: number;
    /** % from second direction */
    height: number;
    type: 'slot' | 'text' | 'rect';
    detail?: string;
    reverse?: boolean;
};

export type Rect = {
    type?: 'rect';
    fill: string;
    stroke: string;
    points: Vertex[];
    adds?: Shape[];
    gradient?: boolean;
};

export type Txt = {
    type: 'text';
    fill: string;
    stroke: string;
    text: Vertex[][];
    box: [Vertex, Vertex];
};

export type Shape = Rect | Txt;

export type RectProjection = {
    type: 'rect',
    fill: string;
    stroke: string;
    points: Point[];
    zMin: number;
    zMax: number;
    box: [Point, Point];
    adds: ShapeProjection[];
    gradient?: boolean;
};

export type TextProjection = {
    type: 'text',
    fill: string;
    stroke: string;
    gradient?: boolean;
    text: Vertex[][];
    zMin: number;
    zMax: number;
    box: [Point, Point];
};

export type ShapeProjection = RectProjection | TextProjection;
