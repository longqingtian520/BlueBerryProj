import request from '@/utils/request'

export function listBlueBerryType () {
  return request({
    url: '/base/bbtype',
    method: 'get'
  })
}



