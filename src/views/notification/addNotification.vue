<template>
<el-row>
  <el-col :span="14" class="addads-left">
    <div class="grid-content bg-purple">
      <el-form ref="formName" :model="formName" :rules="rules" label-width="150px" class="demo-ruleForm">
        <el-form-item label="名称:" prop="name">
          <el-input v-model.trim="formName.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <p style="font-size:20px;text-indent: 70px;">使用素材</p>
        <!-- <el-form-item label="标题（选填）:">
          <el-select v-model="formName.title_material" placeholder="请选择标题" style="width:100%">
            <el-option :label="item.name" :value="item.id" v-for="item in Titleselects" :key="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="语言:" prop="language">
          <el-select v-model="formName.language" placeholder="请选择语言" style="width:100%">
            <el-option label="中文" value="CN"></el-option>
            <el-option label="英文" value="EN"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容:" prop="content_material" v-if="formName.language">
          <el-select v-model="formName.content_material" placeholder="请选择内容" style="width:100%">
            <el-option :label="item.name" :value="item.id" v-for="item in ContentSelects" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转:" prop="p_type">
          <el-select v-model="formName.p_type" placeholder="请选择跳转方式" style="width:100%">
            <el-option :label="item.name" :value="item.id" v-for="item in materialselects" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="站内信标题:" prop="station_title" v-if="formName.p_type===1">
          <el-select v-model="formName.station_title" placeholder="请选择站内信标题" style="width:100%">
            <el-option :label="item.name" :value="item.id" v-for="item in InsideTitleList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="站内信正文:" prop="station_content" v-if="formName.p_type===1">
          <el-select v-model="formName.station_content" placeholder="请选择站内信正文" style="width:100%">
            <el-option :label="item.name" :value="item.id" v-for="item in InsideContentList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面URL:" prop="redirect_url" v-if="formName.p_type===2">
          <el-row>
            <el-col :span="23">
              <el-input v-model.trim="formName.redirect_url" placeholder="请输入页面URL"></el-input>
            </el-col>
            <el-col :span="1" style="text-align:center">
              <div class="grid-content bg-purple-light">
                <i class="el-icon-info" @click="rulesOpen()" title="输入规范"></i>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-for="(item,index) in formName.crowd_id_list" :label="index==0?'投放人群':''" :key="item.key" :prop="'crowd_id_list.' + index + '.id'" :rules="{
        required: true, message: '请选择投放人群', trigger: 'change'
      }">
          <el-row>
            <el-col :span="23">
              <div class="grid-content bg-purple">
                <el-select v-model="item.id" placeholder="请选择投放人群" style="width:100%">
                  <el-option :label="item1.name" :value="item1.id" v-for="item1 in personSelect" :key="item1.id"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="1" style="text-align:center">
              <div class="grid-content bg-purple-light">
                <i class="el-icon-delete" @click="removePeople(index)"></i>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="addto">
          <el-button type="primary" @click="addto()" style="width:100%">添加</el-button>
        </div>
        <div class="addto" style="margin-bottom:10px;">
          共约{{sumArr}}人用户
        </div>
        <el-form-item label="备注（选填）:">
          <el-input type="textarea" v-model="formName.note" placeholder="请输入备注（选填）"></el-input>
        </el-form-item>
        <el-form-item label="定时任务">
          <el-switch v-model="formName.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="发布时间" prop="perform_time" v-if="formName.delivery">
          <el-col :span="11">
            <el-date-picker
              v-model="formName.perform_time"
              type="datetime"
              :picker-options="pickerOptions"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('formName', 1)">保存</el-button>
          <el-button type="primary" @click="submitForm('formName', 2)" v-if="!formName.delivery">立即发布</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-col>
  <el-col :span="7" class="addads-right">
    <div class="grid-content bg-purple-light">
      <h2>素材预览</h2>
      <el-row v-if="(formName.title_material ===0 || formName.title_material) || (formName.content_material ===0 || formName.content_material)">
        <el-col :span="18">
          <div>
            <div>{{formNameTitle(formName.title_material)}}</div>
            <p>{{formName.content_materialPreview}}</p>
          </div>
        </el-col>
      </el-row>
      <el-row v-else>
        无
      </el-row>
    </div>
  </el-col>
  <el-col :span="1" class="addads-right"></el-col>
</el-row>
</template>

<script lang="ts">
import {
  crowdIds,
  getPushDetail,
  getDetailList,
  addPush,
  modifyPush,
  materialContent
} from '@/api/notification'
import { Component, Vue, Watch } from 'vue-property-decorator'
import * as moment from 'moment'
interface formObj {
  name: string;
  title_material: string | number;
  language: any;
  content_material: any;
  p_type: string | number;
  station_title: any;
  station_content: any;
  redirect_url: string;
  content_materialPreview: string;
  crowd_id_list: Array<any>;
  note: string;
  delivery: boolean;
  perform_time: any;
  push_status: number;
}

