
export default class Node {
    i: number; // index of row
    j: number; // index of column
    f: number; // distance of g (distance from home) and h (heuristic estimate of distance to target)
    g: number; // distance from home
    h: number; // distance to target
    wall: boolean; // Is it a wall?
    neighbours: Node[]; // Array to keep track of neighbours
    previous: null | Node;
    // addNeighbours: (grid: Node[][]) => void;
    constructor(i: number, j: number) {
        this.i = i;
        this.j = j;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.wall = false;
        this.neighbours = [];
        this.previous = null;
    }
    addNeighbours = (grid: Node[][]): void => {
        const i = this.i;
        const j = this.j;

        if (i < grid.length - 1) {
            const thisNode = grid[i + 1][j];
            // const clonedNode = { ...thisNode, neighbours: [] } as Node
            this.neighbours.push(thisNode)
        }
        if (i > 0) {
            const thisNode = grid[i - 1][j]
            // const clonedNode = { ...thisNode, neighbours: [] } as Node
            this.neighbours.push(thisNode)
        }
        if (j < grid.length - 1) {
            const thisNode = grid[i][j + 1]
            // const clonedNode = { ...thisNode, neighbours: [] } as Node
            this.neighbours.push(thisNode)
        }
        if (j > 0) {
            const thisNode = grid[i][j - 1]
            // const clonedNode = { ...thisNode, neighbours: [] } as Node
            this.neighbours.push(thisNode)
        }
    }

}