<template>
  <div class="order-create-container">
    <div class="info-card">
      <p class="info-title">新建注塑生产工单</p>
      <!-- 订单生成内容区域 -->
      <div class="order-content">
        <el-form 
          :model="orderForm" 
          :rules="formRules" 
          ref="orderFormRef" 
          label-width="120px" 
          class="order-form"
        >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="工单编号" prop="orderid">
                  <el-input 
                    v-model="orderForm.orderid" 
                    placeholder="系统自动生成" 
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客户" prop="unitid">
                  <el-select 
                    v-model="orderForm.unitid" 
                    placeholder="请选择或搜索客户" 
                    style="width: 100%"
                    filterable
                    remote
                    :remote-method="filterCustomers"
                    :loading="customerLoading"
                    @focus="loadAllCustomers"
                  >
                    <el-option 
                      v-for="customer in filteredCustomerOptions" 
                      :key="customer.unitid" 
                      :label="customer.name" 
                      :value="customer.unitid" 
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="交付日期" prop="delivery_date">
                  <el-date-picker
                    v-model="orderForm.delivery_date"
                    type="date"
                    placeholder="请选择交付日期"
                    style="width: 100%"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品选择" prop="productid">
                  <el-select 
                    v-model="orderForm.productid" 
                    placeholder="请选择或搜索产品" 
                    style="width: 100%"
                    filterable
                    remote
                    :remote-method="filterProducts"
                    :loading="productLoading"
                    @change="handleProductChange"
                    @focus="loadAllProducts"
                  >
                    <el-option 
                      v-for="product in filteredProductOptions" 
                      :key="product.productid" 
                      :label="product.name" 
                      :value="product.productid" 
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="模具选择" prop="moldid">
                  <el-select 
                    v-model="orderForm.moldid" 
                    placeholder="请先选择产品" 
                    style="width: 100%"
                    disabled
                  >
                    <el-option 
                      v-for="mold in moldOptions" 
                      :key="mold.value" 
                      :label="mold.label" 
                      :value="mold.value" 
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="注塑原料" prop="numberid">
                  <el-select 
                    v-model="orderForm.numberid" 
                    :placeholder="orderForm.productid ? '请选择注塑原料' : '请先选择产品'" 
                    style="width: 100%"
                    :disabled="!orderForm.productid || relatedLoading"
                    :loading="relatedLoading"
                  >
                    <el-option 
                      v-for="material in materialOptions" 
                      :key="material.value" 
                      :label="material.label" 
                      :value="material.value" 
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="计划生产数" prop="order_count">
                  <el-input-number 
                    v-model="orderForm.order_count" 
                    :min="1" 
                    :max="999999" 
                    style="width: 100%" 
                    controls-position="right"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="排产机台" prop="machineid">
                  <el-select 
                    v-model="orderForm.machineid" 
                    placeholder="请选择或搜索机台" 
                    style="width: 100%"
                    filterable
                    remote
                    :remote-method="filterMachines"
                    :loading="machineLoading"
                    @focus="loadAllMachines"
                  >
                    <el-option 
                      v-for="machine in filteredMachineOptions" 
                      :key="machine.machineid" 
                      :label="machine.machineid" 
                      :value="machine.machineid" 
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input 
                    v-model="orderForm.remark" 
                    type="textarea" 
                    :rows="3" 
                    placeholder="请输入备注信息"
                    maxlength="20"
                    show-word-limit
                  />
                  <div class="remark-tip">字数不得超过20</div>
                </el-form-item>
              </el-col>
            </el-row>
        </el-form>
        
        <!-- 操作按钮 -->
        <div class="button-group">
          <el-button type="primary" @click="submitOrder">
            <i class="el-icon-check"></i>
            提交订单
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
// 订单生成组件
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getOrder, getRelatedInfo, addOrder } from '@/api/management/order'
import { getUnitList } from '@/api/information/unit'
import { getProductInfoList } from '@/api/information/product'
import { getMachineInfoList } from '@/api/information/machine'

// 表单引用
const orderFormRef = ref()

// 订单表单数据
const orderForm = ref({
  orderid: '',
  unitid: '',
  delivery_date: '',
  productid: '',
  moldid: '',
  numberid: '',
  order_count: null,
  machineid: '',
  remark: ''
})

// 模具选项
const moldOptions = ref([])

// 原料选项
const materialOptions = ref([])

// 客户选项
const customerOptions = ref([])

// 过滤后的客户选项
const filteredCustomerOptions = ref([])

// 客户加载状态
const customerLoading = ref(false)

// 产品选项
const productOptions = ref([])

// 过滤后的产品选项
const filteredProductOptions = ref([])

// 产品加载状态
const productLoading = ref(false)

// 工单ID加载状态
const orderIdLoading = ref(false)

// 相关数据加载状态
const relatedLoading = ref(false)

// 机台设备选项
const machineOptions = ref([])

// 过滤后的机台设备选项
const filteredMachineOptions = ref([])

// 机台设备加载状态
const machineLoading = ref(false)

