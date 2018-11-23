<template>
<div class="name">
  <el-form label-position="center" ref="ruleForm" :rules="rules" label-width="80px" :model="ruleForm">
    <el-form-item label="名称:" prop="name">
      <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">确认添加</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script lang="ts">
import {
  addname
} from '@/api/eventAdvertising'
import {
  Component,
  Vue
} from 'vue-property-decorator'
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
export default class addactivity extends Vue {
  formLabelAlign: string = ''
  ruleForm: formObj1 = {
    name: ''
  }
  rules: formObj = {
    name: [{
      required: true,
      message: '请输入活动名称',
      trigger: 'blur'
    }]
  }
  submitForm(formName) {
    const $ref: any = this.$refs[formName]
    $ref.validate((valid: any): any => {
      if (valid) {
        addname({
          name: this.ruleForm.name
        }).then(response => {
          if (response.ret === 1) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$router.push('/admanagement/eventAdvertising')
          } else {
            this.$message({
              message: response.error,
              type: 'error'
            })
          }
        })
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
  created() {
    console.log(this.$route.path)
  }
}
</script>

<style>
.name {
  width: 60%;
  margin: 50px 0;
}
</style>
