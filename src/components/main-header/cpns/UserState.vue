<script setup lang="ts">
import { LOGIN_TOKEN, USER_INFO, USER_MENU } from '@/global/constance'
import useLoginStore from '@/stores/login/login'
import { localCache } from '@/utils/cache'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const loginStore = useLoginStore()
const nickname = computed(() =>
  'name' in loginStore.userInfo ? loginStore.userInfo.name : '用户名'
)

const router = useRouter()
const handleExitClick = () => {
  localCache.removeCache(LOGIN_TOKEN)
  localCache.removeCache(USER_INFO)
  localCache.removeCache(USER_MENU)
  router.push('/login')
}
</script>

<template>
  <div class="user-state">
    <!-- 1.状态小图标 -->
    <div class="operation">
      <span>
        <el-icon><Message /></el-icon>
      </span>
      <span>
        <span class="dot"></span>
        <el-icon><ChatDotRound /></el-icon>
      </span>
      <span>
        <span class="dot"></span>
        <el-icon><Bell /></el-icon>
      </span>
    </div>

    <!-- 2.个人信息 -->
    <div class="info">
      <el-dropdown>
        <span class="user-info">
          <el-avatar
            :size="30"
            src="https://portrait.gitee.com/uploads/avatars/user/1772/5318354_Zt2tzzt_1645413218.png"
          />
          <span class="name">{{ nickname }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon><Unlock /></el-icon>
              <span>修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleExitClick">
              <el-icon><CircleClose /></el-icon>
              <span>退出系统</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="less">
.user-state {
  display: flex;
  align-items: center;
}

.operation {
  display: inline-flex;
  margin-right: 20px;

  span {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 35px;

    &:hover {
      background: #f2f2f2;
    }

    i {
      font-size: 20px;
    }

    .dot {
      position: absolute;
      top: 3px;
      right: 3px;
      z-index: 10;
      width: 6px;
      height: 6px;
      background: red;
      border-radius: 100%;
    }
  }
}

.info {
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;

    .name {
      margin-left: 5px;
    }
  }
}

.info {
  :global(.el-dropdown-menu__item) {
    line-height: 36px !important;
    padding: 6px 22px;
  }
}
</style>
