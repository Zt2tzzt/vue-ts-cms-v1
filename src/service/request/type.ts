import type { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

export interface ZTInternalRequestInterceptor<T = AxiosResponse> {
	requestInterceptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
	requestInterceptorCatch?: (err: any) => any
	responseInterceptor?: (res: T) => T
	responseInterceptorCatch?: (err: any) => any
}

export interface ZTInternalRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
	interceptor?: ZTInternalRequestInterceptor<T>
	showLoading?: boolean
}

export interface ZTRequestInterceptor<T = AxiosResponse> {
	requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
	requestInterceptorCatch?: (err: any) => any
	responseInterceptor?: (res: T) => T
	responseInterceptorCatch?: (err: any) => any
}
export interface ZTRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
	interceptor?: ZTRequestInterceptor<T>
	showLoading?: boolean
}


