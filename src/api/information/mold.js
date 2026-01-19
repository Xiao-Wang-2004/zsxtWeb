import { post } from '../utils'

export const getMoldList = (data) => {
  return post('/infomation/mold/list', data)
}

export const updateMold = (data) => {
  return post('/infomation/mold/update', data)
}

export const deleteMold = (data) => {
  return post('/infomation/mold/delete', data)
}

export const keepMold = (data) => {
  return post('/infomation/mold/keep', data)
}