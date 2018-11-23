<template>
  <div class="app-container">
    <el-form ref="form" :model="data" :rules="rules" label-width="140px">
      <el-form-item label="服务协议版本号:" prop="version">
        <el-input v-model="data.version"></el-input>
      </el-form-item>
      <el-form-item label="中文协议网址:" prop="version">
        <el-input v-model="data.url_cn_simplified"></el-input>
      </el-form-item>
      <el-form-item label="繁体中文协议网址:" prop="version">
        <el-input v-model="data.url_cn_traditional"></el-input>
      </el-form-item>
      <el-form-item label="英文协议网址:" prop="version">
        <el-input v-model="data.url_en"></el-input>
      </el-form-item>
      <el-form-item label="备注（可选）：" prop="note">
        <el-input type="textarea" rows="4" v-model="data.memo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit">保存上线</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {
  }
})

export default class edit extends Vue {
  @Prop() data: Object
  rules: Object = {
    version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
    url_cn_simplified: [{ required: true, message: '请输入URL', trigger: 'blur' }],
    url_cn_traditional: [{ required: true, message: '请输入URL', trigger: 'blur' }],
    url_en: [{ required: true, message: '请输入URL', trigger: 'blur' }]
  }
  onSubmit() {
    const refs: any = this.$refs.form
    refs.validate((valid:any) => {
      if (valid) {
        this.$emit('listenToChildEvent', this.data)
      }
    })
  }
  onCancel() {
    this.$message({
      message: 'cancel!',
      type: 'warning'
    })
  }
}
</script>

<style scoped>
.el-icon-circle-plus-outline, .el-icon-remove-outline{
  font-size: 40px;
  display: inline-block;
  margin-top: 100%;
  cursor: pointer;
}
.line{
  text-align: center;
}
.el-form-item .el-form-item{
  margin-bottom: 15px;
}
</style>
