<template lang="html">
  <div class="app-container">
    <el-alert
      title="请注意：修改更新后5分钟内生效"
      type="info"
      :closable="false"
      show-icon>
    </el-alert>
    <el-form ref="form" :model="form" label-width="320px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="充值限额" name="1">
          <el-form-item
            prop="depositBTCLimit"
            :label="`比特币(BTC)  最小限额： ${depositBTCLimit} BTC  设置:`"
            :rules="[
              { required: true, message: '请输入', trigger: 'blur' },
              { type: 'number', message: '必须为数字值'}
            ]"
            >
             <el-input min="0" v-model.number="form.depositBTCLimit"></el-input>
             <el-button type="primary" @click="submitForm('depositBTCLimit', 'btc')">立即更新</el-button>
           </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="提现限额" name="2">
          <el-form-item
            v-for="(item, index) in withdrawLimt"
            :prop="`${item.code}_onchain`"
            :label="`${item.code} 最小限额：${$options.filters.formatAmount(item.onchain_threshold, getDecimalPlaceFormCurrency(item.code))}`"
            :rules="[
              { required: true, message: '请输入', trigger: 'blur' },
              { type: 'number', message: '必须为数字值'}
            ]"
            >
            <el-input min="0" v-model.number="form[`${item.code}_onchain`]"></el-input>
            <el-button type="primary" @click="submitForm(`${item.code}_onchain`, item.code)">立即更新</el-button>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="入账手续费" name="3">
          <el-form-item
            prop="free_deposit_amount"
            :label="`比特币(BTC)  免费门槛：${$options.filters.formatAmount(fees.free_deposit_amount, 8)} BTC  设置:`"
            :rules="[
              { required: true, message: '请输入', trigger: 'blur' },
              { type: 'number', message: '必须为数字值'}
            ]"
            >
             <el-input min="0" v-model.number="form.free_deposit_amount"></el-input>
             <el-button type="primary" @click="submitForm('free_deposit_amount', 'btc')">立即更新</el-button>
           </el-form-item>
           <el-form-item
              prop="fee"
              :label="`       非SegWit地址：${$options.filters.formatAmount(fees.fee, 8)} BTC  设置:`"
              :rules="[
                { required: true, message: '请输入', trigger: 'blur' },
                { type: 'number', message: '必须为数字值'}
              ]"
             >
             <el-input min="0" v-model.number="form.fee"></el-input>
             <el-button type="primary" @click="submitForm('fee', 'btc')">立即更新</el-button>
           </el-form-item>
           <el-form-item
             prop="fee_discount"
             :label="`        SegWit地址折扣：${fees.fee_discount}  设置:`"
             :rules="[
               { required: true, message: '请输入', trigger: 'blur' },
               { type: 'number', message: '必须为数字值'}
             ]"
             >
             <el-input min="0" v-model.number="form.fee_discount"></el-input>
             <el-button type="primary" @click="submitForm('fee_discount', '')">立即更新</el-button>
           </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getDepositFees, setDepositFees, getDepositLimit, setDepositLimit, getWithdrawLimit, setWithdrawLimit } from '@/api/pricefees'
import { accMul } from '@/utils/calculate'
import { queryCurrency } from '@/api/golbal'
import filter from 'lodash.filter'
@Component
export default class Pricefees extends Vue {
  activeName: string = '1'
  depositBTCLimit: string = ''
  withdrawLimt: Object = {}
  fees: Object = {}
  currencies: any = []
  form: any = {
    depositBTCLimit: '',
    btc_onchain: undefined,
    ltc_onchain: undefined,
    eth_onchain: undefined,
    bch_onchain: undefined,
    free_deposit_amount: '',
    fee: '',
    fee_discount: ''
  }
  rules = {
    depositBTCLimit: [
      { required: true, message: '请输入', trigger: 'blur' }
    ],
    withdrawbtc: [
      { required: true, message: '请输入', trigger: 'blur' }
    ]
  }
  created() {
    const $filtes: any = this.$options.filters
    getDepositLimit().then((res) => {
      this.depositBTCLimit = $filtes.formatAmount(res.data.deposit_threshold, 8)
    })
    this.getCurrency()
  }
  async getCurrency() {
    const resCurrData = await queryCurrency()
    if (resCurrData.ret === 1) {
      this.currencies = resCurrData.currencies
    }
  }
  getDecimalPlaceFormCurrency(_code) {
    const currency = filter(this.currencies, { code: _code })
    if (currency.length > 0) {
      return currency[0].decimal_place
    } else {
      return 0
    }
  }
  handleClick(tab, event) {
    const $filtes: any = this.$options.filters
    if (this.activeName === '1') {
      getDepositLimit().then((res) => {
        if (res.ret === 1) {
          this.depositBTCLimit = $filtes.formatAmount(res.data.deposit_threshold, 8)
        }
      })
    } else if (this.activeName === '2') {
      getWithdrawLimit().then((res) => {
        if (res.ret === 1) {
          this.withdrawLimt = res.data.data
        }
      })
    } else if (this.activeName === '3') {
      getDepositFees().then((res) => {
        if (res.ret === 1) {
          this.fees = res.data
        }
      })
    }
  }
  reusltPopup(type, res) {
    if (res.ret === 1) {
      this.$message({
        message: '设置成功',
        type: 'success'
      })
      switch (type) {
        case 'depositLimit':
          const $filtes: any = this.$options.filters
          getDepositLimit().then((res) => {
            this.depositBTCLimit = $filtes.formatAmount(res.data.deposit_threshold, 8)
          })
          break
        case 'withdrawLimt':
          getWithdrawLimit().then((res) => {
            if (res.ret === 1) {
              this.withdrawLimt = res.data.data
            }
          })
          break
        case 'depositFee':
          getDepositFees().then((res) => {
            if (res.ret === 1) {
              this.fees = res.data
            }
          })
          break
        default:
          break
      }
    } else {
      this.$message({
        message: res.error,
        type: 'error'
      })
    }
  }
  submitForm(type, code) {
    const refs: any = this.$refs.form
    const decimal = this.getDecimalPlaceFormCurrency(code)
    this.$confirm('确定修改？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      if (type === 'depositBTCLimit') {
        refs.validateField('depositBTCLimit', (valid:any) => {
          if (!valid) {
            setDepositLimit({btc_min_quota: accMul(this.form.depositBTCLimit, 10 ** decimal)}).then((res) => {
              this.reusltPopup('depositLimit', res)
            })
          }
        })
      } else if (type.indexOf('_onchain') >= 0) {
        refs.validateField(type, (valid:any) => {
          if (!valid) {
            setWithdrawLimit({
              [type]: accMul(this.form[type], 10 ** decimal)
            }).then((res) => {
              this.reusltPopup('withdrawLimt', res)
            })
          }
        })
      } else if (type.indexOf('fee') >= 0 || type === 'free_deposit_amount') {
        refs.validateField(type, (valid:any) => {
          if (!valid) {
            setDepositFees({
              [type]: accMul(this.form[type], 10 ** decimal)
            }).then((res) => {
              this.reusltPopup('depositFee', res)
            })
          }
        })
      }
    })
  }
}
</script>

<style lang="css" scoped>
  .el-form-item{
    /* max-width: 600px; */
  }
  .el-input{
    width: 300px;
    margin-right: 20px;
  }
</style>
