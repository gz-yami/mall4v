import cookie from 'vue-cookies'
import router from '@/router'

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16)
  })
}
/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  const authorities = JSON.parse(sessionStorage.getItem('b2cAuthorities') || '[]')
  if (authorities.length) {
    for (const i in authorities) {
      const element = authorities[i]
      if (element === key) {
        return true
      }
    }
  }
  return false
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  cookie.remove('Authorization')
  router.options.isAddDynamicMenuRoutes = false
}