@Component({})
export default class Addads extends Vue {
  nowTimer: any = '';
  formName: formObj = {
    name: '',
    title_material: '',
    language: '',
    content_material: '',
    content_materialPreview: '',
    p_type: '',
    station_title: '',
    station_content: '',
    redirect_url: '',
    crowd_id_list: [
      {
        name: '',
        value: '',
        id: ''
      }
    ],
    note: '',
    delivery: false,
    perform_time: '',
    push_status: 0
  }
  pickerOptions: any = {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7
    }
  }
  Titleselects: any = []
  ContentSelects: any = []
  sumArr: number = 0
  displayNum: any = ''
  temporary: number = 0
  personSelect: any = []
  InsideTitleList: any = []
  InsideContentList: any = []
  numVal: number = 0
  materialselects: any = [
    {
      name: '站内信',
      id: 1
    },
    {
      name: '页面URL',
      id: 2
    }]
  img: any = ''
  titleDdit: any = ''
  currentDate: Object = new Date()
  rules: Object = {
    name: [
      {
        required: true,
        message: '请输入活动名称',
        trigger: 'blur'
      }
    ],
    title_material: [
      {
        required: true,
        message: '请选择活动分类',
        trigger: 'change'
      }
    ],
    language: [
      {
        required: true,
        message: '请选择语言',
        trigger: 'change'
      }
    ],
    p_type: [
      {
        required: true,
        message: '请选择跳转类型',
        trigger: 'change'
      }
    ],
    station_content: [
      {
        required: true,
        message: '请选择内容',
        trigger: 'change'
      }
    ],
    station_title: [
      {
        required: true,
        message: '请选择站内信标题',
        trigger: 'change'
      }
    ],
    content_material: [
      {
        required: true,
        message: '请选择站内信内容',
        trigger: 'change'
      }
    ],
    redirect_url: [
      {
        required: true,
        message: '请输入跳转链接',
        trigger: 'blur'
      }
    ],
    perform_time: [
      {
        required: true,
        message: '请选择时间',
        trigger: 'blur'
      }
    ]
  }
  created() {
    this.fetchCrowdId()
    this.fetchGetDetailList({a_type: 4})
    this.fetchGetDetailList({a_type: 5})
    this.fetchGetDetailList({a_type: 6})
    this.fetchGetDetailList({a_type: 7})
    if (this.$route.params.id) {
      this.fetchGetPushDetail(this.$route.params.id)
    }
  }
  @Watch('formName.crowd_id_list', {
    deep: true
  })
  onChildChanged(val: any, oldVal: any) {
    setTimeout(() => {
      if (this.personSelect) {
        let dataArr: any = []
        for (let i = 0; i < this.personSelect.length; i++) {
          for (let y = 0; y < val.length; y++) {
            if (val[y].id === this.personSelect[i].id) {
              dataArr.push(this.personSelect[i])
            }
          }
        }
        this.sumArr = 0
        dataArr.forEach(elm => {
          this.sumArr += elm.relevant_customers_count
        })
      }
    }, 1000)
  }

  @Watch('formName.content_material', {
    deep: true
  })
  onChildMaterial(val: any, oldVal: any) {
    this.fetchMaterialContent({
      material_id: val,
      language: this.formName.language
    })
  }

  // 获取素材对应的预览内容
  async fetchMaterialContent(data) {
    const resData = await materialContent(data)
    if (resData.ret === 1) {
      this.formName.content_materialPreview = resData.data.content
    } else {
      this.$message({
        message: resData.error,
        type: 'error'
      })
    }
  }

  // 拉取人群
  async fetchCrowdId() {
    const resData = await crowdIds()
    if (resData.ret === 1) {
      this.personSelect = resData.data.crowds
    } else {
      this.$message({
        message: resData.error,
        type: 'error'
      })
    }
  }
  // 站内信标题
  async fetchGetDetailList(data) {
    const resData = await getDetailList(data)
    if (resData.ret === 1) {
      switch (data.a_type) {
        case 4:
          this.Titleselects = resData.data.material_list
          break
        case 5:
          this.ContentSelects = resData.data.material_list
          break
        case 6:
          this.InsideTitleList = resData.data.material_list
          break
        default:
          this.InsideContentList = resData.data.material_list
      }
    } else {
      this.$message({
        message: resData.error,
        type: 'error'
      })
    }
  }

  // 筛选标题
  formNameTitle(num) {
    if (num && this.Titleselects.length > 0) {
      return this.Titleselects.filter(elm => {
        if (elm.id === num) return elm
      })[0].name
    }
  }
  // 筛选内容
  formNameContent(num) {
    if (num && this.ContentSelects.length > 0) {
      return this.ContentSelects.filter(elm => {
        if (elm.id === num) return elm
      })[0].name
    }
  }
  async fetchGetPushDetail(id) {
    /* eslint-disable */
    const resData = await getPushDetail({
      push_id: id
    })
    if (resData.ret === 1) {
      let momentFun = num => {
        //   时间为空  ，取默认值
        if (!num) return new Date()
        let startDate: any = {}
        startDate.Year = Number(moment.unix(Number(num)).format('YYYY'))
        startDate.Month = Number(moment.unix(Number(num)).format('MM')) - 1 
        startDate.Day = Number(moment.unix(Number(num)).format('DD'))
        startDate.Hours = Number(moment.unix(Number(num)).format('HH'))
        startDate.Minutes = Number(moment.unix(Number(num)).format('mm'))
        startDate.Seconds = Number(moment.unix(Number(num)).format('ss'))
        return new Date(
          startDate.Year,
          startDate.Month,
          startDate.Day,
          startDate.Hours,
          startDate.Minutes,
          startDate.Seconds
        )
      }
      this.formName = {
        name: resData.data.name,
        p_type: resData.data.p_type,
        crowd_id_list: resData.data.crowd_id_list,
        redirect_url: resData.data.redirect_url,
        note: resData.data.note,
        perform_time: momentFun(resData.data.perform_time),
        title_material: resData.data.title_material,
        station_content: resData.data.station_content,
        station_title: resData.data.station_title,
        content_material: resData.data.content_material,
        language: resData.data.language,
        delivery: resData.data.perform_time ? true : false,
        push_status: resData.data.push_status,
        content_materialPreview: resData.data.material_info
      }
    }
  }
  async fetchAddPush(formNameData) {
    const resData = this.$route.params.id ? await modifyPush({push_id:parseInt(this.$route.params.id), ...formNameData}) : await addPush(formNameData)
    if (resData.ret === 1) {
      this.$message({
        type: 'success',
        message: '成功!'
      })
      this.$router.push({
        path: `/admanagement/notification`
      })
    } else {
      this.$message({
        message: resData.error,
        type: 'error'
      })
    }
  }

  submitForm(formName, num) {
    const $ref: any = this.$refs[formName]
    let comFun = (formNameData) => {
      let crowdList: any[] = []
      for (let prop in formNameData) {
        if(!formNameData[prop]) delete formNameData[prop]
      }
      formNameData.crowd_id_list.forEach((elm) =>{
        crowdList.push(elm.id)
      })
      formNameData.crowd_id_list = crowdList
    } 
    $ref.validate((valid: any): any => {
      if (valid) {
        let formNameData = {...this.formName}
        if (num !== 1) {
          formNameData.push_status = 1
          delete formNameData.delivery
          delete formNameData.perform_time
          comFun(formNameData)
          this.fetchAddPush(formNameData)  
          return
        }
        if (formNameData.delivery) {
          if (formNameData.perform_time) {
            formNameData.push_status = 2
            if (formNameData.perform_time.getTime() > new Date().getTime()) {
              delete formNameData.delivery
              comFun(formNameData)
              formNameData.perform_time = parseInt(moment(formNameData.perform_time).format('X'))
              this.fetchAddPush(formNameData)
            } else {
              this.$message({
                message: '定时任务时间必须大于当前时间',
                type: 'error'
              })
            } 
          }
        } else {
          formNameData.push_status = 0
          delete formNameData.delivery
          delete formNameData.perform_time
          comFun(formNameData)
          this.fetchAddPush(formNameData)
        }
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
  addto() {
    this.formName.crowd_id_list.push({
      value: '',
      name: '',
      id: ''
    })
  }
  removePeople(index) {
    if (this.formName.crowd_id_list.length <= 1) {
      this.$message.error('最少填写一个')
      return
    }
    this.formName.crowd_id_list.splice(index, 1)
  }
  rulesOpen() {
    window.open('https://github.com/mobiwallet/btcc-mobi-ios/wiki/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%91%BD%E4%BB%A4%E5%8D%8F%E8%AE%AE')  
  }
}
</script>

<style scoped>
.addads-left {
  padding: 60px 100px 0 70px;
}

.addads-right {
  padding-left: 80px 20% 0 70px;
}

.people-num {
  margin-bottom: 20px;
}

.image {
  width: 100%;
}

.addto {
  margin-top: 10px;
  padding-left: 150px;
}

.el-icon-delete {
  cursor: pointer;
}

.demo-ruleForm {
  margin-top: 20px;
}
</style>
