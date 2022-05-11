import React, { useCallback, useEffect, useState } from 'react';
import Node from '../Classes/Node';
import usePrevious from '../hooks/UsePrev';
import {
	createArrayOfNodes,
	getBackgroundColor,
	getNodeBorderColor,
	getNodeWithLowestFnScore,
	getPath,
	heuristic,
	isThisNodeOnThePath,
	removeFromArray,
	sleep,
} from './grid';

function Grid() {
	const [selectedGridSizeState, setSelectedGridSizeState] = useState(5);
	const [gridArrayState, setGridArrayState] = useState<Node[][]>(createArrayOfNodes(selectedGridSizeState));
	const [start, setStart] = useState(gridArrayState[0][0]);
	const [end, setEnd] = useState(gridArrayState[gridArrayState.length - 1][gridArrayState[0].length - 1]);
	const [pathfinderState, setPathfinderState] = useState<{
		path: Node[];
		closedSet: Node[];
		openSet: Node[];
		turns: number;
	}>({
		path: [],
		closedSet: [],
		openSet: [start],
		turns: 0,
	});

	const prevSelectedGridSizeState: number = usePrevious<number>(selectedGridSizeState);

	const draw = useCallback(async () => {
		let openSet = pathfinderState.openSet;
		const closedSet = pathfinderState.closedSet;
		// If there are items left in the openSet array:
		console.log({ location: 'draw firing', proceed: openSet.length > 0 });
		while (openSet.length > 0) {
			await sleep(200);
			// FIND THE NODE WITH THE LOWEST f(n) SCORE IN THE OPENSET
			// Iterate through the openSet and find the node with the lowest f(n) score.
			const current = getNodeWithLowestFnScore(openSet); // We've now identified the Node with the lowest f(n) score. Initially, this will be 0,0

			// Best option moves from openSet to closedSet
			openSet = removeFromArray(openSet, current); // TODO: Does this remove it from the openSet? It's in another file.
			closedSet.push(current); //

			// FIND THE PATH.
			// We will create an array of Nodes, which make up the path. (The first will be the current Node, and it will make its way to the start Node.)
			const tempPath = getPath(current);
			// If we have reached the goal:
			if (current === end) {
				console.log('DONE!');
				setPathfinderState((prev) => ({
					...prev,
					path: tempPath,
					openSet: openSet,
					closedSet: closedSet,
					turns: prev.turns + 1,
				}));
				return;
			}

			// CALC F VALUES FOR NEIGHBOURING NODES AND UPDATE THE OPENSET WITH NEIGHBOURS FOR THE NEXT ITERATION
			// Look at neighbour nodes and update their g values (distance from origin)
			const { neighbours } = current;
			for (let i = 0; i < neighbours.length; i++) {
				const thisNeighbour = neighbours[i];
				// if closedSet already includes this neighbour, then we've already calculated this and can skip
				if (!closedSet.includes(thisNeighbour)) {
					// The new g value may be the current distance from the origin +1, or we may have already calculated a more direct route to this node and stored it in the openSet.
					let tempG = current.g + 1;
					if (openSet.includes(thisNeighbour)) {
						// Update this neighbours g property with reference to the g value of the current Node. But only if there isn't already a lower g value.
						if (tempG < thisNeighbour.g || thisNeighbour.g === 0) {
							thisNeighbour.g = tempG;
						}
					} else {
						// If the openSet doesn't include this neighbour, we should add it for the next iteration.
						thisNeighbour.g = tempG;
						openSet.push(thisNeighbour); // This is where we create the next openSet
					}
					// Update the heuristic
					thisNeighbour.h = heuristic(thisNeighbour, end);
					thisNeighbour.f = thisNeighbour.g + thisNeighbour.h;

					thisNeighbour.previous = current;
				}
			}

			setPathfinderState((prev) => ({
				...prev,
				path: tempPath,
				openSet: openSet,
				closedSet: closedSet,
				turns: prev.turns + 1,
			}));
		}
		console.log('FINISHED PATHFINDING (There are no items left to explore - ie, there is no solution');

		// There are no items left to explore - ie, there is no solution
	}, [end]);

	// Creates the render (I don't think this is necessary for this as I'll do it in React?)
	// function draw() {}

	useEffect(() => {
		console.log({
			location: 'draw useEffect Firing',
			end,
			closedSet: pathfinderState.closedSet,
			openSet: pathfinderState.openSet,
		});

		// TODO: Fire the draw function with a delay timer.
		draw();
	}, [end, pathfinderState.closedSet, pathfinderState.openSet]);

	// Update size of grid when user moves slider
	useEffect(() => {
		if (prevSelectedGridSizeState === selectedGridSizeState || prevSelectedGridSizeState === undefined) return;
		const newGridArrayState = createArrayOfNodes(selectedGridSizeState);
		const newStartPosition = newGridArrayState[0][0];
		setGridArrayState(newGridArrayState);
		setStart(newStartPosition);
		setEnd(newGridArrayState[newGridArrayState.length - 1][newGridArrayState[0].length - 1]);
		setPathfinderState((prev) => ({ ...prev, path: [], openSet: [newStartPosition], closedSet: [], turns: 0 }));
	}, [prevSelectedGridSizeState, selectedGridSizeState]);

	return (
		<div>
			<h4>Grid</h4>
			<label htmlFor='grid-size'>
				Grid Size: {selectedGridSizeState}
				<input
					id='grid-size'
					type='range'
					min='2'
					max='10'
					value={selectedGridSizeState}
					onChange={(event) => setSelectedGridSizeState(Number(event.target.value))}
				></input>
			</label>
			<br />
			<br />
			<div
				style={{
					margin: 'auto',
					width: '300px',
					height: '300px',
					display: 'grid',
					gridTemplateColumns: `repeat(${selectedGridSizeState}, 1fr)`,
					gridTemplateRows: `repeat(${selectedGridSizeState}, 1fr)`,
					gap: '3px',
				}}
			>
				{gridArrayState.map((curRow, index) =>
					curRow.map((curNode, index) => (
						<div
							key={`column-${index}`}
							style={{
								backgroundColor: getBackgroundColor(curNode, pathfinderState.closedSet, pathfinderState.openSet),
								width: `${300 / curRow.length}px`,
								height: `${300 / curRow.length}px`,
								border: `solid 2px ${getNodeBorderColor(curNode, start, end)}`,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<p>{isThisNodeOnThePath(curNode, pathfinderState.path) ? 'X' : ''}</p>
						</div>
					))
				)}
			</div>
			<br />
			<br />
			<br />
			<p>Path: {JSON.stringify(pathfinderState.path.map((x) => `${x.i}, ${x.j}`))}</p>
			<p>OpenSet: {JSON.stringify(pathfinderState.openSet.map((x) => `${x.i}, ${x.j}`))}</p>
			<p>ClosedSet: {JSON.stringify(pathfinderState.closedSet.map((x) => `${x.i}, ${x.j}`))}</p>
		</div>
	);
}

export default Grid;
