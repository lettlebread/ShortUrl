const shortUrlCache = new Map()

export const setShortUrlCache = (hashKey: string, targetUrl: string):void => {
  shortUrlCache.set(hashKey, targetUrl)
}

export const getShortUrlCache = (hashKey: string):string => {
  return shortUrlCache.get(hashKey)
}

export const deleteShortUrlCache = (hashKey: string):void => {
  shortUrlCache.delete(hashKey)
}