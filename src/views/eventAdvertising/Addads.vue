<template>
<el-row>
 
  <el-col :span="14" class="addads-left">
    <el-col :span="24" style="margin-bottom:20px;">
      <el-alert
      :title="titleDdit"
      type="success"
      :closable="false" v-if="titleDdit.length>0">
      </el-alert>
    </el-col>
    <div class="grid-content bg-purple">
      <el-form ref="formName" :model="formName" :rules="rules" label-width="150px" class="demo-ruleForm">
        <el-form-item label="名称:" prop="name">
          <el-input v-model.trim="formName.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="活动分类" prop="activities_id">
          <el-select v-model="formName.activities_id" placeholder="请选择活动分类" style="width:100%">
            <el-option :label="item.name" :value="item.id" v-for="item in stillselects" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告形式:" prop="a_type">
          <el-select v-model="formName.a_type" placeholder="请选择广告形式" style="width:100%">
            <el-option :label="item.label" :value="item.value" v-for="item in options" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最大可见次数:" prop="max_view">
          <el-input v-model="formName.max_view" auto-complete="off" placeholder="输入最大可见次数"></el-input>
        </el-form-item>
        <el-form-item label="每日最大可见次数:" prop="day_view">
          <el-input v-model="formName.day_view" auto-complete="off" placeholder="输入每日最大可见次数"></el-input>
        </el-form-item>
        <el-form-item label="使用素材:" prop="material_id">
          <el-select v-model="formName.material_id" placeholder="请选择使用素材" style="width:100%">
            <el-option :label="item.name" :value="item.id" v-for="item in materialselects" :key="item.id"></el-option>
          </el-select>
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
        <el-form-item label="跳转链接:" prop="redirect_url">
           <el-row>
            <el-col :span="23">
              <el-input v-model.trim="formName.redirect_url" placeholder="请输入跳转链接"></el-input>
            </el-col>
            <el-col :span="1" style="text-align:center">
              <div class="grid-content bg-purple-light">
                <i class="el-icon-info" @click="rulesOpen()" title="输入规范"></i>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="备注（选填）:">
          <el-input type="textarea" v-model="formName.note" placeholder="请输入备注（选填）"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formName.status" placeholder="">
            <el-option label="发布" value="1"></el-option>
            <el-option label="草稿" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="定时任务:">
          <el-date-picker v-model="formName.activationTime" type="datetimerange" range-separator="至" start-placeholder="激活时间" end-placeholder="下架时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('formName')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-col>
  <el-col :span="7" class="addads-right">
    <div class="grid-content bg-purple-light">
      <h2>素材预览</h2>
      <el-row v-if="img">
        <el-col :span="24">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="img" class="image">
          </el-card>
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
  stillselect,
  materialselect,
  saveForm,
  saveFormPut,
  editAdvertising,
  crowdIds
} from '@/api/addads'
import { Component, Vue, Watch } from 'vue-property-decorator'
import * as moment from 'moment'
interface formObj {
  name: string;
  activities_id: any;
  a_type: any;
  max_view: string;
  day_view: string;
  material_id: any;
  crowd_id_list: Array<any>;
  redirect_url: string;
  note: string;
  activationTime: Array<any>;
  status: any;
  advertisement_id: any;
}

