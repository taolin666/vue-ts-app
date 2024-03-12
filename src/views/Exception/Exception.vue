<template>
  <div class="exception-title">
    <!--  @click="handlePutTime" -->
    <el-button type="primary" @click="handleToApply">异常考勤</el-button>
    <el-space>
      <el-button plain>2022年</el-button>
      <!-- @change="handleUpdate" -->
      <el-select v-model="month">
        <el-option v-for="item in 12" :key="item" :value="item" :label="item + '月'" />
      </el-select>
    </el-space>
  </div>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-empty description="暂无考勤异常" v-if="false" />
      <el-timeline style="max-width: 600px" v-else>
        <el-timeline-item v-for="item in detailMonth" :key="item[0]" :timestamp="year+'/'+month+'/'+item[0]" placement="top">
          <el-card>
            <el-space>
              <h4>{{item[1]}}</h4>
              <p>考勤详情： {{ renderTime(item[0]) }}</p>
            </el-space>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-col>
    <el-col :span="12">
      <el-empty description="暂无考勤异常" v-if="false" />
      <el-timeline style="max-width: 600px" v-else>
        <el-timeline-item timestamp="事假" placement="top">
          <el-card>
            <h4>矿工</h4>
            <p class="apply-info">考勤详情： 暂无打开信息</p>
            <p class="apply-info">考勤详情： 暂无打开信息</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="事假" placement="top">
          <el-card>
            <h4>矿工</h4>
            <p class="apply-info">考勤详情： 暂无打开信息</p>
            <p class="apply-info">考勤详情： 暂无打开信息</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '@/store';
import {toZero} from '@/utils/common'
const route = useRoute()
const router = useRouter()
const store = useStore()
const date = new Date()
const year = ref(date.getFullYear())
const month = ref(Number(route.query.month) ||date.getMonth() + 1)
const signsInfos = computed(() => store.state.signs.infos)
const ret = ((signsInfos.value.detail as {[index: string]: unknown})[toZero(month.value)] as {[index: string]: unknown})
const detailMonth = computed(() => Object.entries(ret).filter(v => v[1] !== '正常考勤').sort())
watch(month, () => {
  router.push({
    query: {month: month.value}
  })
})
const handleToApply = () => {
  router.push('/apply')
}
const renderTime = (date:string) => {
  let ret = ((signsInfos.value.time as {[index: string]: unknown})[toZero(month.value)] as {[index:string]: unknown})[date]
  if (Array.isArray(ret)) {
    return ret.join('-')
  } else {
    return '暂无打卡记录'
  }
}
</script>

<style scoped lang="scss">
.exception-title {
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
.el-select {
  width: 80px;
}
.el-timeline {
  margin: 10px;
}
.apply-info {
  margin: 10px;
}
</style>