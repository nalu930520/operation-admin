<template>
<div class="name">
  <el-form label-position="center" ref="classifyForm" :rules="rules" label-width="80px" :model="classifyForm">
    <el-form-item label="名称:" prop="name">
      <el-input v-model="classifyForm.name" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('classifyForm')">保存</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { addMaterialClassify, updateMaterialClassify } from '@/api/material'
interface formObj {
  name: any[]
}
interface formObj1 {
  name: string
}
@Component({
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  }
})
export default class updateClassify extends Vue {
  formLabelAlign: string = ''
  id: string = '' // 0: add ; 1: update
  classifyForm: formObj1 = {
    name: ''
  }
  rules: formObj = {
    name: [{
      required: true,
      message: '请输入分类名称',
      trigger: 'blur'
    }]
  }
  updateClassify() {
    if (this.id) {
      updateMaterialClassify({
        classify_name: this.classifyForm.name,
        classify_id: this.id
      }).then(response => {
        if (response.ret === 1) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.push({
            name: 'classify-list'
          })
        } else {
          this.$message({
            message: response.error,
            type: 'error'
          })
        }
      })
    } else {
      addMaterialClassify({
        classify_name: this.classifyForm.name
      }).then(response => {
        if (response.ret === 1) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.push({
            name: 'classify-list'
          })
        } else {
          this.$message({
            message: response.error,
            type: 'error'
          })
        }
      })
    }
  }
  created() {
    console.log('router:', this.$route)
    this.id = this.$route.query.classifyId
    this.classifyForm.name = this.$route.query.classifyName
  }
  submitForm(formName) {
    console.log(formName)
    const $ref: any = this.$refs[formName]
    $ref.validate((valid: any): any => {
      if (valid) {
        this.updateClassify()
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
}
</script>

<style>
.name {
  width: 60%;
  margin: 50px 0;
}
</style>
