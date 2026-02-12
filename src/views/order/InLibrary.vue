<template>
  <div class="in-library-container">
    <div class="info-card">
      <p class="info-title">订单入库管理</p>
      <!-- 入库内容区域 -->
      <div class="library-content">
        <el-form 
          :model="libraryForm" 
          :rules="formRules" 
          ref="libraryFormRef" 
          label-width="120px" 
          class="library-form"
        >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="入库编号" prop="entryid">
                  <el-input 
                    v-model="libraryForm.entryid" 
                    placeholder="系统自动生成" 
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关联工单" prop="orderid">
                  <el-select 
                    v-model="libraryForm.orderid" 
                    placeholder="请选择关联工单" 
                    style="width: 100%"
                  >
                    <el-option 
                      v-for="order in orderList" 
                      :key="order.orderid" 
                      :label="order.ordername" 
                      :value="order.orderid" 
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="入库数量" prop="count">
                  <el-input-number 
                    v-model="libraryForm.count" 
                    :min="1" 
                    :max="999999" 
                    style="width: 100%" 
                    controls-position="right"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入库仓库" prop="location">
                  <el-row :gutter="10" style="width: 100%">
                    <el-col :span="8">
                      <el-select 
                        v-model="warehouse.area" 
                        placeholder="区域" 
                        style="width: 100%"
                        @change="handleWarehouseChange"
                      >
                        <el-option label="A" value="A" />
                        <el-option label="B" value="B" />
                      </el-select>
                    </el-col>
                    <el-col :span="8">
                      <el-select 
                        v-model="warehouse.group" 
                        placeholder="组" 
                        style="width: 100%"
                        @change="handleWarehouseChange"
                      >
                        <el-option 
                          v-for="num in 15" 
                          :key="num" 
                          :label="String(num).padStart(2, '0')" 
                          :value="String(num).padStart(2, '0')" 
                        />
                      </el-select>
                    </el-col>
                    <el-col :span="8">
                      <el-select 
                        v-model="warehouse.layer" 
                        placeholder="层" 
                        style="width: 100%"
                        @change="handleWarehouseChange"
                      >
                        <el-option 
                          v-for="num in 10" 
                          :key="num" 
                          :label="String(num).padStart(2, '0')" 
                          :value="String(num).padStart(2, '0')" 
                        />
                      </el-select>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
        </el-form>
        
        <!-- 操作按钮 -->
        <div class="button-group">
          <el-button type="primary" @click="submitLibrary">
            <i class="el-icon-check"></i>
            确认入库
          </el-button>
          <el-button @click="resetForm">
            <i class="el-icon-refresh"></i>
            重置
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 订单入库组件
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getEntryId, addLibrary } from '@/api/management/order'

// 表单引用
const libraryFormRef = ref()

// 入库表单数据
const libraryForm = ref({
  entryid: '',
  orderid: '',
  count: null,
  location: ''
})

// 仓库选择数据
const warehouse = ref({
  area: '',
  group: '',
  layer: ''
})

// 关联工单列表
const orderList = ref([])

// 入库编号加载状态
const entryIdLoading = ref(false)

// 表单验证规则
const formRules = {
  entryid: [
    { required: true, message: '入库编号不能为空', trigger: 'blur' }
  ],
  orderid: [
    { required: true, message: '请选择关联工单', trigger: 'change' }
  ],
  count: [
    { required: true, message: '请输入入库数量', trigger: 'blur' },
    { type: 'number', message: '入库数量必须为数字', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请选择入库仓库', trigger: 'change' }
  ]
}

// 获取入库编号和关联工单列表
const getEntryIdFunc = async () => {
  if (entryIdLoading.value) return
  
  entryIdLoading.value = true
  try {
    // 调用API获取入库编号和关联工单列表
    const response = await getEntryId({})
    
    if (response.code === 200) {
      // 设置入库编号
      libraryForm.value.entryid = response.data.entryid || response.data
      
      // 设置关联工单列表
      if (response.data.orderList && Array.isArray(response.data.orderList)) {
        orderList.value = response.data.orderList
        ElMessage.success('入库编号和关联工单列表获取成功！')
      } else {
        orderList.value = []
        ElMessage.warning('未获取到关联工单列表')
      }
    } else {
      ElMessage.error(response.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    entryIdLoading.value = false
  }
}

// 获取关联工单列表
const getOrderList = async () => {
  try {
    // 关联工单数据已经在 getEntryId 接口中返回
    // 这里不需要单独调用API，直接使用 getEntryId 返回的 orderList
    console.log('关联工单列表已通过 getEntryId 接口获取')
  } catch (error) {
    console.error('处理关联工单列表失败:', error)
    ElMessage.error('处理关联工单列表失败，请稍后重试')
  }
}

// 处理仓库选择变化
const handleWarehouseChange = () => {
  if (warehouse.value.area && warehouse.value.group && warehouse.value.layer) {
    libraryForm.value.location = `${warehouse.value.area}-${warehouse.value.group}-${warehouse.value.layer}`
  } else {
    libraryForm.value.location = ''
  }
}

// 提交入库
const submitLibrary = async () => {
  if (!libraryFormRef.value) return
  
  try {
    await libraryFormRef.value.validate()
    
    // 构造提交数据
    const submitData = {
      entryid: libraryForm.value.entryid,
      orderid: libraryForm.value.orderid,
      count: libraryForm.value.count,
      location: libraryForm.value.location
    }
    
    // 调用API提交入库
    const response = await addLibrary(submitData)
    
    if (response.code === 200) {
      ElMessage.success('入库成功！')
      // 提交成功后重置表单
      resetForm()
    } else {
      ElMessage.error(response.msg || '入库失败')
    }
  } catch (error) {
    console.error('入库失败:', error)
    ElMessage.error('入库失败，请稍后重试')
  }
}

// 重置表单
const resetForm = () => {
  libraryFormRef.value?.resetFields()
  
  // 重置仓库选择
  warehouse.value = {
    area: '',
    group: '',
    layer: ''
  }
  
  libraryForm.value.location = ''
  
  // 重置入库编号并获取新编号
  libraryForm.value.entryid = ''
  getEntryIdFunc()
  
  ElMessage.info('表单已重置')
}

// 页面加载时的初始化逻辑
onMounted(async () => {
  console.log('订单入库页面已加载')
  // 页面刷新时自动获取入库编号和关联工单列表
  await Promise.all([getEntryIdFunc(), getOrderList()])
})
</script>

<style scoped>
.in-library-container {
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
  margin-top: 20px;
  min-height: 300px;
}

.library-form {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.library-form .el-form-item {
  margin-bottom: 20px;
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
</style>