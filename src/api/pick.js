import request from '@/utils/request'

export function listPickData (query) {
  return request({
    url: '/pick',
    method: 'get',
    params: query
  })
}

export function updatePickData (data) {
  return request({
    url: '/pick',
    method: 'post',
    data: data
  })
}

export function addPickData (data) {
  return request({
    url: '/pick',
    method: 'post',
    data: data
  })
}

export function getPickData (query) {
  return request({
    url: '/pick',
    method: 'get',
    params: query
  })
}

export function deletePickData (data) {
  return request({
    url: '/pick/del',
    method: 'post',
    data: data
  })
}
