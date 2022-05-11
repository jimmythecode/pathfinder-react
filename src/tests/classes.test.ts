export { }

class MyNode {
    neighbours: MyNode[];
    addNeighbours: (thisMyNode: MyNode) => void;
    constructor() {
        this.neighbours = [];
        this.addNeighbours = function (thisMyNode: MyNode) {
            // thisMyNode.neighbours = []
            const clonedMyNode = { ...thisMyNode } as MyNode;
            clonedMyNode.neighbours = []
            this.neighbours.push(clonedMyNode)
        }
    }
}


// Create an array to represent the 2D grid.
function createArrayOfMyNodes(): MyNode[][] {
    const initialGrid: MyNode[][] = [
        [new MyNode(), new MyNode(), new MyNode()],
        [new MyNode(), new MyNode(), new MyNode()],
        [new MyNode(), new MyNode(), new MyNode()],
    ]

    const returnGrid = [...initialGrid];

    // add neighbours to each MyNode
    for (let i = 0; i < returnGrid.length; i++) {
        for (let j = 0; j < returnGrid.length; j++) {
            // TODO: This works when I give it new Grid(), but what if I give it an existing MyNode from returnGrid? Need to handle if it's [0][0]
            const newJ = j + 1 === returnGrid.length ? 0 : j + 1;
            // returnGrid[i][j].addNeighbours(returnGrid[i][newJ]); // this successfully adds a neighbour
            returnGrid[i][j].addNeighbours(new MyNode()); // This adds a neighbour OK
        }
    }
    console.log({
        returnGrid, ii: returnGrid[0][0]
    })
    returnGrid[0][0].addNeighbours(returnGrid[0][1]); // This adds a neighbour OK
    for (let i = 0; i < returnGrid.length; i++) {
        for (let j = 0; j < returnGrid.length; j++) {
            const newJ = j + 1 === returnGrid.length ? 0 : j + 1
            returnGrid[i][j].addNeighbours(returnGrid[i][newJ]);
            // returnGrid[i][j].addNeighbours(new MyNode()); // This adds a neighbour OK
        }
    }

    return returnGrid;
}

test.skip('should first', () => {
    const testResponse = createArrayOfMyNodes();
    console.log({
        testResponse: testResponse[0][0], neighbours: testResponse[0][0].neighbours
    });
    expect(testResponse.length).toBe(3);

})