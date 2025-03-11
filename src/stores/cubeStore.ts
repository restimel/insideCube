import { defineStore } from 'pinia';
import type {
    Cube,
    CubeHistory,
    CubeName,
} from '@/types/Cube';

type CubeState = {
    cubes: Map<CubeName, Cube>;
    activeCube: Cube | null;
    history: CubeHistory[];
    historyIndex: number;
    tool: string;
};

/**
 * Creates a deep copy of a given Cube object.
 *
 * @param cube - The Cube object to be copied.
 * @returns A new Cube object that is a deep copy of the input cube.
 */
function copyCube(cube: Cube): Cube {
    return {
        name: cube.name,
        color: cube.color,
        levels: cube.levels.map((level) => ({
            name: level.name,
            cells: level.cells.map((row) => [...row]),
        })),
    };
}

/**
 * Creates a new Cube object with default values.
 *
 * @returns A new Cube object with default name, color, and empty levels.
 */
function createNewCube(): Cube {
    return {
        name: '',
        color: '#000000',
        levels: [],
    };
}

export const useCubeStore = defineStore('cube', {
    state: (): CubeState => ({
        cubes: new Map(),
        activeCube: null,
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
            this.activeCube = createNewCube();
        },

        deleteCube(cube: Cube): boolean {
            const result = this.cubes.delete(cube.name);

            this.setDefaultCube();
            this.saveCubesToLocalStorage();
            return result;
        },

        selectCube(cube: Cube | CubeName) {
            let activeCube = cube;

            if (typeof cube === 'string') {
                const storeCube = this.getCubeByName(cube);

                if (!storeCube) {
                    return;
                }

                activeCube = storeCube;
            }

            this.activeCube = activeCube as Cube;
        },

        export(selections: CubeName[] = []): string {
            let list = Array.from(this.cubes.values());

            if (selections.length) {
                list = list.filter((cube) => selections.includes(cube.name));
            }

            return JSON.stringify(list);
        },

        import(data: string | null, replace = false): ActionResult {
            const skipped: CubeName[] = [];
            let importedCubes = 0;

            if (data) {
                try {
                    const cubes = JSON.parse(data);

                    for (const cube of cubes) {

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
            }
        },

        redo(index?: number) {
            if (index === undefined) {
                index = this.historyIndex + 1;
            }

            if (index >= 0 && index < this.history.length) {
                this.historyIndex = index;
                this.activeCube = copyCube(this.history[this.historyIndex].cube);
            }
        },
    },
});

/* initialization */
const store = useCubeStore();
store.loadCubesFromLocalStorage();
