<template>
  <div class="progress-container">
    <div class="info-card">
      <p class="info-title">车间实时生产看板</p>
      <!-- 生产进度内容区域 -->
      <div class="progress-content">
        <!-- 数据表格 -->
        <el-table 
          :data="tableData" 
          style="width: 100%" 
          v-loading="loading"
        >
          <el-table-column prop="orderid" label="工单编号" width="200" />
          <el-table-column prop="machineid" label="机台" width="150" />
          <el-table-column prop="product" label="产品" width="200" />
          <el-table-column prop="order_count" label="计划数" width="120" />
          <el-table-column prop="product_count" label="已产数" width="120" />
          <el-table-column prop="rate" label="达成率" width="200">
            <template #default="scope">
              <div class="progress-wrapper">
                <el-progress 
                  :text-inside="true" 
                  :stroke-width="20" 
                  :percentage="parseFloat(scope.row.rate)" 
                  :color="getProgressColor(parseFloat(scope.row.rate))"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="状态" width="150">
            <template #default="scope">
              <span :class="getStatusClass(scope.row.type)">
                {{ getStatusText(scope.row.type) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 操作按钮 -->
        <div class="button-group">
          <el-button @click="refreshData">
            <i class="el-icon-refresh"></i>
            刷新
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 生产进度组件
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getProgressList } from '@/api/management/order'

// 表格数据
const tableData = ref([])

// 加载状态
const loading = ref(false)

// 获取生产进度列表数据
const getProgressData = async () => {
  loading.value = true
  try {
    const response = await getProgressList({})
    
    if (response.code === 200) {
      tableData.value = response.data || []
      ElMessage.success('数据加载成功！')
    } else {
      ElMessage.error(response.msg || '数据加载失败')
    }
  } catch (error) {
    console.error('获取生产进度数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 根据达成率获取进度条颜色
const getProgressColor = (rate) => {
  if (rate <= 50) {
    return '#E6A23C' // 橙色
  } else if (rate > 50 && rate < 100) {
    return '#409EFF' // 蓝色
  } else if (rate >= 100) {
    return '#67C23A' // 绿色
  }
  return '#409EFF' // 默认蓝色
}

// 获取状态文本
const getStatusText = (type) => {
  switch (type) {
    case 1: return '生产中'
    case 2: return '已完成'
    case 3: return '已出库'
    default: return '未知状态'
  }
}

// 获取状态样式类
const getStatusClass = (type) => {
  switch (type) {
    case 1: return 'status-processing' // 生产中
    case 2: return 'status-completed'  // 已完成
    case 3: return 'status-shipped'    // 已出库
    default: return 'status-unknown'   // 未知状态
  }
}

// 刷新数据
const refreshData = () => {
  getProgressData()
}

// 页面加载时获取数据
onMounted(() => {
  console.log('生产进度页面已加载')
  getProgressData()
})
</script>

<style scoped>
.progress-container {
  width: 100%;
  height: 100%;
  padding-top: 0px;
  box-sizing: border-box;
}

.info-card {
  background-color: #FFFFFF; /* 白色背景 */
  border-radius: 2px; /* 圆角 */
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-top: 0px;
  width: 100%;
  min-height: calc(100vh - 120px);
  height: auto;
}

.info-card::before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px; /* 顶部绿色点缀高度 */
  background-color: #67C23A; /* 绿色 (#67C23A) */
  border-radius: 5px 5px 0 0; /* 顶部保持圆角 */
}

/* 为内容留出空间，避免被顶部装饰遮挡 */
.info-card > * {
  position: relative;
  z-index: 1;
  padding-top: 20px; /* 额外的内边距以避开顶部绿色区域 */
  padding-left: 15px;
  padding-right: 20px;
  padding-bottom: 20px;
}

.info-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600; /* 变细字体 */
  color: #333;
  position: relative;
}

.info-title::after {
  content: '';
  display: block;
  width: 100%;
  height: 1px;
  background-color: rgb(244, 244, 244);
  margin-top: 12px;
}

.progress-content {
  margin-top: 0px;
  min-height: 300px;
}

.button-group {
  text-align: center;
  margin-top: 30px;
  padding: 20px 0;
}

.button-group .el-button {
  margin: 0 10px;
  padding: 12px 24px;
  font-size: 14px;
}

.button-group .el-button i {
  margin-right: 5px;
}

/* 表格样式优化 */
.el-table {
  margin-top: 0px;
}

/* 进度条容器样式 */
.progress-wrapper {
  padding: 5px 0;
}

/* 状态标签样式 */
.status-processing {
  background-color: #ecf5ff;
  border: 1px solid #b3d8ff;
  color: #409EFF;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  display: inline-block;
}

.status-completed {
  background-color: #f0f9eb;
  border: 1px solid #c2e7b0;
  color: #67C23A;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  display: inline-block;
}

.status-shipped {
  background-color: #f4f4f5;
  border: 1px solid #dcdfe6;
  color: #909399;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  display: inline-block;
}

.status-unknown {
  background-color: #fef0f0;
  border: 1px solid #fbc4c4;
  color: #f56c6c;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  display: inline-block;
}

/* Element Plus 进度条样式覆盖 */
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
</style>
