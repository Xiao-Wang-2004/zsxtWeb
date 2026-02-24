<template>
  <div class="out-refer-container">
    <div class="info-card">
      <p class="info-title">出库发货记录</p>
      
      <!-- 搜索栏 -->
      <div class="search-bar" style="margin-left: 15px;">
        <!-- 第一行：搜索条件 -->
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
          <el-input
            v-model="searchForm.outid"
            placeholder="请输入出库单号"
            style="width: 150px; flex-shrink: 0;"
          />
          <el-date-picker
            v-model="searchForm.date"
            type="date"
            placeholder="请选择出库时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 150px; flex-shrink: 0;"
          />
          <el-input
            v-model="searchForm.orderid"
            placeholder="请输入关联订单"
            style="width: 150px; flex-shrink: 0;"
          />
          <el-input
            v-model="searchForm.count"
            placeholder="请输入出库数量"
            style="width: 150px; flex-shrink: 0;"
          />
          <el-input
            v-model="searchForm.name"
            placeholder="请输入操作人"
            style="width: 150px; flex-shrink: 0;"
          />
        </div>
        <!-- 第二行：操作按钮 -->
        <div style="display: flex; gap: 10px;">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      
      <el-table :data="tableData" height="auto" style="width: 100%; margin-top: 0px; margin-bottom: 0px;">
        <el-table-column prop="outid" label="出库单号" width="220">
          <template #default="{ row }">
            <span>{{ row.outid }}</span>
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
        <el-table-column prop="date" label="出库时间" width="220" sortable />
        <el-table-column prop="orderid" label="关联订单" width="220" />
        <el-table-column prop="count" label="出库数量" width="180" />
        <el-table-column prop="name" label="操作人" width="120" />
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
import { getOutList } from '@/api/refer/index';

// 分页相关变量
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 搜索相关变量
const searchForm = ref({
  outid: '',
  date: '',
  orderid: '',
  count: '',
  name: ''
});

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
    outid: '',
    date: '',
    orderid: '',
    count: '',
    name: ''
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
      outid: searchForm.value.outid || undefined,
      date: searchForm.value.date || undefined,
      orderid: searchForm.value.orderid || undefined,
      count: searchForm.value.count || undefined,
      name: searchForm.value.name || undefined
    };

    const response = await getOutList(params);
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
      console.error('获取出库列表失败:', response.msg);
      ElMessage.error(response.msg || '获取出库列表失败');
    }
  } catch (error) {
    console.error('获取出库列表失败:', error);
    ElMessage.error('获取出库列表失败');
  }
};

// 页面加载时获取订单列表数据
onMounted(async () => {
  fetchData();
});
</script>

<style scoped>
.out-refer-container {
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