// 表单验证规则
const formRules = {
  orderid: [
    { required: true, message: '工单编号不能为空', trigger: 'blur' }
  ],
  unitid: [
    { required: true, message: '请选择客户', trigger: 'change' }
  ],
  delivery_date: [
    { required: true, message: '请选择交付日期', trigger: 'change' }
  ],
  productid: [
    { required: true, message: '请选择产品', trigger: 'change' }
  ],
  moldid: [
    { required: true, message: '请选择模具', trigger: 'change' }
  ],
  numberid: [
    { required: true, message: '请选择注塑原料', trigger: 'change' }
  ],
  order_count: [
    { required: true, message: '请输入计划生产数', trigger: 'blur' },
    { type: 'number', message: '计划生产数必须为数字', trigger: 'blur' }
  ],
  machineid: [
    { required: true, message: '请选择排产机台', trigger: 'change' }
  ],
  remark: [
    { max: 20, message: '备注字数不得超过20个字符', trigger: 'blur' }
  ]
}

// 获取工单ID
const getOrderId = async () => {
  if (orderIdLoading.value) return
  
  orderIdLoading.value = true
  try {
    // 调用API获取工单ID
    const response = await getOrder({})
    
    if (response.code === 200) {
      orderForm.value.orderid = response.data.orderid || response.data
      ElMessage.success('工单编号获取成功！')
    } else {
      ElMessage.error(response.msg || '获取工单编号失败')
    }
  } catch (error) {
    console.error('获取工单编号失败:', error)
    ElMessage.error('获取工单编号失败，请稍后重试')
  } finally {
    orderIdLoading.value = false
  }
}

// 获取客户列表
const getCustomerList = async () => {
  try {
    console.log('开始调用 getUnitList 接口');
    const response = await getUnitList({});
    console.log('接口返回原始数据:', response);
    
    if (response.code === 200) {
      // 处理嵌套的数据结构 {data: {list: [...]}}
      let dataList = [];
      if (response.data && response.data.list) {
        dataList = response.data.list;
      } else if (Array.isArray(response.data)) {
        dataList = response.data;
      }
      
      console.log('提取的数据列表:', dataList);
      
      // 筛选type为"1"的客户数据
      customerOptions.value = dataList.filter(item => item.type === '1');
      filteredCustomerOptions.value = [...customerOptions.value]; // 初始化过滤选项
      console.log('筛选后的客户列表:', customerOptions.value);
      console.log('客户选项数量:', customerOptions.value.length);
    } else {
      console.error('接口返回错误状态:', response.code, response.msg);
      ElMessage.error(response.msg || '获取客户列表失败');
    }
  } catch (error) {
    console.error('获取客户列表发生异常:', error);
    ElMessage.error('获取客户列表失败，请稍后重试');
  }
};

// 加载所有客户（用于下拉框聚焦时）
const loadAllCustomers = () => {
  filteredCustomerOptions.value = [...customerOptions.value];
};

// 过滤客户（支持模糊搜索）
const filterCustomers = (query) => {
  if (query === '') {
    filteredCustomerOptions.value = [...customerOptions.value];
  } else {
    customerLoading.value = true;
    // 使用防抖优化搜索性能
    setTimeout(() => {
      filteredCustomerOptions.value = customerOptions.value.filter(customer => 
        customer.name.toLowerCase().includes(query.toLowerCase())
      );
      customerLoading.value = false;
    }, 300);
  }
};

// 获取产品列表
const getProductList = async () => {
  try {
    console.log('开始调用 getProductInfoList 接口');
    const response = await getProductInfoList({});
    console.log('产品接口返回原始数据:', response);
    
    if (response.code === 200) {
      // 处理嵌套的数据结构 {data: {list: [...]}}
      let dataList = [];
      if (response.data && response.data.list) {
        dataList = response.data.list;
      } else if (Array.isArray(response.data)) {
        dataList = response.data;
      }
      
      console.log('提取的产品数据列表:', dataList);
      
      // 设置产品选项数据
      productOptions.value = dataList;
      filteredProductOptions.value = [...dataList]; // 初始化过滤选项
      console.log('产品选项列表:', productOptions.value);
      console.log('产品选项数量:', productOptions.value.length);
    } else {
      console.error('产品接口返回错误状态:', response.code, response.msg);
      ElMessage.error(response.msg || '获取产品列表失败');
    }
  } catch (error) {
    console.error('获取产品列表发生异常:', error);
    ElMessage.error('获取产品列表失败，请稍后重试');
  }
};

// 加载所有产品（用于下拉框聚焦时）
const loadAllProducts = () => {
  filteredProductOptions.value = [...productOptions.value];
};

// 过滤产品（支持模糊搜索）
const filterProducts = (query) => {
  if (query === '') {
    filteredProductOptions.value = [...productOptions.value];
  } else {
    productLoading.value = true;
    // 使用防抖优化搜索性能
    setTimeout(() => {
      filteredProductOptions.value = productOptions.value.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      productLoading.value = false;
    }, 300);
  }
};

