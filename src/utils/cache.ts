enum CacheType {
  LOCAL,
  SESSION
}

class Cache {
  storage: Storage = localStorage

  constructor(type: CacheType) {
    if (type === CacheType.SESSION) this.storage = sessionStorage
  }
  get length(): number {
    return this.storage.length
  }
  setCache(key: string, value: any) {
    if (value !== undefined && value !== null) {
      this.storage.setItem(key, JSON.stringify(value))
    } else {
      throw new Error('value error: value 必须有值!')
    }
  }
  getCache(key: string) {
    const result = this.storage.getItem(key)
    if (result !== undefined && result !== null) {
      return JSON.parse(result)
    }
  }
  removeCache(key: string) {
    this.storage.removeItem(key)
  }
  clear() {
    this.storage.clear()
  }
}

const localCache = new Cache(CacheType.LOCAL)
const sessionCache = new Cache(CacheType.SESSION)

export { localCache, sessionCache }
