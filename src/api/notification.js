import request from '@/utils/request'
// 推送列表
export function pushList(params) {
  return request({
    url: '/push/list',
    method: 'get',
    params
  })
}
// 删除推送
export function removePushList(data) {
  return request({
    url: '/push/status',
    method: 'post',
    data
  })
}
// 新增推送
export function addPush(data) {
  return request({
    url: '/push/info',
    method: 'post',
    data
  })
}
// 修改推送
export function modifyPush(data) {
  return request({
    url: '/push/info',
    method: 'put',
    data
  })
}
// 获取推送详情
export function getPushDetail(params) {
  return request({
    url: '/push/info',
    method: 'get',
    params
  })
}
// 推送详情 列表
export function getDetailList(params) {
  return request({
    url: '/material/list',
    method: 'get',
    params
  })
}
// 推送回收站
export function pushRecycling(params) {
  return request({
    url: '/push/trash',
    method: 'get',
    params
  })
}
// 推送回收删除/恢复
export function recyclebinDelete(data) {
  return request({
    url: '/push/status',
    method: 'post',
    data
  })
}
// 人群
export function crowdIds() {
  return request({
    url: '/crowd/all',
    method: 'get'
  })
}

// 语言获取素材内容
export function materialContent(params) {
  return request({
    url: '/material/language/content',
    method: 'get',
    params
  })
}


