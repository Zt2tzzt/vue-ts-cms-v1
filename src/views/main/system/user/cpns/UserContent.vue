<script setup lang="ts">
import useSystemStore from '@/stores/main/system/system'
import { storeToRefs } from 'pinia'
import { formatUTC } from '@/utils/format'
import { ref } from 'vue'
import type { IUserSearchFormData, IUser } from '@/types'

const emits = defineEmits(['newClick', 'editClick'])

const systemStore = useSystemStore()
const { users, usersTotalCount } = storeToRefs(systemStore)

const pageSize = ref(10)
const currentPage = ref(1)

const fetchUserListData = (formatData: IUserSearchFormData | object = {}) => {
  // 1.获取 offset 和 limit
  const limit = pageSize.value
  const offset = (currentPage.value - 1) * limit
  const queryParam = { size: limit, offset }

  // 2.发送请求
  systemStore.postUsersAction({ ...queryParam, ...formatData })
}

fetchUserListData()

const onSizeChange = () => {
  fetchUserListData()
}
const onCurrentChange = () => {
  fetchUserListData()
}

const onDeleteClick = (id: number) => {
  systemStore.deleteUserByIdAction(id)
}

const onNewclick = () => {
  emits('newClick')
}

const onEditClick = (itemData: IUser) => {
  emits('editClick', itemData)
}

defineExpose({
  fetchUserListData
})
</script>

<template>
  <div class="user-content">
    <!-- 头部 -->
    <div class="header">
      <h3 class="title">用户列表</h3>
      <el-button type="primary" @click="onNewclick">新建用户</el-button>
    </div>

    <!-- 表格 -->
    <div class="table">
      <el-table :data="users" stripe border style="width: 100%">
        <el-table-column align="center" type="selection" width="50px"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" label="用户名" prop="name" width="200"></el-table-column>
        <el-table-column
          align="center"
          label="真是姓名"
          prop="realname"
          width="200"
        ></el-table-column>
        <el-table-column
          align="center"
          label="手机号码"
          prop="cellphone"
          width="250"
        ></el-table-column>
        <el-table-column align="center" label="状态" prop="enable" width="100" #default="scope">
          <el-button size="small" :type="scope.row.enable ? 'primary' : 'danger'">
            {{ scope.row.enable ? '启用' : '禁用' }}
          </el-button>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="createAt" #default="scope">
          {{ formatUTC(scope.row.createAt) }}
        </el-table-column>
        <el-table-column align="center" label="修改时间" prop="updateAt">
          <template #default="scope">
            {{ formatUTC(scope.row.updateAt) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250" #default="scope">
          <el-button size="small" icon="Edit" type="primary" text @click="onEditClick(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            icon="Delete"
            type="danger"
            text
            @click="onDeleteClick(scope.row.id)"
            >删除</el-button
          >
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="usersTotalCount"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<style scoped lang="less">
.user-content {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;

    .title {
      font-size: 22px;
    }
  }

  .table {
    :deep(.el-table__cell) {
      padding: 12px 0;
    }

    .el-button {
      margin-left: 10;
      padding: 5px 8px;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}
</style>
