// 方式一，手动切换不同环境
// export const BASE_URL = 'http://coderwhy.dev:8000'
// export const BASE_URL = 'http://codercba.prod:8000'

// 方式二，根据process.env.NODE_ENV区分
/**
 * 开发环境：development
 * 生产环境：production
 * 测试环境：text
 */
let BASE_URL: string
const TIME_OUT = 3000

switch (import.meta.env.PROD) {
	case true:
		BASE_URL = 'http://152.136.185.210:4000'
		break
	case false:
		BASE_URL = 'http://152.136.185.210:5000'
		break
}

console.log('env:', import.meta.env)
console.log('VITE_NAME:', import.meta.env.VITE_NAME)
console.log('VITE_URL:', import.meta.env.VITE_URL)

export { BASE_URL, TIME_OUT }
