export const getStorageItem = (key: string) => localStorage.getItem(key)
export const setStorageItem = (key: string, value: string) => {
	try {
		localStorage.setItem(key, value)
	} catch (_e) {
		return
	}
}

export const THEME = "theme"
