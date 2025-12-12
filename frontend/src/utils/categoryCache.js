// Category cache utility to dedupe requests across components
// Author: Thang Truong
// Date: today

import axios from 'axios'

let cachedCategories = null
let inflightPromise = null

export const loadCategories = async () => {
  if (cachedCategories) return cachedCategories
  if (inflightPromise) return inflightPromise

  inflightPromise = axios.get('/api/products/categories')
    .then(res => {
      cachedCategories = res.data
      inflightPromise = null
      return cachedCategories
    })
    .catch(err => {
      inflightPromise = null
      throw err
    })

  return inflightPromise
}

