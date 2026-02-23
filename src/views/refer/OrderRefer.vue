<template>
  <div class="order-refer-container">
    <div class="info-card">
      <p class="info-title">历史订单综合查询</p>
      
      <!-- 搜索栏 -->
      <div class="search-bar" style="margin-left: 15px;">
        <!-- 第一行：搜索条件 -->
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
          <el-input
            v-model="searchForm.orderid"
            placeholder="请输入订单编号"
            style="width: 150px; flex-shrink: 0;"
          />
          <el-date-picker
            v-model="searchForm.order_date"
            type="date"
            placeholder="请选择订单日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 150px; flex-shrink: 0;"
          />
          <el-input
            v-model="searchForm.unit_name"
            placeholder="请输入客户"
            style="width: 150px; flex-shrink: 0;"
          />
          <el-input
            v-model="searchForm.product_name"
            placeholder="请输入产品"
            style="width: 150px; flex-shrink: 0;"
          />
          <el-input
            v-model="searchForm.machineid"
            placeholder="请输入机台"
            style="width: 150px; flex-shrink: 0;"
          />
          <el-date-picker
            v-model="searchForm.delivery_date"
            type="date"
            placeholder="请选择交付日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 150px; flex-shrink: 0;"
          />
          <el-select
            v-model="searchForm.type"
            placeholder="请选择状态"
            style="width: 150px; flex-shrink: 0;"
            clearable
          >
            <el-option label="生产中" value="1" />
            <el-option label="已完成" value="2" />
            <el-option label="已出库" value="3" />
            <el-option label="已逾期" value="4" />
          </el-select>
        </div>
        <!-- 第二行：操作按钮 -->
        <div style="display: flex; gap: 10px;">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      
      <el-table :data="tableData" height="auto" style="width: 100%; margin-top: 0px; margin-bottom: 0px;">
        <el-table-column prop="orderid" label="订单编号" width="180">
          <template #default="{ row }">
            <span>{{ row.orderid }}</span>
            <el-tooltip v-if="row.remark" placement="top">
              <template #content>{{ row.remark }}</template>
              <img 
                src="@/views/refer/assets/remark.png" 
                alt="备注" 
                style="width: 16px; height: 16px; margin-left: 5px; cursor: pointer;"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="order_date" label="订单日期" width="120" sortable />
        <el-table-column prop="unit_name" label="客户" width="180" />
        <el-table-column prop="product_name" label="产品" width="130" />
        <el-table-column prop="machineid" label="机台" width="100" />
        <el-table-column prop="order_count" label="订单数" width="110" />
        <el-table-column prop="product_count" label="已产数" width="110" />
        <el-table-column prop="delivery_date" label="交付日期" width="120" sortable />
        <el-table-column prop="type" label="状态" width="100">
          <template #default="{ row }">
            <el-tag 
              :type="getStatusType(row.type)" 
              size="small"
            >
              {{ getStatusText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页组件 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :pager-count="5"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 0px; text-align: center;"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElMessage, ElPagination, ElInput, ElDatePicker, ElSelect, ElOption, ElTag, ElTooltip } from 'element-plus';
import { getOrderList } from '@/api/refer/index';

// 分页相关变量
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 搜索相关变量
const searchForm = ref({
  orderid: '',
  order_date: '',
  unit_name: '',
  product_name: '',
  machineid: '',
  delivery_date: '',
  type: ''
});

// 获取状态类型（用于标签颜色）
const getStatusType = (status) => {
  switch(status) {
    case 1: return 'warning';  // 生产中 - 橙色
    case 2: return 'success';  // 已完成 - 绿色
    case 3: return 'info';     // 已出库 - 蓝色
    case 4: return 'danger';   // 已逾期 - 红色
    default: return 'info';
  }
};

// 获取状态文本
const getStatusText = (status) => {
  switch(status) {
    case 1: return '生产中';
    case 2: return '已完成';
    case 3: return '已出库';
    case 4: return '已逾期';
    default: return '未知状态';
  }
};

// 搜索处理函数
const handleSearch = () => {
  // 重置到第一页，使用当前的搜索条件重新获取数据
  currentPage.value = 1;
  fetchData();
};

// 重置搜索条件
const resetSearch = () => {
  // 清空搜索条件
  searchForm.value = {
    orderid: '',
    order_date: '',
    unit_name: '',
    product_name: '',
    machineid: '',
    delivery_date: '',
    type: ''
  };
  // 重置到第一页并重新获取所有数据
  currentPage.value = 1;
  fetchData();
};

// 分页大小改变处理函数
const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchData();
};

// 当前页改变处理函数
const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchData();
};

// 获取数据函数
const fetchData = async () => {
  try {
    // 将搜索条件加入请求参数
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      orderid: searchForm.value.orderid || undefined,
      order_date: searchForm.value.order_date || undefined,
      unit_name: searchForm.value.unit_name || undefined,
      product_name: searchForm.value.product_name || undefined,
      machineid: searchForm.value.machineid || undefined,
      delivery_date: searchForm.value.delivery_date || undefined,
      type: searchForm.value.type || undefined
    };

    const response = await getOrderList(params);
    console.log('API Response:', response); // 调试日志

    if (response.code === 200) {
      // 尝试不同的数据结构
      if (response.data && response.data.list !== undefined && response.data.total !== undefined) {
        // 符合预期的分页数据结构
        tableData.value = response.data.list || [];
        total.value = response.data.total || 0;
      } else if (Array.isArray(response.data)) {
        // 如果直接返回数组
        tableData.value = response.data || [];
        total.value = response.data.length || 0;
      } else {
        // 其他情况
        tableData.value = response.data || [];
        total.value = response.data ? response.data.length || 0 : 0;
      }
    } else {
      console.error('获取订单列表失败:', response.msg);
      ElMessage.error(response.msg || '获取订单列表失败');
    }
  } catch (error) {
    console.error('获取订单列表失败:', error);
    ElMessage.error('获取订单列表失败');
  }
};

// 页面加载时获取订单列表数据
onMounted(async () => {
  fetchData();
});
</script>

<style scoped>
.order-refer-container {
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
  height: 2px; /* 顶部装饰高度 */
  background-color: #E6A23C; /* 修改为指定的颜色 #E6A23C */
  border-radius: 5px 5px 0 0;
}

/* 为内容留出空间，避免被顶部装饰遮挡 */
.info-card > * {
  position: relative;
  z-index: 1;
  padding-top: 20px;
  padding-left: 15px;
  padding-right: 20px;
  padding-bottom: 20px;
}

.info-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
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

.search-bar{
  padding-bottom: 0px;
}
</style>