@Component({})
export default class Addads extends Vue {
  nowTimer: any = '';
  formName: formObj = {
    name: '',
    activities_id: '',
    a_type: '',
    max_view: '',
    day_view: '',
    material_id: '',
    crowd_id_list: [
      {
        name: '',
        value: '',
        id: ''
      }
    ],
    redirect_url: '',
    note: '',
    activationTime: [
      // moment().format(),
      // moment()
      //   .add(7, 'days')
      //   .calendar()
    ],
    status: '1',
    advertisement_id: 0
  }
  pickerOptions1: any = {
    disabledDate(time) {
      return time.getTime() <= Date.now()
    }
  }
  stillselects: any = []
  sumArr: number = 0
  temporary: number = 0
  personSelect: any = []
  numVal: number = 0
  materialselects: any = []
  options: any = [
    {
      value: 2,
      label: '启动界面'
    },
    {
      value: 3,
      label: '首页弹框'
    },
    {
      value: 1,
      label: '文字横幅'
    }
  ]
  dropthecrowdselects: any = [
    {
      value: '1',
      label: 'Webview页面'
    },
    {
      value: '2',
      label: 'APP功能页面'
    }
  ]
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
    activities_id: [
      {
        required: true,
        message: '请选择活动分类',
        trigger: 'change'
      }
    ],
    a_type: [
      {
        required: true,
        message: '请选择广告类型',
        trigger: 'change'
      }
    ],
    max_view: [
      {
        required: true,
        message: '可见次数不能为空',
        trigger: 'blur'
      },
      { pattern: /^\d*$/, message: '可见次数必须输入数字' }
    ],
    day_view: [
      {
        required: true,
        message: '每日可见次数不能为空',
        trigger: 'blur'
      },
      { pattern: /^\d*$/, message: '每日可见次数必须输入数字' }
    ],
    material_id: [
      {
        required: true,
        message: '请选择使用素材',
        trigger: 'change'
      }
    ],
    typeop: [
      {
        required: true,
        message: '请选择跳转类型',
        trigger: 'change'
      }
    ],
    offTime: [
      {
        required: true,
        message: '请选择下架时间',
        trigger: 'change'
      }
    ],
    dropoffStatus: [
      {
        required: true,
        message: '请选择定时任务',
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
    status: [
      {
        required: true,
        message: '请选择状态',
        trigger: 'change'
      }
    ]
  }
  created() {
    let selectData = this.fetchStillselect()
    selectData.then(() => {
      this.formName.activities_id = Number(this.$route.query.add)
    })
    this.fetchCrowdId()
    if (this.$route.query.name) {
      this.$route.meta.title = '广告列表-' + this.$route.query.name + '-添加广告'
    }
    if (this.$route.params.id) {
      this.fetcheditAdvertising(this.$route.params.id)
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
  @Watch('formName.a_type')
  onChildssChanged11(val, oldVal) {
    if (this.numVal !== 0) {
      this.formName.material_id = '' // 清空选中
    }
    this.numVal++ // 实现累加 避免第一次清空
    this.temporary = Number.parseInt(val)
    this.fetchMaterialselect({
      a_type: Number.parseInt(val)
    })
  }
  // 监听状态
  // @Watch('formName.status')
  // onChildssChanged22(val, oldVal) {
  //   if(val == 2) {
  //     this.timeShow = false
  //   } else {
  //     this.timeShow = true
  //   }
  // }
  // 同时监听活动分类/使用素材/素材图片
  @Watch('formName.material_id')
  multipleSelectionChanged(val: any, oldVal: any) {
    let promiseType = this.fetchMaterialselect({
      a_type: this.temporary
    })
    promiseType.then(() => {
      let arrVal: any[] = []
      if (this.materialselects.length > 0) {
        this.materialselects.forEach((element: any) => {
          if (element.id === val) arrVal.push(element)
        })
        this.img = ''
        if (arrVal.length > 0) {
          if (arrVal[0].image_url) {
            this.img = arrVal[0].image_url
          }
        }
      }
    })
  }

  // 获取活动分类
  async fetchStillselect() {
    const resData = await stillselect()
    if (resData.ret === 1) {
      this.stillselects = resData.data.activity_list
    } else {
      this.$message({
        message: resData.error,
        type: 'error'
      })
    }
  }
  // 根据广告形式状态 请求素材接口
  async fetchMaterialselect({ ...data }) {
    const resData = await materialselect({
      ...data
    })
    if (resData.ret === 1) {
      this.materialselects = resData.data.material_list
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

  async fetcheditAdvertising(id) {
    /* eslint-disable */
    const resData = await editAdvertising({
      advertisement_id: id
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
      let onlineStatus= (id)=> {
        switch (id) {
          case 2:
            return '草稿'
          case 1:
            return '已发布'
          case 3:
            return '已激活'
          case 4:
            return '已下架'
          default:
            return '-'
        }  
      }
      this.titleDdit=`当前状态: ${onlineStatus(resData.data.online_status)}`
      this.formName = {
        name: resData.data.name,
        activities_id: resData.data.activity_id,
        a_type: resData.data.a_type,
        max_view: resData.data.max_view,
        day_view: resData.data.day_view,
        material_id: resData.data.material_id,
        crowd_id_list: resData.data.crowd_list,
        redirect_url: resData.data.redirect_url,
        activationTime: [
          momentFun(resData.data.start_time),
          momentFun(resData.data.end_time)
        ],
        note: resData.data.note,
        status: resData.data.online_status != 2 ? resData.data.online_status = '1' : resData.data.online_status = '2',
        advertisement_id: resData.data.advertisement_id
      }
    }
  }
  async fetchSaveForm({ datas }) {
    if (this.$route.query.edit){
      const resData = await saveFormPut(datas)
      if (resData.ret === 1) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      } else {
        this.$message.error(resData.error)
        return
      }
    }else{
      const resData = await saveForm(datas)
      if (resData.ret === 1) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      } else {
        this.$message.error(resData.error)
        return
      }
    }
    this.$router.push({
      path: `/admanagement/advertisinglist/${this.$route.query.add}/?name=${this.$route.query.name}`
    })
  }
  submitForm(formName) {
    const $ref: any = this.$refs[formName]
    $ref.validate((valid: any): any => {
      if (valid) {
        let formNameData = Object.assign(
          {},
          {
            start_time: this.formName.activationTime[0],
            end_time: this.formName.activationTime[1]
          },
          this.formName
        )
        delete formNameData.activationTime
        formNameData.a_type = Number(formNameData.a_type)
        let listId = formNameData.crowd_id_list.map(elm => {
          if (elm.id) return elm.id
        })
        delete formNameData.crowd_id_list
        formNameData.crowd_id_list = listId
        formNameData.name = this.formName.name
        formNameData.material_id = this.formName.material_id
        formNameData.max_view = this.formName.max_view
        formNameData.day_view = this.formName.day_view
        if (this.$route.params.id) {
          // 编辑添加广告id和活动id 
          delete formNameData.activities_id
          formNameData.advertisement_id = Number(this.$route.params.id)
        }else{
          // 新增删除广告id
          delete formNameData.advertisement_id
        }
        formNameData.redirect_url = this.formName.redirect_url
        formNameData.note = this.formName.note
        formNameData.status = Number(this.formName.status)
        this.fetchSaveForm({
          datas: formNameData
        })
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
    window.location.href =
      'https://github.com/mobiwallet/btcc-mobi-ios/wiki/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%91%BD%E4%BB%A4%E5%8D%8F%E8%AE%AE'
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
