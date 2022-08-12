import request from '@/utils/request'

export function queryCostEchartDatas(query){
  return request({
    url: '/profit/cost',
    method: 'get',
    params: query
  })
}

export function querySaleEchartDatas(query){
  return request({
    url: '/profit/sale',
    method: 'get',
    params: query
  })
}
