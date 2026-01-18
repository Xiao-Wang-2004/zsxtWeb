import { post } from '../utils'

export const getUnitList = (data) => {
  return post('/infomation/unit/list', data)
}

export const updateUnit = (data) => {
  return post('/infomation/unit/update', data)
}

export const deleteUnit = (data) => {
  return post('/infomation/unit/delete', data)
}