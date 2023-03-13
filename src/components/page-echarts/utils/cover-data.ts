import coordinate from '../data/coordinate-data'

type AddressUnionType = keyof typeof coordinate

export default (
	data: Array<{
		name: string
		values: number
	}>
) =>
	data
		.filter(
			item => item.name in coordinate && Array.isArray(coordinate[item.name as AddressUnionType])
		)
		.map(item => ({
			name: item.name,
			value: coordinate[item.name as AddressUnionType].concat(item.values)
		}))
