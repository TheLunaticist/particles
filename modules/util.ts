/* Deletes the element in an UNSORTED collection.
 * Assumes one or more elements.
*/
export function fastDelete(deleteInd: number, array: any[]): void {
	const lastInd = array.length - 1;
	array[deleteInd] = array[lastInd];
	array.pop();
}