// 处理产品选择变化
const handleProductChange = async (value) => {
  // 重置相关字段
  orderForm.value.moldid = ''
  orderForm.value.numberid = ''
  
  if (value) {
    relatedLoading.value = true
    try {
      console.log('调用产品关联接口，productid:', value);
      // 调用接口获取产品相关的模具和原料信息
      const response = await getRelatedInfo({ productid: value })
      console.log('接口返回数据:', response);
      
      if (response.code === 200) {
        const data = response.data || {}
        console.log('解析后的数据:', data);
        
        // 处理模具数据
        if (data.moldid) {
          moldOptions.value = [{
            label: data.moldid,
            value: data.moldid
          }]
        } else {
          moldOptions.value = []
        }
        
        // 处理原料数据
        if (data.number_name) {
          materialOptions.value = [{
            label: data.number_name,
            value: data.number_name
          }]
        } else {
          materialOptions.value = []
        }
        
        // 如果只有一项可选项，自动选中
        if (moldOptions.value.length === 1) {
          orderForm.value.moldid = moldOptions.value[0].value
        }
        if (materialOptions.value.length === 1) {
          orderForm.value.numberid = materialOptions.value[0].value
        }
        
        ElMessage.success('相关数据加载成功')
      } else {
        ElMessage.error(response.msg || '获取相关数据失败')
        moldOptions.value = []
        materialOptions.value = []
      }
    } catch (error) {
      console.error('获取产品相关信息失败:', error)
      ElMessage.error('获取相关数据失败，请稍后重试')
      moldOptions.value = []
      materialOptions.value = []
    } finally {
      relatedLoading.value = false
    }
  } else {
    moldOptions.value = []
    materialOptions.value = []
  }
}

// 获取机台设备列表
const getMachineList = async () => {
  try {
    console.log('开始调用 getMachineInfoList 接口');
    const response = await getMachineInfoList({});
    console.log('机台设备接口返回原始数据:', response);
    
    if (response.code === 200) {
      // 处理嵌套的数据结构 {data: {list: [...]}}
      let dataList = [];
      if (response.data && response.data.list) {
        dataList = response.data.list;
      } else if (Array.isArray(response.data)) {
        dataList = response.data;
      }
      
      console.log('提取的机台设备数据列表:', dataList);
      
      // 设置机台设备选项数据
      machineOptions.value = dataList;
      filteredMachineOptions.value = [...dataList]; // 初始化过滤选项
      console.log('机台设备选项列表:', machineOptions.value);
      console.log('机台设备选项数量:', machineOptions.value.length);
    } else {
      console.error('机台设备接口返回错误状态:', response.code, response.msg);
      ElMessage.error(response.msg || '获取机台设备列表失败');
    }
  } catch (error) {
    console.error('获取机台设备列表发生异常:', error);
    ElMessage.error('获取机台设备列表失败，请稍后重试');
  }
};

// 加载所有机台设备（用于下拉框聚焦时）
const loadAllMachines = () => {
  filteredMachineOptions.value = [...machineOptions.value];
};

// 过滤机台设备（支持模糊搜索）
const filterMachines = (query) => {
  if (query === '') {
    filteredMachineOptions.value = [...machineOptions.value];
  } else {
    machineLoading.value = true;
    // 使用防抖优化搜索性能
    setTimeout(() => {
      filteredMachineOptions.value = machineOptions.value.filter(machine => 
        machine.machineid.toLowerCase().includes(query.toLowerCase())
      );
      machineLoading.value = false;
    }, 300);
  }
};

// 提交订单
const submitOrder = async () => {
  if (!orderFormRef.value) return
  
  try {
    await orderFormRef.value.validate()
    
    // 调用API提交订单
    const response = await addOrder(orderForm.value)
    
    if (response.code === 200) {
      ElMessage.success('订单提交成功！')
      // 提交成功后重置表单
      resetForm()
    } else {
      ElMessage.error(response.msg || '订单提交失败')
    }
  } catch (error) {
    console.error('提交订单失败:', error)
    ElMessage.error('订单提交失败，请稍后重试')
  }
}

// 重置表单
const resetForm = () => {
  orderFormRef.value?.resetFields()
  
  // 重置相关数据
  moldOptions.value = []
  materialOptions.value = []
  filteredProductOptions.value = [...productOptions.value]
  filteredCustomerOptions.value = [...customerOptions.value]
  filteredMachineOptions.value = [...machineOptions.value]
  
  // 重置工单编号并获取新编号
  orderForm.value.orderid = ''
  getOrderId()
  
  ElMessage.info('表单已重置')
}

// 页面加载时的初始化逻辑
onMounted(async () => {
  console.log('订单生成页面已加载')
  // 页面刷新时自动获取工单编号、客户列表、产品列表和机台设备列表
  await Promise.all([getOrderId(), getCustomerList(), getProductList(), getMachineList()])
})
</script>

<style scoped>
.order-create-container {
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

.order-content {
  margin-top: 20px;
  min-height: 300px;
}

.order-section {
  margin-bottom: 20px;
}



.order-form {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.order-form .el-form-item {
  margin-bottom: 20px;
}

.remark-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  line-height: 1.2;
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