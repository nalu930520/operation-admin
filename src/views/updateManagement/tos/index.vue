<template lang="html">
  <div class="app-container">
    <el-button class="add" size="small" icon="el-icon-plus" type="primary"  @click="dialogFormVisible = true">添加服务协议</el-button>
    <el-tabs v-if="tosList.length > 0" v-model="editableTabsValue">
      <el-tab-pane
        v-for="(item, index) in tosList"
        :key="index"
        :label="item.tos_type_name"
        :name="index.toString()"
      >
        <edit :data="item" v-on:listenToChildEvent="onSubmitTos"></edit>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="新增协议" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="协议名称：" label-width="120px">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTab()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getTos, addTos } from '@/api/updateManagement'
import edit from './edit.vue'
interface formObj {
  name: string;
}

@Component({
  components: {
    edit
  }
})

export default class Tos extends Vue {
  editableTabsValue: string = '0'
  tosList: any = []
  dialogFormVisible: boolean = false
  form: formObj = {
    name: ''
  }
  rules: Object = {
    name: [{ required: true, message: '请输入协议名称', trigger: 'blur' }]
  }
  created() {
    this.fetchTos()
  }
  fetchTos() {
    getTos().then((res) => {
      if (res.ret === 1) {
        console.log(res.data)
        this.tosList = res.data.type_list
      } else {
        this.$message({
          message: res.error,
          type: 'error'
        })
      }
    })
  }
  addTab(targetName) {
    this.tosList.push({
      tos_type_name: this.form.name,
      url_cn_simplified: '',
      url_cn_traditional: '',
      url_en: '',
      version: '',
      memo: ''
    })
    this.editableTabsValue = (this.tosList.length - 1).toString()
    this.dialogFormVisible = false
  }
  onSubmitTos(data) {
    addTos(data).then((res) => {
      if (res.ret === 1) {
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.fetchTos()
      } else {
        this.$message({
          message: res.error,
          type: 'error'
        })
      }
    })
  }
}
</script>

<style lang="css" scoped>

.add{
  margin-bottom: 10px;
}
</style>
