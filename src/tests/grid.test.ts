import { createArrayOfNodes } from '../Components/grid';

test('createArrayOfNodes()', () => {
    const testResponse = createArrayOfNodes(3);
    const element00 = testResponse[0][0];
    const element11 = testResponse[1][1];
    expect(testResponse.length).toBe(3);
    expect(element00.neighbours.length).toBe(2);
    expect(element11.neighbours.length).toBe(4);
})