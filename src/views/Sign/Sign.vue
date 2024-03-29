<template>
  <div>
    <el-descriptions border direction="vertical" :column="9">
      <el-descriptions-item label="月份">{{month}}月</el-descriptions-item>
      <el-descriptions-item :label="value" v-for="value, key in detailKey" :key="key">
        {{ detailValue[key] }}
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <el-button type="primary" size="small" plain @click="handleToException">查看详情</el-button>
      </el-descriptions-item>
      <el-descriptions-item label="考勤状态">
        <el-tag :type="detailState.type" size="small">{{detailState.text}}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <el-calendar v-model="data">
      <template #header>
        <el-button type="primary" @click="handlePutTime">在线签到</el-button>
        <el-space>
          <el-button plain>{{year}}年</el-button>
          <el-select v-model="month" @change="handleUpdate">
            <el-option v-for="item in 12" :key="item" :value="item" :label="item + '月'" />
          </el-select>
        </el-space>
      </template>
      <template #dateCell="{ data }">
        <div>{{ renderDate(data) }}</div>
        <div class="show-time">{{ renderTime(data) }}</div>
      </template>
    </el-calendar>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus';
import {ref, reactive, computed, watchEffect} from 'vue'
  import { useRouter } from 'vue-router';
  import { useStore } from '@/store';
  import {toZero} from '@/utils/common'
  const router = useRouter()
  const store = useStore()
  const signsInfos = computed(() => store.state.signs.infos)
  const usersInfos = computed(() => store.state.users.infos)
  const data = ref(new Date())
  const year = data.value.getFullYear()
  const month = ref(data.value.getMonth() + 1)
  enum detailKey {
    normal ='正常出勤',
    absent ='旷工',
    miss ='漏打卡',
    late ='迟到',
    early ='早退',
    lateAndEarly ='迟到并早退'
  }
  const detailValue = reactive({
    normal : 0,
    absent : 0,
    miss : 0,
    late : 0,
    early : 0,
    lateAndEarly : 0
  })
  const detailState = reactive({
    type: 'success' as 'success' | 'danger',
    text: '正常' as '正常' | '异常'
  })

  // watchEffect((reset) => {
  //   const detailMonth = ((signsInfos.value.detail as {[index:string]: unknown})[toZore(month.value)] as {[index:string]: unknown})
  //   for (const attr in detailMonth) {
  //     switch(detailMonth[attr]) {
  //       case detailKey.normal:
  //         detailValue.normal++
  //         break
  //       case detailKey.absent:
  //         detailValue.absent++
  //         break
  //       case detailKey.miss:
  //         detailValue.miss++
  //         break
  //       case detailKey.late:
  //         detailValue.late++
  //         break
  //       case detailKey.early:
  //         detailValue.early++
  //         break
  //       case detailKey.lateAndEarly:
  //         detailValue.lateAndEarly++
  //         break
  //     }
  //   }
  //   for(const attr in detailValue) {
  //     if (attr !== 'normal' && detailValue[attr as keyof typeof detailValue] !== 0) {
  //       detailState.type = 'danger'
  //       detailState.text = '异常'
  //     }
  //   }
  //   reset(() => {
  //     detailState.type = 'success'
  //     detailState.text = '正常'
  //     for(const attr in detailValue) {
  //       detailValue[attr as keyof typeof detailValue] = 0
  //     }
  //   })
  // })

  const handleUpdate = () => {
    data.value = new Date(`${year}.${month.value}`)
  }
  const handleToException = () => {
    router.push({
      path: '/exception',
      query: {month: month.value}
    })
  }
  const renderDate = (day: string) => {
    return day.split('-')[2]
  }
  const renderTime = (day: string) => {
    const [month, date] = day.split('-')
    let ret = ((signsInfos.value.time as {[index: string]: unknown})[month] as {[index:string]: unknown})[date]
    if (Array.isArray(ret)) {
      return ret.join('-')
    }
  }
  const handlePutTime = () => {
    store.dispatch('signs/putTime', {userId: usersInfos.value._id}).then(res => {
      if (res.data.errcode === 0) {
        store.commit('signs/updateInfos', res.data.infos);
        ElMessage.success('签到成功')
      }
    })
  }
</script>

<style scoped lang="scss">
.el-descriptions {
  margin: 10px;
}
.el-select {
  width: 80px;
}
.show-time {
  text-align: center;
  line-height: 40px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>