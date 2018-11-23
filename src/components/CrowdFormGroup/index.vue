/* eslint-disable */
<template>
  <el-row  v-loading="groupLoading">
    <el-col :span="24">
      <div class="app-container">
        <el-form ref="formGroup" :model="formGroup" label-width="120px">
          <div class='group-container'>
            <el-upload
                class="upload-demo"
                v-if = "sourceFlag === 1 "
                ref="upload"
                :multiple="false"
                action="/crowd/upload_file"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleFileSuccess"
                :on-error="handleFileError"
                :on-change="handleFileChange"
                :file-list="fileList"
                :auto-upload="false">
                <el-button slot="trigger" size="small" >选取文件</el-button>
                <div slot="tip" class="el-upload__tip">支持扩展名:.csv</div>
            </el-upload>
            <span v-if = "sourceFlag === 1 && file_url_flag" class="downFileBtn" @click="downLoadFile(file_name,file_url)">{{file_name}}</span>
          </div>
          <div v-for="(group, groupKey) in groupItemObj" :key ='groupKey' class='group-container' v-if = "sourceFlag === 2 ">
            <el-row>
              <el-col :span="12" v-for="domain in groupItemObj[groupKey]" :key ='domain.key' v-if = "groupItemObj[groupKey]">
                <el-form-item
                  :label="domain.label"
                  :key="domain.key"
                  :prop="domain.key + '_' + groupKey"
                  :rules="{
                    required: true, message: '不能为空', trigger: 'blur'
                  }"
                >
                  <template v-if="domain.type == 'input'">
                    <el-input v-model="domain[domain.key]" @change="inputChangeHandle(groupKey, domain)" style="width:80%"></el-input>
                  </template>
                  <template  v-if="domain.type == 'multipleSelect'">
                    <el-select
                      style="width:80%"
                      filterable
                      v-model="domain[domain.key]"
                      multiple
                      @change = "selChange($event, groupKey, domain)"
                      placeholder="请选择">
                      <el-option
                        v-for="item in domain.options"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                  <template v-if="domain.type =='select'">
                    <el-select filterable v-model="domain[domain.key]" @change = "selChange($event, groupKey, domain)" style="width:80%">
                      <el-option
                        v-for="item in domain.options"
                        v-show="!item.hidden"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <i class="el-icon-remove-outline pointerIcon delGroup" v-if = "domain.key.indexOf('classify')> -1" @click = "removeGroupItem(groupKey)"></i>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-form-item v-if = "sourceFlag === 2 ">
            <el-button  size="middel" @click="addClassify">+ 添加分类</el-button>
          </el-form-item>
          <el-form-item label="">
            <span class="commonColor">共约<span class="highColor">{{total_user}}</span>用户</span>
            <span class="highColor pointerIcon" @click ="fresh">
              <span v-show="sourceFlag === 2">刷新</span>
            </span>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script lang='ts'>
