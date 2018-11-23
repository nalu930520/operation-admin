import request from '@/utils/request'

export function getPackage(params) {
  return request({
    url: '/update_manage/update_package',
    method: 'get',
    params
  })
}

export function setPackage(data) {
  console.log(data)
  return request({
    url: '/update_manage/update_package',
    method: 'post',
    data
  })
}

// 获取当前版本信息
export function getVersionInfo(params) {
  return request({
    url: '/update_manage/version_update',
    method: 'get',
    params
  })
}
export function updateVersionInfo(data) {
  return request({
    url: '/update_manage/version_update',
    method: 'POST',
    data
  })
}

// 获取红点树
export function getRedDotTree() {
  return request({
    url: '/red_dot_guide/red_dot_guide_tree',
    method: 'get'
  })
}

// 设置红点树
export function setRedDotTree(data) {
  return request({
    url: '/red_dot_guide/red_dot_guide_tree',
    method: 'put',
    data
  })
}

// 删除红点
export function deleteRedDot(data) {
  return request({
    url: '/red_dot_guide/red_dot_manage',
    method: 'delete',
    data
  })
}

// 获取红点
export function getAllRedDot() {
  return request({
    url: '/red_dot_guide/api_get_red_dot_guide_list',
    method: 'get'
  })
}

// 获取红点
export function getRedDot(params) {
  return request({
    url: '/red_dot_guide/red_dot_manage',
    method: 'get',
    params
  })
}

// 再次点亮红点
export function lightRedDotAgain(data) {
  return request({
    url: '/red_dot_guide/red_dot_manage',
    method: 'post',
    data
  })
}

// 点亮红点
export function lightRedDot(data) {
  return request({
    url: '/red_dot_guide/red_dot_manage',
    method: 'put',
    data
  })
}

// 获取服务协议
export function getTos() {
  return request({
    url: '/tos',
    method: 'get'
  })
}

// 新增服务协议
export function addTos(data) {
  return request({
    url: '/tos',
    method: 'post',
    data
  })
}
