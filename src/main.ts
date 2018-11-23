import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import Bg from 'bignumber.js'

import '@/styles/index.scss' // global css

import App from './App.vue'
import router from './router'
import store from './store/index.ts'
import '@/icons' // icon
import '@/permission.ts' // permission control
// import '../mock' // simulation data

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

const VUE = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

Vue.filter('formatAmount', function (value, decimal) {
  if (value === 0) return 0
  if (!value) return ''
  return new Bg(value / 10 ** decimal).toFormat(8, 1)
})

Vue.filter('formatUSDAmount', function (value) {
  if (value === 0) return 0
  if (!value) return ''
  return new Bg(value / 100000000).toFormat(2, 1)
})
