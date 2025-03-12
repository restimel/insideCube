import { defineStore } from 'pinia';
import {
    copyCube,
    createNewCube,
    toCompleteCube,
    toSimplifiedCube,
} from '@/utils/cubeOperations';

import type {
    Cube,
    CubeHistory,
    CubeName,
    Dimensions,
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
        // getCubes: (state) => state.cubes,


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

            this.setDefaultCube(cube.name);
            this.saveCubesToLocalStorage();

            return true;
        },

        setDefaultCube(cubeName?: CubeName) {
            if (!this.activeCube) {
                if (cubeName) {
                    const cube = this.getCubeByName(cubeName);

                    if (cube) {
                        this.activeCube = copyCube(cube);
                    }
                } else {
                    const firstCube = this.cubes.values().next().value;

                    if (firstCube) {
                        this.activeCube = copyCube(firstCube);
                    }
                }
            }
        },

        createNewCube() {
            this.activeCube = createNewCube(this.dimensions);
        },

        deleteCube(cube: Cube): boolean {
            const result = this.cubes.delete(cube.name);

            this.setDefaultCube();
            this.saveCubesToLocalStorage();
            return result;
        },

        selectCube(cube: Cube | CubeName) {
            let activeCube: Cube;

            if (typeof cube === 'string') {
                const storeCube = this.getCubeByName(cube);

                if (!storeCube) {
                    return;
                }

                activeCube = storeCube;
            } else {
                activeCube = cube;
            }

            if (!activeCube) {
                this.createNewCube();
                return;
            }

            this.activeCube = copyCube(activeCube);
            this.updateDimensions();
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

        /* History */
        addToHistory(description: string, notUndoable = false) {
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
