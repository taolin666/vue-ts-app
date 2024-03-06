<template>
  <div class="login">
    <div class="header">
      <span class="header-logo">
        <i class="iconfont icon-vue"></i>
        <i class="iconfont icon-icon-test"></i>
        <i class="iconfont icon-typescript"></i>
      </span>
      <span class="header-title">在线考勤系统</span>
    </div>
    <div class="desc">
      零基础从入门到进阶，系统掌握前端三大热门技术(Vue、React、TypeScript)
    </div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="main"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="ruleForm.email"
          type="text"
          placeholder="请输入邮箱"
        />
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input
          v-model="ruleForm.pass"
          type="password"
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)"
          auto-insert-space
          >登录</el-button
        >
      </el-form-item>
    </el-form>
    <div class="users">
      <el-row :gutter="20">
        <el-col v-for="item in testUsers" :key="item.email" :span="12">
          <h3>
            测试账号，<el-button @click="autoLogin({email: item.email, pass: item.pass})">一键登录</el-button>
          </h3>
          <p>邮箱：{{ item.email }}</p>
          <p>密码：{{ item.pass }}</p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
/* import { defineComponent } from 'vue';
defineComponent({
  name: 'LoginView'
}); */

/* import http from '@/utils/http';
http.post('/users/login', {
    "email": "huangrong@imooc.com",
    "pass": "huangrong"
}).then((res)=>{
  console.log(res.data);
}) */
import { ref, reactive } from 'vue'
// import { useStore } from '@/store';
// const store = useStore();
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

interface User {
  email: String,
  pass: String
}

const testUsers:User[] = [
  {
    email: 'huangrong@imooc.com',
    pass: 'huangrong'
  },
  {
    email: 'hongqigong@imooc.com',
    pass: 'hongqigong'
  }
]

</script>

<style scoped lang="scss">

</style>