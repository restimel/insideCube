import { defineStore } from 'pinia';
import {
    copyCube,
    createNewCell,
    createNewCube,
    createNewLevel,
    createNewRow,
    toCompleteCube,
    toSimplifiedCube,
} from '@/utils/cubeOperations';

import type {
    Cube,
    CubeHistory,
    CubeName,
    Dimensions,
    HistoryDetail,
    Tools,
} from '@/types/Cube';

type CubeState = {
    cubes: Map<CubeName, Cube>;
    activeCube: Cube | null;
    history: CubeHistory[];
    historyIndex: number;
    tool: Tools;
    dimensions: Dimensions;
};

export const useCubeStore = defineStore('cube', {
    state: (): CubeState => ({
        cubes: new Map(),
        activeCube: null,
        dimensions: {
            levels: 7,
            rows: 6,
            cells: 6,
        },
        history: [],
        historyIndex: -1,
        tool: 'hole',
    }),

    getters: {
        /*
         * getSelectedCube: (state) => {
         *     return state.selectedCubeId !== null
         *         ? state.cubes[state.selectedCubeId]
         *         : null;
         * },
         */

        /*
         * getLevelsByCubeId: (state) => (index: number) => {
         *     return index >= 0 && index < state.cubes.length
         *         ? state.cubes[index].levels
         *         : [];
         * },
         */
    },

    actions: {
        /* {{{ cubes */

        getCubeByName(name: CubeName): Cube | undefined {
            return this.cubes.get(name);
        },

        setCube(cube: Cube, oldName?: CubeName): boolean {
            const name = oldName || cube.name;

            if (!name) {
                return false;
            }

            this.cubes.set(name, cube);

            if (name !== cube.name) {
                this.cubes.delete(name);
            }

            this.selectCube(cube.name);
            this.saveCubesToLocalStorage();

            return true;
        },

        createNewCube() {
            this.activeCube = createNewCube(this.dimensions);
        },

        deleteCube(cube: Cube): boolean {
            const result = this.cubes.delete(cube.name);

            this.selectCube();
            this.saveCubesToLocalStorage();
            return result;
        },

        /* }}} */
        /* {{{ active cube */

        selectCube(cube: Cube | CubeName = '', strictSelection = false): boolean {
            let activeCube: Cube;

            if (typeof cube === 'string') {
                let storeCube = cube && this.getCubeByName(cube);

                if (!storeCube) {
                    if (strictSelection) {
                        return false;
                    }

                    const firstCube = this.cubes.values().next().value;

                    if (!firstCube) {
                        return false;
                    }

                    storeCube = copyCube(firstCube);
                }

                activeCube = storeCube;
            } else {
                activeCube = copyCube(cube);
            }

            if (!activeCube) {
                if (!strictSelection) {
                    this.createNewCube();
                    return true;
                }

                return false;
            }

            this.activeCube = copyCube(activeCube);
            this.updateDimensions();

            return true;
        },

        updateCubeProperty(property: 'name' | 'color', value: string) {
            if (!this.activeCube) {
                this.createNewCube();
            }

            this.activeCube![property] = value;
            this.addToHistory('history.updateCube', { property });
        },

        updateCubeSize(dimension: keyof Dimensions, value: number) {
            const oldValue = this.dimensions[dimension];
            const activeCube = this.activeCube;

            if (oldValue === value || !activeCube) {
                return;
            }

            this.dimensions[dimension] = value;
            const isGreater = oldValue < value;
            const dimensions = this.dimensions;

            switch (dimension) {
                case 'levels':
                    if (isGreater) {
                        for (let idx = oldValue; idx < value; idx++) {
                            activeCube.levels[idx] = createNewLevel(dimensions, `Level ${idx + 1}`);
                        }
                    } else {
                        activeCube.levels = activeCube.levels.slice(0, value);
                    }
                    this.addToHistory('history.updateCubeDimension', { property: dimension });
                    break;
                case 'rows':
                    activeCube.levels.forEach((level) => {
                        if (isGreater) {
                            for (let idx = oldValue; idx < value; idx++) {
                                level.cells.push(createNewRow(dimensions));
                            }
                        } else {
                            level.cells = level.cells.slice(0, value);
                        }
                    });
                    this.addToHistory('history.updateLevelDimension', { property: dimension });
                    break;
                case 'cells':
                    activeCube.levels.forEach((level) => {
                        level.cells.forEach((row) => {
                            if (isGreater) {
                                for (let idx = oldValue; idx < value; idx++) {
                                    row.push(createNewCell());
                                }
                            } else {
                                row.splice(value, Infinity);
                            }
                        });
                    });
                    this.addToHistory('history.updateLevelDimension', { property: dimension });
                    break;
            }
        },

        updateDimensions() {
            const activeCube = this.activeCube;

            if (activeCube) {
                this.dimensions = {
                    levels: activeCube.levels.length,
                    rows: activeCube.levels[0].cells.length,
                    cells: activeCube.levels[0].cells[0].length,
                };
            }
        },

        /* }}} */
        /* {{{ levels */

        updateLevelName(levelIndex: number, name: string) {
            const level = this.activeCube?.levels[levelIndex];

            if (!level) {
                return;
            }

            level.name = name;
            this.addToHistory('history.levelName', { name: name, index: levelIndex + 1 });
        },

        /* }}} */
        /* {{{ cells */

        toggleWall(levelIdx: number, row: number, col: number, wall: 'd' | 'r') {
            const cube = this.activeCube;
            const level = cube?.levels[levelIdx];
            const cell = level?.cells[row]?.[col];

            if (!cube || !level || !cell) {
                return;
            }

            cell[wall] = !cell[wall];
            this.addToHistory('history.toggleWall', { row, col, index: levelIdx + 1 });
        },

        toolCell(levelIdx: number, row: number, col: number) {
            const cube = this.activeCube;
            const level = cube?.levels[levelIdx];
            const cell = level?.cells[row]?.[col];

            if (!cube || !level || !cell) {
                return;
            }

            const tool = this.tool;

            switch (tool) {
                case 'hole':
                    cell.b = !cell.b;
                    break;
                case 'start':
                    cube.start = {
                        x: col,
                        y: row,
                        z: levelIdx,
                    };
                    break;
                case 'finish':
                    cube.end = {
                        x: col,
                        y: row,
                        z: levelIdx,
                    };
                    break;
            }

            this.addToHistory('history.toggleCell', { row, col, tool, index: levelIdx + 1 });
        },

        /* }}} */
        /* {{{ import/export */

        export(selections: CubeName[] = []): string {
            let list = Array.from(this.cubes.values());

            if (selections.length) {
                list = list.filter((cube) => selections.includes(cube.name));
            }

            const simplifiedList = list.map(toSimplifiedCube);

            return JSON.stringify(simplifiedList);
        },

        import(data: string | null, replace = false): ActionResult {
            const skipped: CubeName[] = [];
            let importedCubes = 0;

            if (data) {
                try {
                    const cubes = JSON.parse(data);

                    for (const importedCube of cubes) {
                        const cube = toCompleteCube(importedCube);

                        if (this.cubes.has(cube.name)) {
                            if (replace) {
                                this.setCube(cube);
                                importedCubes++;
                            } else {
                                skipped.push(cube.name);
                            }
                        } else {
                            this.setCube(cube);
                            importedCubes++;
                        }
                    }
                } catch (err) {
                    return {
                        type: 'error',
                        message: 'messages.invalidJsonFormat',
                        details: (err as Error).message,
                    };
                }

                /* TODO return skipped value */
                this.saveCubesToLocalStorage();
                if (skipped.length) {
                    return {
                        type: 'warning',
                        message: 'messages.skippingCubes',
                        details: skipped,
                    };
                }

                return {
                    type: 'success',
                    message: 'messages.importSuccess',
                    details: importedCubes,
                };
            }

            return {
                type: 'warning',
                message: 'messages.enterJsonData',
            };
        },

        /* Locale persistency */
        saveCubesToLocalStorage() {
            const json = this.export();

            localStorage.setItem('cubes', json);
            /* TODO save active cube */
        },

        loadCubesFromLocalStorage() {
            const savedCubes = localStorage.getItem('cubes');

            this.import(savedCubes);
        },

        /* }}} */
        /* History */
        addToHistory(description: string, details: HistoryDetail, notUndoable = false) {
            if (this.activeCube === null) {
                return;
            }

            const historyIndex = this.historyIndex;
            const history = this.history;

            /* If we're in the middle of the history, truncate the future */
            if (historyIndex < history.length - 1) {
                this.history = history.slice(0, historyIndex + 1);
            }

            this.history.push({
                timestamp: new Date(),
                description,
                details,
                cube: copyCube(this.activeCube),
                notUndoable,
            });

            this.historyIndex = this.history.length - 1;
        },

        undo(index?: number) {
            if (index === undefined) {
                index = this.historyIndex - 1;
            }

            if (index >= 0 && index < this.history.length) {
                this.historyIndex = index;
                this.activeCube = copyCube(this.history[this.historyIndex].cube);
                this.updateDimensions();
            }
        },

        redo(index?: number) {
            if (index === undefined) {
                index = this.historyIndex + 1;
            }

            if (index >= 0 && index < this.history.length) {
                this.historyIndex = index;
                this.activeCube = copyCube(this.history[this.historyIndex].cube);
                this.updateDimensions();
            }
        },
    },
});

/* initialization */
const store = useCubeStore();
store.loadCubesFromLocalStorage();
