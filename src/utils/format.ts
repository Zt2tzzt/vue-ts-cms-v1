import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const formatUTC = (utcString: string, pattern = 'YYYY/MM/DD HH:mm:ss') => {
	return dayjs.utc(utcString).utcOffset(8).format(pattern)
}

export const getKeysFronObj = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>
