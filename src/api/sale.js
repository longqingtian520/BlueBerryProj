import request from '@/utils/request'

export function addSaleData (data) {
    return request({
      url: '/sale',
      method: 'post',
      data: data
    })
}

export function updateSaleData (data) {
  return request({
    url: '/sale',
    method: 'post',
    data: data
  })
}

export function listSaleData (query) {
  return request({
    url: '/sale',
    method: 'get',
    params: query
  })
}

export function delSaleData (data) {
  return request({
    url : '/sale/del',
    method: 'post',
    data: data
  })
}
