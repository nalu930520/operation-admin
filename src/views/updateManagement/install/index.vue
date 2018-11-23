<template lang="html">
  <div class="app-container">
    <p>更新地址：https://www.mobi.me （移动版）</p>
    <h3>iOS企业版</h3>
    <el-form label-width="100px" v-loading="loadingIos">
      <el-form-item label="当前版本：">
        <span>{{formIos.current_version}}</span>
      </el-form-item>
      <el-form-item label="安装包大小：">
        <span>{{parseInt(formIos.file_size / 1024 / 1024)}} M</span>
      </el-form-item>
      <el-form-item label="更新时间：">
        <span>{{formIos.updated_at | timerFilter}}</span>
      </el-form-item>
      <el-form-item label="操作人：">
        <span>{{formIos.operation_user}}</span>
      </el-form-item>
      <el-form-item label="版本号：">
        <el-input
          @blur="blurUpload(actionNameIos, 'actionNameIos')"
          v-model="actionNameIos">
        </el-input>
      </el-form-item>
      <el-form-item label="ipa安装包：">
        <el-upload
          class="upload-demo"
          :limit="1"
          accept=".ipa"
          :http-request="handleFile"
          ref="uploadIos"
          :action="action"
          :disabled="iosDisabled">
          <el-button size="small">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
          <div slot="tip" class="el-upload__tip">支持扩展名: .ipa</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="upload('ios')">立即更新</el-button>
      </el-form-item>
    </el-form>
    <h3>安卓版</h3>
    <el-form label-width="100px" v-loading="loadingAndroid">
      <el-form-item label="当前版本：">
        <span>{{formAndroid.current_version}}</span>
      </el-form-item>
      <el-form-item label="安装包大小：">
        <span>{{parseInt(formAndroid.file_size / 1024 / 1024)}} M</span>
      </el-form-item>
      <el-form-item label="更新时间：">
        <span>{{formAndroid.updated_at | timerFilter}}</span>
      </el-form-item>
      <el-form-item label="操作人：">
        <span>{{formAndroid.operation_user}}</span>
      </el-form-item>
      <el-form-item label="版本号：">
        <el-input
          @blur="blurUpload(actionNameAndroid, 'actionNameAndroid')"
          v-model="actionNameAndroid">
        </el-input>
      </el-form-item>
      <el-form-item label="apk安装包：">
        <el-upload
          class="upload-demo"
          accept=".apk"
          :http-request="handleFile"
          :limit="1"
          ref="uploadAndroid"
          :disabled="AndroidDisabled"
          :action="action">
          <el-button size="small">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
          <div slot="tip" class="el-upload__tip">支持扩展名: .apk</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="upload('android')">立即更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getPackage, setPackage } from '@/api/updateManagement'
import * as moment from 'moment'
@Component({
  filters: {
    timerFilter(time) {
      if (!time) return
      return moment.unix(time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
})
export default class Install extends Vue {
  formIos: any = {}
  formAndroid: any = {}
  loadingIos: boolean = false
  loadingAndroid: boolean = false
  actionNameIos: string = ''
  actionNameAndroid: string = ''
  iosDisabled: boolean = true
  AndroidDisabled: boolean = true
  action: any = `${process.env.BASE_API}/update_manage/update_package1`
  created() {
    this.ObtainPackage('ios')
    this.ObtainPackage('android')
  }
  ObtainPackage(terminal:string) {
    getPackage({platform: terminal}).then(response => {
      if (response.ret === 1) {
        terminal === 'ios' ? this.formIos = response.data : this.formAndroid = response.data
      } else {
        this.$message({
          message: response.error,
          type: 'error'
        })
      }
    })
  }
  handleFile(file: any) {
    return false
  }
  upload(type: string) {
    const formData: any = new FormData()
    const file: any = type === 'ios' ? this.$refs.uploadIos : this.$refs.uploadAndroid
    const fileDom: any = file.uploadFiles[0]
    console.log(fileDom)
    if (!fileDom) {
      this.$message({
        message: '请选择文件',
        type: 'error'
      })
      return
    }
    type === 'ios' ? this.loadingIos = true : this.loadingAndroid = true
    formData.append('file_update', fileDom.raw, fileDom.name)
    formData.append('platform', type)
    formData.append('current_version', type === 'ios' ? this.actionNameIos : this.actionNameAndroid)
    setPackage(formData).then(response => {
      if (response.ret === 1) {
        if (type === 'ios') {
          this.formIos = response.data
          this.actionNameIos = ''
          let file: any = this.$refs.uploadIos
          file.clearFiles()
          this.loadingIos = false
        } else {
          this.formAndroid = response.data
          this.actionNameAndroid = ''
          let file: any = this.$refs.uploadAndroid
          file.clearFiles()
          this.loadingAndroid = false
        }
        this.$message({
          message: '更新成功',
          type: 'success'
        })
      } else {
        type === 'ios' ? this.loadingIos = false : this.loadingAndroid = false
        this.$message({
          message: response.error,
          type: 'error'
        })
      }
    })
  }
  blurUpload(type:string, name:string) {
    let version = name === 'actionNameIos' ? this.formIos.current_version : this.formAndroid.current_version
    if (/^\d+\.\d+\.\d+$/.test(type)) {
      if (this.versionfunegt(type, version)) {
        name === 'actionNameIos' ? this.iosDisabled = false : this.AndroidDisabled = false
      } else {
        this.$message.error('版本号必须高于当前版本')
      }
    } else {
      this.$message.error('请输入版本号')
    }
  }
  versionfunegt(ver1: any, ver2: any) {
    let version1pre = parseFloat(ver1)
    let version2pre = parseFloat(ver2)
    let version1next = ver1.replace(version1pre + '.', '')
    let version2next = ver2.replace(version2pre + '.', '')
    if (version1pre > version2pre) {
      return true
    } else if (version1pre < version2pre) {
      return false
    } else {
      if (version1next > version2next) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped="">
  .el-form-item{
    margin-bottom: 0.2rem;
  }
</style>
