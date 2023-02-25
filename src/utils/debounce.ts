function ztDebounce(fn: (...args: any[]) => void, delay: number, immediate = false) {
	let timer: number | null // 1.用于记录上一次事件触发的timer
	let isInvoke = false
	const _debounce = function (this: any, ...args: any[]) {
		// 2.触发事件时执行的函数
		return new Promise((resolve, reject) => {
			try {
				if (timer) clearTimeout(timer) // 2.1.如果有再次触发(更多次触发)事件, 那么取消上一次的事件
				if (immediate && !isInvoke) {
					// 第一次操作是不需要延迟
					const res = fn.apply(this, args)
					resolve(res) // 第二种方案，使用 Promise 传递返回值。
					isInvoke = true
					return
				}
				timer = setTimeout(() => {
					// 2.2.延迟去执行对应的fn函数(传入的回调函数)
					const res = fn.apply(this, args)
					resolve(res)
					timer = null // 执行过函数之后, 将timer重新置null
					isInvoke = false
				}, delay)
			} catch (error) {
				reject(error)
			}
		})
	}
	_debounce.cancel = function () {
		// 3.给_debounce绑定一个取消的函数
		if (timer) clearTimeout(timer)
		timer = null
		isInvoke = false
	}
	return _debounce // 返回一个新的函数
}

export default ztDebounce
