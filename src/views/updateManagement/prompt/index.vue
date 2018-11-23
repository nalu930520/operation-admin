<template lang="">
  <div class="app-container">
    <el-form ref="formios" :model="formios" :rules="rules" label-width="200px">
      <el-form-item label="iOS版本更新提示" style="font-weight: bold">
      </el-form-item>
      <el-form-item label="高版本号：" prop="version">
        <el-input v-model="formios.version" placeholder="xx.xx.xx"></el-input>
      </el-form-item>
      <el-form-item label="低版本号：" prop="oldest_version_supported">
        <el-input v-model="formios.oldest_version_supported"  placeholder="xx.xx.xx"></el-input>
      </el-form-item>
      <el-form-item label="更新提示内容（中文）：">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="请输入内容"
          v-model="formios.version_data.update_reason_dict.CN">
        </el-input>
      </el-form-item>
      <el-form-item label="更新提示内容（英文）：">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="请输入内容"
          v-model="formios.version_data.update_reason_dict.EN">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ios')">保存更新</el-button>
      </el-form-item>
    </el-form>
    <br/>
    <br/>
    <el-form :model="formandroid" :rules="rules" ref="formandroid" label-width="200px">
      <el-form-item label="安卓版本更新提示" style="font-weight: bold">
      </el-form-item>
      <el-form-item label="高版本号：" prop="version">
        <el-input v-model="formandroid.version" placeholder="xx.xx.xx"></el-input>
      </el-form-item>
      <el-form-item label="低版本号：" prop="oldest_version_supported">
        <el-input v-model="formandroid.oldest_version_supported" placeholder="xx.xx.xx"></el-input>
      </el-form-item>
      <el-form-item label="更新提示内容（中文）：">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="请输入内容"
          v-model="formandroid.version_data.update_reason_dict.CN">
        </el-input>
      </el-form-item>
      <el-form-item label="更新提示内容（英文）：">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="请输入内容"
          v-model="formandroid.version_data.update_reason_dict.EN">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('android')">保存更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { updateVersionInfo, getVersionInfo } from '@/api/updateManagement.js'

@Component
export default class Prompt extends Vue {
  formios: any = {
    version: '',
    oldest_version_supported: '',
    version_data: {
      update_reason_dict: {
        EN: '',
        CN: ''
      }
    }
  }
  formandroid: any = {
    version: '',
    oldest_version_supported: '',
    version_data: {
      update_reason_dict: {
        EN: '',
        CN: ''
      }
    }
  }
  validateVersion = (rule, value, callback) => {
    if (!value.trim()) {
      callback(new Error('请输入版本号'))
    } else {
      const patt = /^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/
      if (patt.test(value)) {
        callback()
      } else {
        callback(new Error('版本号格式不对'))
      }
    }
  }
  rules = {
    version: [
      { validator: this.validateVersion, trigger: 'blur' }
    ],
    oldest_version_supported: [
      { validator: this.validateVersion, trigger: 'blur' }
    ]
  }
  created() {
    getVersionInfo({platform: 'ios'}).then((res) => {
      if (res.ret === 1 && res.data) {
        this.formios = {
          version: res.data.version,
          oldest_version_supported: res.data.oldest_version_supported,
          version_data: JSON.parse(res.data.version_data)
        }
      }
    })
    getVersionInfo({platform: 'android'}).then((res) => {
      this.formandroid = {
        version: res.data.version,
        oldest_version_supported: res.data.oldest_version_supported,
        version_data: JSON.parse(res.data.version_data)
      }
    })
  }
  onSubmit(type) {
    const refs: any = type === 'ios' ? this.$refs.formios : this.$refs.formandroid
    const form = type === 'ios' ? this.formios : this.formandroid
    refs.validate((valid:any) => {
      if (valid) {
        updateVersionInfo({platform: type, ...form}).then((res) => {
          if (res.ret === 1) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.error,
              type: 'error'
            })
          }
        })
        return true
      } else {
        return false
      }
    })
  }
}
</script>

<style lang="css">
</style>
