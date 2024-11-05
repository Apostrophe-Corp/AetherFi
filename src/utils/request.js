import axios from 'axios'

const serverURI = process.env.NEXT_PUBLIC_BACKEND_BASE_URI

const axiosCall = axios.create({
	baseURL: `${serverURI}/`,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
	timeout: 180000,
})

export const request = async ({
	path = '',
	method = 'get',
	accessToken = '',
	body = {},
	prop = 'data',
} = {}) => {
	const flags = {
		headers: {},
	}
	if (accessToken) flags.headers['Authorization'] = `Bearer ${accessToken}`
	try {
		if (method === 'get' && !Object.keys(body).length) {
			const res = await axiosCall.get(path, flags)
			return { [prop]: res.data, success: res.data?.success ?? true }
		}
		if (method === 'delete') {
			const res = await axiosCall.delete(path, {
				data: body,
				headers: { ...flags.headers },
			})
			return { [prop]: res.data, success: res.data?.success ?? true }
		}
		const res = await axiosCall?.[method](path, body, flags)
		return { [prop]: res.data, success: res.data?.success ?? true }
	} catch (err) {
		if (err.response)
			return {
				...err.response.data,
				status: err.response.status,
				headers: { ...err.response.headers },
				success: false,
			}
		else {
			return { ...err, success: false }
		}
	}
}

export const requestUpload = async ({
	path = '',
	method = 'get',
	accessToken = '',
	file = {},
	prop = 'data',
} = {}) => {
	const flags = {
		headers: {},
	}
	if (accessToken) flags.headers['Authorization'] = `Bearer ${accessToken}`
	flags.headers['Content-Type'] = 'multipart/form-data'
	try {
		const formData = new FormData()
		formData.append('image', file)
		const res = await axiosCall?.[method](path, formData, flags)
		return { [prop]: res.data, success: true }
	} catch (err) {
		if (err.response)
			return {
				...err.response.data,
				status: err.response.status,
				headers: { ...err.response.headers },
				success: false,
			}
		else {
			return { ...err, success: false }
		}
	}
}

export const refreshRequest = async (accessToken) => {
	try {
		const flags = {
			headers: {},
		}
		flags.headers['Authorization'] = `Bearer ${accessToken}`
		const res = await axiosCall.post('refresh', {}, flags)
		return { ...res.data, success: true }
	} catch (err) {
		if (err.response)
			return {
				...err.response.data,
				status: err.response.status,
				headers: { ...err.response.headers },
				success: false,
			}
		else {
			return { ...err, success: false }
		}
	}
}
