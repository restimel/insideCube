import { defineStore } from 'pinia';
import type {
    Cube,
    CubeName,
} from '@/types/Cube';

type CubeState = {
    cubes: Map<CubeName, Cube>;
    activeCube: Cube | null;
};

export const useCubeStore = defineStore('cube', {
    state: (): CubeState => ({
        cubes: new Map(),
        activeCube: null,
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

        setCube(cube: Cube, oldName?: CubeName) {
            const name = oldName || cube.name;

            this.cubes.set(name, cube);

            if (name !== cube.name) {
                this.cubes.delete(name);
            }

            this.setDefaultCube(cube.name);
            this.saveCubesToLocalStorage();
        },

        setDefaultCube(cubeName?: CubeName) {
            if (!this.activeCube) {
                if (cubeName) {
                    const cube = this.getCubeByName(cubeName);

                    if (cube) {
                        this.activeCube = cube;
                    }
                } else {
                    const firstCube = this.cubes.values().next().value;

                    if (firstCube) {
                        this.activeCube = firstCube;
                    }
                }
            }
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
    },
});

/* initialization */
const store = useCubeStore();
store.loadCubesFromLocalStorage();
