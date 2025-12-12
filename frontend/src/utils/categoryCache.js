// Category cache utility to dedupe requests across components
// Author: Thang Truong
// Date: today

import axios from 'axios'

let cachedCategories = null
let inflightPromise = null
let nextAllowedAt = 0

export const loadCategories = async () => {
  if (cachedCategories) return cachedCategories
  const now = Date.now()
  if (now < nextAllowedAt) return []
  if (inflightPromise) return inflightPromise

  inflightPromise = axios.get('/api/products/categories')
    .then(res => {
      cachedCategories = res.data
      inflightPromise = null
      return cachedCategories
    })
    .catch(async err => {
      inflightPromise = null
      if (err?.response?.status === 429) {
        nextAllowedAt = Date.now() + 2000
        try {
          await new Promise(r => setTimeout(r, 800))
          const retry = await axios.get('/api/products/categories')
          cachedCategories = retry.data
          return cachedCategories
        } catch {
          return []
        }
      }
      return []
    })

  return inflightPromise
}

