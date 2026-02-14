<template>
  <div class="out-library-container">
    <div class="info-card">
      <p class="info-title">订单出库管理</p>
      <!-- 出库内容区域 -->
      <div class="library-content">
        <!-- 数据表格 -->
        <el-table 
          :data="tableData" 
          style="width: 100%" 
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="100" />
          <el-table-column prop="orderid" label="客户订单号" width="220" />
          <el-table-column prop="product" label="产品" width="250" />
          <el-table-column prop="count" label="库存数" width="200" />
          <el-table-column prop="order_count" label="待发货数" width="200" />
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-input
                v-model="scope.row.ship_count"
                placeholder="本次发货数量"
                type="number"
                :min="0"
                :max="scope.row.order_count"
                controls-position="right"
                style="width: 150px"
              />
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 操作按钮 -->
        <div class="button-group">
          <el-button type="primary" @click="handleOutLibrary" :disabled="selectedRows.length === 0">
            <i class="el-icon-check"></i>
            确认出库
          </el-button>
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
// 订单出库组件
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getOutLibraryList } from '@/api/management/order'

// 表格数据
const tableData = ref([])

// 为每行数据添加发货数量字段
const initializeTableData = (data) => {
  return data.map(item => ({
    ...item,
    ship_count: '' // 初始化发货数量为空
  }))
}

// 加载状态
const loading = ref(false)

// 选中的行数据
const selectedRows = ref([])

// 获取出库列表数据
const getOutLibraryData = async () => {
  loading.value = true
  try {
    const response = await getOutLibraryList({})
    
    if (response.code === 200) {
      tableData.value = initializeTableData(response.data || [])
      ElMessage.success('数据加载成功！')
    } else {
      ElMessage.error(response.msg || '数据加载失败')
    }
  } catch (error) {
    console.error('获取出库数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 确认出库
const handleOutLibrary = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要出库的数据')
    return
  }
  
  // 验证发货数量
  const invalidRows = selectedRows.value.filter(row => {
    const shipCount = parseInt(row.ship_count) || 0
    return shipCount <= 0 || shipCount > row.order_count
  })
  
  if (invalidRows.length > 0) {
    ElMessage.warning('请检查发货数量，必须大于0且不超过待发货数')
    return
  }
  
  console.log('选中的出库数据:', selectedRows.value)
  ElMessage.success(`已选择 ${selectedRows.value.length} 条数据进行出库操作`)
  // 这里可以添加实际的出库逻辑
}

// 刷新数据
const refreshData = () => {
  getOutLibraryData()
}

// 页面加载时获取数据
onMounted(() => {
  console.log('订单出库页面已加载')
  getOutLibraryData()
})
</script>

<style scoped>
.out-library-container {
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

.library-content {
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
</style>