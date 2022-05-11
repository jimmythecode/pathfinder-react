import Node from '../Classes/Node';

// Function to delete element from the array
export function removeFromArray(arr: Node[], elt: Node): Node[] {
    // Could use indexOf here instead to be more efficient
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === elt) {
            arr.splice(i, 1);
        }
    }
    return arr;
}

export function dist(ai: number, aj: number, bi: number, bj: number): number {
    return Math.abs(ai - bi) + Math.abs(aj - bj);
}

export function heuristic(neighbour: Node, end: Node): number {
    const distance = dist(neighbour.i, neighbour.j, end.i, end.j);
    return distance;
}

// Create a grid of particular size ready to be populated
export function createEmptyGrid(sizeOfGrid: number): unknown[][] {
    const newGrid = new Array(sizeOfGrid);
    for (let i = 0; i < sizeOfGrid; i++) {
        const newEmptyRow = [...new Array(sizeOfGrid)];
        newGrid[i] = newEmptyRow;
    }
    return newGrid;
}

// Create an array to represent the 2D grid.
export function createArrayOfNodes(sizeOfGrid: number) {
    let returnGrid: Node[][] = createEmptyGrid(sizeOfGrid) as Node[][];

    // initialize the nodes
    for (let i = 0; i < sizeOfGrid; i++) {
        for (let j = 0; j < sizeOfGrid; j++) {
            returnGrid[i][j] = new Node(i, j);
        }
    }
    // add neighbours to each node
    for (let i = 0; i < sizeOfGrid; i++) {
        for (let j = 0; j < sizeOfGrid; j++) {
            returnGrid[i][j].addNeighbours(returnGrid);
        }
    }
    return returnGrid;
}

export function isThisNodeOnThePath(node: Node, path: Node[]): boolean {
    const { i, j } = node;
    return path.filter(pathNode =>
        (pathNode.i === i && pathNode.j === j)
    ).length > 0
}

export function getNodeBorderColor(thisNode: Node, start: Node, end: Node) {
    const { i: thisNodei, j: thisNodej } = thisNode;
    const { i: starti, j: startj } = start;
    const { i: endi, j: endj } = end;
    if (thisNodei === starti && thisNodej === startj) return "blue";
    if (thisNodei === endi && thisNodej === endj) return "green";
    return "black";
}

export function getBackgroundColor(thisNode: Node, closedSet: Node[], openSet: Node[]): string {
    const { i, j } = thisNode
    if (openSet.filter(curOpenSetNode => (curOpenSetNode.i === i && curOpenSetNode.j === j)).length > 0) return "lightblue";
    if (closedSet.filter(curClosedSetNode => (curClosedSetNode.i === i && curClosedSetNode.j === j)).length > 0) return "lightgreen";
    return "lightgray"
}

export function getPath(current: Node): Node[] {
    let tempPath: Node[] = [];
    let cyclingNode = current; // This contains a previous property, which may also contain a previous property, which may also...
    tempPath.push(cyclingNode); // The first node on the temp path will be the current node.
    while (cyclingNode.previous) {
        // We cycle through the chain of previous properties and working our way backwards, add each one to the path variable
        tempPath.push(cyclingNode.previous);
        cyclingNode = cyclingNode.previous;
    }
    return tempPath;
}

export function getNodeWithLowestFnScore(openSet: Node[]): Node {
    let lowestIndex = 0; // The lowest f(n) score
    for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[lowestIndex].f) {
            lowestIndex = i;
        }
    }
    return openSet[lowestIndex]
}

export function getUpdatedNeighbours(
    current: Node, 
    end: Node,
    openSet: Node[],
    closedSet: Node[], 
    ): { updatedNeighbours: Node[], updatedOpenSet: Node[] } {

        const {neighbours, g} = current;
        const updatedNeighbours = [...neighbours];
        const updatedOpenSet = [...openSet]

    for (let i = 0; i < neighbours.length; i++) {
        const thisNeighbour = neighbours[i];
        const updatedOpenSet = [...openSet]
        // if closedSet already includes this neighbour, then we've already calculated this and can skip
        if (!closedSet.includes(thisNeighbour)) {
            // The new g value may be the current distance from the origin +1, or we may have already calculated a more direct route to this node and stored it in the openSet.
            let tempG = g + 1;
            if (openSet.includes(thisNeighbour)) {
                // Update this neighbours g property with reference to the g value of the current Node. But only if there isn't already a lower g value.
                if (tempG < thisNeighbour.g || thisNeighbour.g === 0) {
                    thisNeighbour.g = tempG;
                }
            } else {
                // If the openSet doesn't include this neighbour, we should add it for the next iteration.
                thisNeighbour.g = tempG;
                updatedOpenSet.push(thisNeighbour); // This is where we create the next openSet
            }
            // Update the heuristic
            thisNeighbour.h = heuristic(thisNeighbour, end);
            thisNeighbour.f = thisNeighbour.g + thisNeighbour.h;

            thisNeighbour.previous = current;
        }
    }
    return {
        updatedNeighbours, updatedOpenSet
    }
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}