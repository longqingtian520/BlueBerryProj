import request from '@/utils/request'

export function addFriendData (data) {
  return request({
    url: '/friend',
    method: 'post',
    data: data
  })
}

export function getFriendData (query) {
  return request({
    url: '/friend',
    method: 'get',
    params: query
  })
}

export function updateFriendData (data) {
  return request({
    url: '/friend',
    method: 'post',
    data: data
  })
}

export function listFriendData (query) {
  return request({
    url: '/friend',
    method: 'get',
    params: query
  })
}

export function deleteFriendData (data) {
  return request({
    url: '/friend/del',
    method: 'post',
    data: data
  })
}