import {
  Component,
  Prop,
  Watch,
  Vue
} from 'vue-property-decorator'
import {
  getCrowdCalculate,
  upload_file
} from '@/api/crowd'
@Component
export default class CrowdItemGroup extends Vue {
  @Prop()
  sourceFlag: Number
  @Prop()
  detail: any
  @Prop()
  countryOptions: Array<any>
  @Prop()
  currencyOptions: Array<any>
  groupLoading: boolean = false
  total_user: Number = 0
  old_group_total_user: Number = 0
  old_file_total_user: Number = 0
  fileList: Array<any> = []
  file_name: string = ''
  file_url: string = ''
  file_url_flag: boolean = false
  primary_key: string = ''
  addLegth: any = 0
  classifyIndex: any = 1
  groupItemObj: any = {}
  formGroup: any = {}
  selGroupList: Array<string> = []
  classifyOptiton: Array<any> = [
    {
      label: '国家',
      value: 'country',
      hidden: false
    }, {
      label: '资产量',
      value: 'assets',
      hidden: false
    }, {
      label: 'OTC交易量',
      value: 'otc_tx',
      hidden: false
    },
    // {
    //   label: '活跃用户',
    //   value: 'active_user',
    //   hidden: false
    // },
    {
      label: '平台',
      value: 'platform',
      hidden: false
    }
  ]
  groupItemData: any = {
    country: [{
      key: 'countries',
      countries: '',
      label: '国家：',
      type: 'multipleSelect',
      options: this.countryOptions
    }],
    assets: [{
      key: 'currency',
      currency: '',
      label: '选择币种：',
      type: 'select',
      options: this.currencyOptions
    }, {
      key: 'query_type',
      query_type: '',
      label: '选择查询分类：',
      type: 'select',
      options: [{
        label: '排名',
        key: 'rank',
        value: 'rank'
      }, {
        label: '限额',
        key: 'quota',
        value: 'quota'
      }]
    }, {
      key: 'interval',
      interval: '',
      label: '输入范围：',
      type: 'input'
    }],
    otc_tx: [{
      key: 'currency',
      currency: '',
      label: '选择币种：',
      type: 'select',
      options: this.currencyOptions
    }, {
      key: 'query_type',
      query_type: '',
      label: '选择查询分类：',
      type: 'select',
      options: [{
        label: '排名',
        key: 'rank',
        value: 'rank'
      }, {
        label: '限额',
        key: 'quota',
        value: 'quota'
      }]
    }, {
      key: 'interval',
      interval: '',
      label: '输入范围：',
      type: 'input'
    }],
    active_user: [{
      key: 'day_limit',
      day_limit: '',
      label: '天数范围：',
      type: 'input'
    }],
    platform: [{
      key: 'operate_systom',
      operate_systom: '',
      label: '操作系统：',
      type: 'select',
      options: [{
        label: 'iOS',
        key: 'ios',
        value: 'ios'
      }, {
        label: '安卓',
        key: 'android',
        value: 'android'
      }]
    }]
  }
  @Watch('sourceFlag')
  onChildChanged(val: Number, oldVal: string) {
    this.total_user = val === 2 ? this.old_group_total_user : this.old_file_total_user
  }
  fillFormData() {
    console.info(this.detail, 'detail')
    this.total_user = this.detail.correspond_customer_ids_count
    this.old_group_total_user = this.detail.correspond_customer_ids_count
    if (this.detail.type === 1) {
      this.file_name = this.detail.file_name
      this.file_url = this.detail.file_url
      this.file_url_flag = true
    } else {
      for (let i in this.detail.query_criteria) {
        if (['assets', 'otc_tx'].indexOf(i) > -1) {
          this.detail.query_criteria[i].forEach((ele, index) => {
            this.addGroupItem(i, `${i}_${index}`, ele, true)
          })
        } else {
          this.addGroupItem(i, i, this.detail.query_criteria[i], true)
        }
      }
    }
    this.$emit('initGroup', true)
  }
  inputChangeHandle(groupKey, item) {
    this.$set(this.formGroup, `${item.key}_${groupKey}`, item[item.key])
  }
  addClassify() {
    for (let i in this.groupItemObj) {
      if (this.groupItemObj[i].length === 1) {
        return
      }
    }
    this.$set(this.groupItemObj, `domains${this.classifyIndex}`, [])
    this.groupItemObj[`domains${this.classifyIndex}`].push({
      key: `classify`,
      classify: '',
      label: '选择分类：',
      type: 'select',
      options: this.classifyOptiton
    })
    this.$set(this.formGroup, `classify_domains${this.classifyIndex}`, '')
    this.classifyIndex++
    this.addLegth = 0
  }
  removeGroupItem(groupKey: string) {
    const val = this.groupItemObj[groupKey][0]['classify']
    if (this.selGroupList.indexOf(val) > -1) {
      this.selGroupList.splice(this.selGroupList.indexOf(val), 1)
    }
    this.hideClassifyOpt()
    this.$delete(this.groupItemObj, groupKey)
  }
  hideClassifyOpt() {
    this.classifyOptiton.forEach(ele => { ele.hidden = false })
    for (let i in this.groupItemObj) {
      if (this.groupItemObj[i][0]['classify'] === 'country') {
        this.classifyOptiton[0].hidden = true
      }
      if (this.groupItemObj[i][0]['classify'] === 'platform') {
        this.classifyOptiton[this.classifyOptiton.length - 1].hidden = true
      }
    }
  }
  selChange(e:string, key:string, item?:any) {
    if (item) {
      this.$set(this.formGroup, `${item.key}_${key}`, item[item.key])
    }
    if (item.key !== 'classify') {
      return
    }
    if (this.addLegth) {
      this.groupItemObj[key].splice(1, this.groupItemObj[key].length - 1)
    }
    let addGroupData
    switch (e) {
      case 'country':
        addGroupData = []
        break
      case 'assets':
        addGroupData = {
          currency: '',
          query_type: '',
          interval: ''
        }
        break
      case 'otc_tx':
        addGroupData = {
          currency: '',
          query_type: '',
          interval: ''
        }
        break
      case 'active_user':
      case 'platform':
        addGroupData = ''
        break
    }
    this.addGroupItem(e, key, addGroupData, false)
  }
  addGroupItem(type:string, key:string, groupData?:any, isAddClassify?:Boolean) {
    if (isAddClassify) {
      this.$set(this.groupItemObj, key, [])
      this.groupItemObj[key].push({
        key: `classify`,
        classify: type,
        label: '选择分类：',
        type: 'select',
        options: this.classifyOptiton
      })
      this.$set(this.formGroup, `classify_${key}`, type)
    }
    this.hideClassifyOpt()
    this.addLegth = this.groupItemData[type].length
    let temp = JSON.parse(JSON.stringify(this.groupItemData[type]))
    temp.forEach(element => {
      if (groupData instanceof Object && !(groupData instanceof Array)) {
        element[element.key] = groupData[element.key]
        this.$set(this.formGroup, `${element.key}_${key}`, groupData[element.key])
      } else {
        element[element.key] = groupData
        this.$set(this.formGroup, `${element.key}_${key}`, groupData)
      }
    })
    this.$set(this.groupItemObj, key, this.groupItemObj[key].concat(temp))
  }
  formateData() {
    const result = {
      query_criteria: {},
      file_primary_key: ''
    }
    if (this.sourceFlag === 1) {
      result.file_primary_key = this.primary_key
    } else if (this.sourceFlag === 2) {
      for (let i in this.groupItemObj) {
        if (this.groupItemObj[i] instanceof Array) {
          switch (this.groupItemObj[i][0].classify) {
            case 'country' :
              result.query_criteria['country'] = this.groupItemObj[i][1].countries
              break
            case 'assets' :
              result.query_criteria['assets'] = result.query_criteria['assets'] || []
              let assetItem = {}
              this.groupItemObj[i].forEach((ele, index) => {
                if (index > 0) {
                  assetItem[ele.key] = ele[ele.key]
                }
              })
              result.query_criteria['assets'].push(assetItem)
              break
            case 'otc_tx' :
              result.query_criteria['otc_tx'] = result.query_criteria['otc_tx'] || []
              let chainItem = {}
              this.groupItemObj[i].forEach((ele, index) => {
                if (index > 0) {
                  chainItem[ele.key] = ele[ele.key]
                }
              })
              result.query_criteria['otc_tx'].push(chainItem)
              break
            case 'active_user' :
              // result.group['active_user'] = this.groupItemObj[i][1].day_limit
              break
            case 'platform' :
              result.query_criteria['platform'] = this.groupItemObj[i][1].operate_systom
              break
          }
        }
      }
    }
    return result
  }
  handleRemove(file, fileList) {
    this.file_url_flag = true
  }
  handlePreview(file) {
    this.downLoadFile(file.name, file.url)
  }
  downLoadFile(name, url) {
    var a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    window.URL.revokeObjectURL(url)
  }
  handleFileChange(file, fileList) {
    const curFile = fileList[fileList.length - 1]
    this.fileList = []
    this.fileList.push(curFile)
    this.file_name = file.name
    var formData = new FormData()
    formData.append('crowd_file', file.raw, file.name)
    this.calFileTotalUser(formData)
  }
  handleFileSuccess(response, file, fileList) {
    console.log(response, file, fileList)
  }
  handleFileError(response, file, fileList) {
    console.log(response, file, fileList)
  }
  async calFileTotalUser(crowd_file:any) {
    this.groupLoading = true
    const resData = await upload_file(crowd_file)
    if (resData.ret === 1) {
      this.total_user = resData.data.relevant_customers_count
      this.old_group_total_user = resData.data.relevant_customers_count
      this.primary_key = resData.data.primary_key
      this.file_url_flag = false
    } else {
      this.messageAlert(resData.error, 'warning')
    }
    this.groupLoading = false
  }
  fresh() {
    const valdateResult = this.validateForm()
    if (valdateResult.flag) {
      this.calculateTotalUser(this.formateData())
    }
  }
  validateForm() {
    let result = {
      flag: true,
      sourceFlag: this.sourceFlag
    }
    if (this.sourceFlag === 1) {
      if (this.fileList && this.fileList.length === 0) {
        result['flag'] = false
      }
    }
    if (this.sourceFlag === 2) {
      const refsGroup: any = this.$refs.formGroup
      refsGroup.validate((valid:any) => {
        if (valid) {
          return true
        } else {
          result['flag'] = false
          return false
        }
      })
    }
    return result
  }
  async calculateTotalUser(calData:any) {
    this.groupLoading = true
    const query_criteria = calData['query_criteria']
    const resData = await getCrowdCalculate({ query_criteria })
    if (resData.ret === 1) {
      this.total_user = resData.data.relevant_customers_count
      this.old_group_total_user = resData.data.relevant_customers_count
    } else {
      this.messageAlert(resData.error, 'warning')
    }
    this.groupLoading = false
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
.delGroup{
  padding:0 10px
}
.highColor {
  padding: 0 5px;
  color: #409EFF
}
.group-container {
  padding-left: 120px;
}
.downFileBtn{
  display: inline-block;
  padding:5px;
  cursor: pointer;
  margin-top:10px;
  color: #409EFF
}
</style>
