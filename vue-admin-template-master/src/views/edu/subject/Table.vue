<template>
  <div class="subject-table">
    <el-form :inline="true">
      <el-form-item>
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$router.push({name:'SubjectSave'})">新建课程分类</el-button>
      </el-form-item>


    </el-form>
    <el-tree
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      ref="tree">
    </el-tree>
  </div>
</template>

<script>
import subjectApi from '../../../api/subject'

export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getSubjectTree()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },

    getSubjectTree() {
      subjectApi.getSubjectTree().then(response => {
        console.log('subjectTree', response.data.items)
        if (response.code === 20000) {
          this.data = response.data.items
        }
      })
    }
  },

  data() {
    return {
      filterText: '',
      data: null,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  }

}
</script>

<style scoped>

</style>
