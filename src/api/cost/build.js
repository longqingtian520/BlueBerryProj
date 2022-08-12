import request from '@/utils/request'

// 查询建设成本列表
export function listBuildCost(query) {
  return request({
    url: '/cost/build',
    method: 'get',
    params: query
  })
}

// 根据id查询建设成本
export function getBuildCost (query) {
  return request({
    url: '/cost/build',
    method: 'get',
    params: query
  })
}

// 新增建设成本
export function addBuildCost (data) {
  return request({
    url: '/cost/build',
    method: 'post',
    data: data
  })
}

// 更新建设成本
export function updateBuildCost (data) {
  return request({
    url: '/cost/build',
    method: 'post',
    data: data
  })
}

// 删除建设成本记录
export function delBuildCost (data) {
  return request({
    url: '/cost/build/del',
    method: 'post',
    data: data
  })
}
