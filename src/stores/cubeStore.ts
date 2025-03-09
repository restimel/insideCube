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
        },

        setDefaultCube() {
            if (!this.activeCube) {
                const firstCube = this.cubes.values().next().value;

                if (firstCube) {
                    this.activeCube = firstCube;
                }
            }
        },

        deleteCube(cube: Cube): boolean {
            return this.cubes.delete(cube.name);
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

        import(data: string | null, replace = false): boolean {
            const skipped: CubeName[] = [];

            if (data) {
                try {
                    const cubes = JSON.parse(data);

                    for (const cube of cubes) {

                        if (this.cubes.has(cube.name)) {
                            if (replace) {
                                this.setCube(cube);
                            } else {
                                skipped.push(cube.name);
                            }
                        } else {
                            this.setCube(cube);
                        }
                    }
                } catch {
                    return false;
                }

                /* TODO use skipped */
                return true;
            }

            return false;
        },

        /* Locale persistency */
        saveCubesToLocalStorage() {
            const json = this.export();

            localStorage.setItem('cubes', json);
        },

        loadCubesFromLocalStorage(): boolean {
            const savedCubes = localStorage.getItem('cubes');

            return this.import(savedCubes);
        },
    },
});

/* initialization */
const store = useCubeStore();
store.loadCubesFromLocalStorage();
