/* eslint-disable */
<template>
  <el-row  v-loading="loading">
    <el-col :span="22">
      <div class="app-container">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="名称：" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="来源：" prop="crowd_type">
                <el-radio label="上传文件"  v-model="form.crowd_type" @change="changeSource('file')"></el-radio>
                <el-radio label="组合筛选" v-model="form.crowd_type" @change="changeSource('group')"></el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="22" v-if = "form.crowd_type">
              <CrowdItemGroup 
                ref="refCrowdItemGroup"
                :sourceFlag="curSource"
                :detail="detail"
                :countryOptions="countryList"
                :currencyOptions="currencyList"
                @initGroup = 'removeLoading'
              />
            </el-col>
            <el-col :span="22">
              <el-form-item label="备注（可选）：">
                <el-input type="textarea" v-model="form.description"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item>
                <el-button  size="middel" type="primary" @click="onSubmit('form')">保存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>
<script lang='ts'>
import {
  Component,
  Vue
} from 'vue-property-decorator'
import {
  getCrowdDetail,
  saveCrowd,
  updateCrowd
} from '@/api/crowd'
import { queryCountry, queryCurrency } from '@/api/golbal'
import CrowdItemGroup from '@/components/CrowdFormGroup'
import {
  State
} from 'vuex-class'

@Component({
  components: {
    CrowdItemGroup
  }
})
export default class CrowdEdit extends Vue {
  @State('golbal') stateGolbal
  detail: any = {}
  crowd_id: number | string
  curSource: number = 0
  loading: boolean = false
  form: any = {
    name: '',
    crowd_type: 0,
    description: ''
  }
  validateName = (rule, value, callback) => {
    if (!value.trim()) {
      callback(new Error('请输入名称'))
    } else {
      callback()
    }
  }
  validateType = (rule, value, callback) => {
    if (value !== 0) {
      callback()
    } else {
      callback(new Error('请选择来源'))
    }
  }
  rules = {
    name: [
      { validator: this.validateName, trigger: 'blur' }
    ],
    crowd_type: [
      { validator: this.validateType, trigger: 'blur' }
    ]
  }
  countryList: Array<any> = []
  currencyList: Array<any> = []
  mounted() {
    this.queryCountryList()
  }
  async getCrowdDetail(crowd_id) {
    this.loading = true
    this.$set(this, 'crowd_id', crowd_id)
    const resData = await getCrowdDetail({ crowd_id })
    if (resData.ret === 1) {
      this.detail = resData.data
      this.$set(this, 'detail', resData.data)
      this.$set(this.form, 'name', this.detail['name'])
      this.$set(this.form, 'crowd_type', this.detail['type'] === 1 ? '上传文件' : '组合筛选')
      this.$set(this.form, 'description', this.detail['description'])
      this.curSource = this.detail['type']
      setTimeout(() => {
        const refsComp: any = this.$refs.refCrowdItemGroup
        refsComp.fillFormData()
      }, 1000)
    }
  }
  removeLoading(e) {
    if (e) {
      this.loading = false
    }
  }
  async queryCountryList() {
    if (this.stateGolbal['country'] && this.stateGolbal['country'].length) {
      const countries = this.formatCountryOpt(this.stateGolbal['country'])
      this.$set(this, 'countryList', countries)
    } else {
      const resData = await queryCountry()
      if (resData.ret === 1) {
        const countries = this.formatCountryOpt(resData.countries)
        this.$store.commit('SET_COUNTRY', resData.countries)
        this.$set(this, 'countryList', countries)
      } else {
        this.loading = false
      }
    }
    if (this.stateGolbal['currency'] && this.stateGolbal['currency'].length) {
      const currencies = this.formatCurrencyOpt(this.stateGolbal['currency'])
      this.$set(this, 'currencyList', currencies)
    } else {
      const resCurrData = await queryCurrency()
      if (resCurrData.ret === 1) {
        const currencies = this.formatCurrencyOpt(resCurrData.currencies)
        this.$store.commit('SET_CURRENCY', resCurrData.currencies)
        this.$set(this, 'currencyList', currencies)
      } else {
        this.loading = false
      }
    }
    if (this.$route.query && this.$route.query.crowd_id) {
      this.crowd_id = this.$route.query.crowd_id
      this.getCrowdDetail(this.crowd_id)
    }
  }
  formatCountryOpt(temp) {
    const result = temp.map(ele => {
      return {
        key: ele.iso2,
        label: ele.name,
        value: ele.iso2
      }
    })
    return result
  }
  formatCurrencyOpt(temp) {
    const result = temp.map(ele => {
      return {
        key: ele.code,
        label: ele.name,
        value: ele.code
      }
    })
    return result
  }
  changeSource(e) {
    this.curSource = e === 'file' ? 1 : 2
  }
  onSubmit() {
    const refs: any = this.$refs.form
    let validateFail = false
    let validateFormGroup
    refs.validate((valid:any) => {
      if (valid) {
        return true
      } else {
        validateFail = true
        return false
      }
    })
    const refsFormGroupComp: any = this.$refs.refCrowdItemGroup
    if (!refsFormGroupComp) {
      validateFormGroup = {
        flag: false,
        sourceFlag: this.curSource
      }
    } else {
      validateFormGroup = refsFormGroupComp.validateForm()
    }
    if (!validateFormGroup.flag) {
      if (validateFormGroup.sourceFlag === 1) {
        this.messageAlert('请上传文件', 'warning')
      }
    }
    if (!validateFail && validateFormGroup.flag) {
      this.saveCrowdHandle(this.formateFormData())
    }
  }
  formateFormData() {
    const refsFormGroupComp_: any = this.$refs.refCrowdItemGroup
    const formateTotalForm = refsFormGroupComp_.formateData()
    formateTotalForm['name'] = this.form.name
    formateTotalForm['crowd_type'] = this.form.crowd_type === '上传文件' ? 1 : 2
    formateTotalForm['description'] = this.form.description
    if (this.crowd_id) {
      formateTotalForm['crowd_id'] = this.crowd_id
    }
    return formateTotalForm
  }
  async saveCrowdHandle(calData:any) {
    this.loading = true
    let retFlag: any
    if (calData.crowd_id) {
      const resData = await updateCrowd({ calData })
      retFlag = resData
    } else {
      const resUpData = await saveCrowd({ calData })
      retFlag = resUpData
    }
    if (retFlag.ret === 1) {
      this.messageAlert('保存成功', 'success', false, () => {
        this.$router.push({name: 'crowdList'})
      })
    } else {
      this.messageAlert(retFlag.error || '保存失败', 'error')
    }
    this.loading = false
  }
  messageAlert(message:string, type?:any, showClose?:boolean, cb?:Function) {
    if (!cb) {
      cb = () => {}
    }
    this.$message({
      message: message,
      type: type || 'warning',
      showClose: showClose || false,
      onClose: cb()
    })
  }
}
</script>

<style lang='scss' scoped>
.pointerIcon {
  cursor: pointer
}
.highColor {
  padding: 0 10px;
  color: #409EFF
}
.group-container {
  padding-left: 120px;
}
</style>
