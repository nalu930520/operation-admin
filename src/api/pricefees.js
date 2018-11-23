import request from '@/utils/request'

export function getDepositFees() {
  return request({
    url: '/quota_and_fee/deposit_fees',
    method: 'get'
  })
}

export function setDepositFees(data) {
  return request({
    url: '/quota_and_fee/deposit_fees',
    method: 'post',
    data
  })
}

export function getDepositLimit() {
  return request({
    url: '/quota_and_fee/index',
    method: 'get'
  })
}

export function setDepositLimit(data) {
  return request({
    url: '/quota_and_fee/index',
    method: 'post',
    data
  })
}

export function getWithdrawLimit() {
  return request({
    url: '/quota_and_fee/onchain_quota',
    method: 'get'
  })
}

export function setWithdrawLimit(data) {
  return request({
    url: '/quota_and_fee/onchain_quota',
    method: 'post',
    data
  })
}
