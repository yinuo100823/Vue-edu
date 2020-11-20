<template>
  <div class="teacher">
    <!--    讲师查询条件-->
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="queryMap.name" placeholder="名称"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryMap.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker v-model="queryMap.begin" type="datetime" placeholder="选择开始时间"/>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="queryMap.end" type="datetime" placeholder="选择截止时间"/>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
      <el-button type="primary" @click="handleSave()">新建讲师</el-button>
    </el-form>
    <!--    讲师列表-->
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="name" label="名称"/>
      <el-table-column label="头衔">
        <template slot-scope="scope">
          {{ scope.row.level === 1 ? '高级讲师' : '首席讲师' }}
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="资历"/>
      <el-table-column prop="sort" label="排序" width="60"/>
      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/update/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    讲师分页-->
    <el-pagination
      @size-change="handlePageSizeChange"
      @current-change="handlePageNoChange"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 20px"
    >
    </el-pagination>
  </div>
</template>

<script>
import teacherApi from '../../../api/teacher'
import message from '../../../utils/message'

export default {
  name: 'Table',
  data() {
    return {
      list: null,
      queryMap: {},
      total: 0,
      pageNo: 1,
      pageSize: 10
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      teacherApi.getTeacherListByPage(this.pageNo, this.pageSize, this.queryMap)
        .then(response => {
          const respData = response.data
          this.total = respData.data.total
          this.list = respData.data.rows
        })
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getList()
    },
    handlePageNoChange(pageNo) {
      this.pageNo = pageNo
      this.getList()
    },
    resetData() {
      this.queryMap = {}
      this.getList()
    },
    handleSave() {
      this.$router.push({ name: 'TeacherSave' })
    },
    removeById(id) {
      message.messageBox(() => {
          teacherApi.deleteTeacherById(id).then(resp => {
            message.messageByResp(resp)
            this.getList()
          })
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
