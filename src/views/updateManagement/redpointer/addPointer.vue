<template lang="html">
  <div class="app-container">
    <h2>
      Mobi钱包功能结构图
      <el-switch
        v-model="tree"
        active-text="修改结构">
      </el-switch>
    </h2>
    <el-tree
      :data="data"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      :expand-on-click-node="false"
      @check="handleCheckChange"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
       <span>{{ node.label }}</span>
       <span v-if="tree">
         <el-button
           type="text"
           size="mini"
           @click="() => append(data)">
           Append
         </el-button>
         <el-button
           type="text"
           size="mini"
           @click="() => remove(node, data)">
           Delete
         </el-button>
       </span>
     </span>
    </el-tree>
    <el-dialog title="插入节点" :visible.sync="dialogFormVisible" width="300px">
      <el-form :model="form" label-width="60px">
        <el-form-item label="ID">
          <el-input v-model="form.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.label" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false; insertNode()">确 定</el-button>
      </div>
    </el-dialog>
    <br/>
    <el-button v-if="!tree" class="add-btn" type="primary" @click="submitLightRedDot" :disabled="isCheckedDisabled">添加</el-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { getRedDotTree, setRedDotTree, lightRedDot } from '@/api/updateManagement'
@Component
export default class addPointer extends Vue {
  tree: Boolean = false
  dialogFormVisible: Boolean = false
  isCheckedDisabled: Boolean = true
  node: any = {}
  form: any = {
    id: '',
    label: ''
  }
  data: any = []
  @Watch('tree')
  onTreeChange(val: any, oldVal: any) {
    if (!val) {
      const trees = this.data.length > 0 ? this.data : [{id: '', label: 'Mobi', disabled: true}]
      setRedDotTree({ tree: trees }).then((res) => {
        if (res.ret === 1) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.fetchRedDotTree()
        } else {
          this.$message({
            message: res.error,
            type: 'error'
          })
        }
      })
    }
  }
  created() {
    this.fetchRedDotTree()
  }
  submitLightRedDot() {
    const $tree: any = this.$refs.tree
    if ($tree.getCheckedNodes().length > 0) {
      this.$confirm(`你确定要为功能路径 ${$tree.getCheckedNodes()[0].id} 添加红点引导吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const dot = $tree.getCheckedNodes()[$tree.getCheckedNodes().length - 1]
        lightRedDot({path: dot.id, name: dot.label}).then((res) => {
          if (res.ret === 1) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.setTreeNodeDisabled(this.data, dot.id)
            setTimeout(() => {
              setRedDotTree({ tree: this.data }).then((res) => {
                if (res.ret === 1) {
                  this.$message({
                    message: '更新树成功',
                    type: 'success'
                  })
                  this.isCheckedDisabled = true
                  this.fetchRedDotTree()
                  this.$router.push({ path: '/updatemanagement/redpointer' })
                } else {
                  this.$message({
                    message: res.error,
                    type: 'error'
                  })
                }
              })
            }, 2000)
          } else {
            this.$message({
              message: res.error,
              type: 'error'
            })
          }
        })
      })
    }
  }
  setTreeNodeDisabled(nodes, id) {
    for (let i = 0, length = nodes.length; i < length; i++) {
      if (nodes[i].id === id) {
        nodes[i].disabled = true
        return
      } else {
        this.setTreeNodeDisabled(nodes[i].children, id)
      }
    }
  }
  handleCheckChange(data, checked) {
    const $tree: any = this.$refs.tree
    $tree.setCheckedKeys([])
    $tree.setCheckedKeys([data.id])
    if ($tree.getCheckedKeys().length > 0) {
      this.isCheckedDisabled = false
    } else {
      this.isCheckedDisabled = true
    }
  }
  fetchRedDotTree() {
    getRedDotTree().then((res) => {
      this.data = []
      if (res.data.tree) {
        this.data.push(JSON.parse(res.data.tree))
      } else {
        this.data.push({id: 'mobi', label: 'Mobi'})
      }
    })
  }
  append(data) {
    this.dialogFormVisible = true
    this.form = {
      id: '',
      label: ''
    }
    this.node = data
  }
  insertNode() {
    const childId = this.node.id === '' ? this.form.id : this.node.id + '.' + this.form.id
    const newChild = { id: childId, label: this.form.label + ' (' + this.form.id + ')', children: [] }
    if (!this.node.children) {
      this.$set(this.node, 'children', [])
    }
    this.node.disabled = true
    this.node.children.push(newChild)
  }
  remove(node, data) {
    const parent = node.parent
    const children = parent.data.children || parent.data
    const index = children.findIndex(d => d.id === data.id)
    children.splice(index, 1)
  }
}
</script>

<style lang="less">
.el-tree-node__content{
  .el-tree-node__expand-icon{
    // background: red;
    & + .el-checkbox{
      display: none!important;
    }
    &.is-leaf + .el-checkbox{
      display: inline-block!important;
    }
  }
}

.el-tree{
  width: 100%;
  max-width: 400px;
}
.custom-tree-node {
   flex: 1;
   display: flex;
   align-items: center;
   justify-content: space-between;
   font-size: 14px;
   padding-right: 8px;
 }
.add-btn{
  margin-left: 3rem;
}
</style>
