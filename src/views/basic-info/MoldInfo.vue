<template>
  <div class="mold-info-container">
    <div class="info-card">
      <p class="info-title">模具台账管理</p>
      <el-button type="primary" class="el-button" @click="showAddForm">
        <img :src="addIcon" alt="" style="width: 16px; height: 16px; margin-right: 5px;" />
        新增模具
      </el-button>
      <el-button type="warning" class="el-button" @click="batchMaintain" :disabled="multipleSelection.length === 0" style="margin-left: 30px;">
        <img :src="keepIcon" alt="" style="width: 16px; height: 16px; margin-right: 5px;" />
        批量保养
        <span v-if="multipleSelection.length > 0" style="margin-left: 5px;">({{ multipleSelection.length }})</span>
      </el-button>
      <el-button type="danger" class="el-button" @click="batchDelete" :disabled="multipleSelection.length === 0" style="margin-left: 30px;">
        <img :src="deleteIcon" alt="" style="width: 16px; height: 16px; margin-right: 5px;" />
        批量删除
        <span v-if="multipleSelection.length > 0" style="margin-left: 5px;">({{ multipleSelection.length }})</span>
      </el-button>
      
      <!-- 搜索栏 -->
      <div class="search-bar" style="margin-left: 15px;">
        <el-input
          v-model="searchForm.moldid"
          placeholder="请输入模具编号"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px;"
        />
        <el-input
          v-model="searchForm.name"
          placeholder="请输入模具名称"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px;"
        />
        <el-input
          v-model="searchForm.count"
          placeholder="请输入穴数"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px;"
        />
        <el-input
          v-model="searchForm.type"
          placeholder="请输入适用机型"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px;"
        />
        <el-input
          v-model="searchForm.location"
          placeholder="请输入存放位置"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px;"
        />
        <el-button type="primary" @click="handleSearch" style="margin-right: 10px; margin-bottom: 10px;">搜索</el-button>
        <el-button @click="resetSearch" style="margin-bottom: 10px;">重置</el-button>
      </div>
      <el-table :data="tableData" height="auto" style="width: 100%; margin-top: 10px; margin-bottom: 10px;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="canDelete" />
        <el-table-column prop="moldid" label="模具编号" width="120" />
        <el-table-column prop="name" label="模具名称" width="150" />
        <el-table-column prop="count" label="穴数" width="80" />
        <el-table-column prop="type" label="适用机型" width="120" />
        <el-table-column label="设计寿命(模)" width="120">
          <template #default="{ row }">{{ formatNumberWithCommas(row.life) }}</template>
        </el-table-column>
        <el-table-column label="已使用(模)" width="120">
          <template #default="{ row }">{{ formatNumberWithCommas(row.usedlife) }}</template>
        </el-table-column>
        <el-table-column prop="location" label="存放位置" width="120" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <span v-if="row.status === '1'" class="status-tag normal-tag">正常</span>
            <span v-else class="status-tag maintenance-tag">需保养</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="225">
          <template #default="{ row }" >
            <el-button type="warning" size="small" @click="handleMaintenance(row)">保养</el-button>
            <el-button type="primary" size="small" @click="handleEdit(row)">修改</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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

    <!-- 编辑表单弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑模具信息" width="600px">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="auto"
      >
        <el-form-item label="模具编号" prop="moldid">
          <el-input v-model="editForm.moldid" :disabled="true" />
        </el-form-item>
        <el-form-item label="模具名称" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="穴数" prop="count">
          <el-input v-model="editForm.count" />
        </el-form-item>
        <el-form-item label="适用机型" prop="type">
          <el-input v-model="editForm.type" />
        </el-form-item>
        <el-form-item label="设计寿命(模)" prop="life">
          <el-input v-model.number="editForm.life" />
        </el-form-item>
        <el-form-item label="已使用(模)" prop="usedlife">
          <el-input v-model.number="editForm.usedlife" />
        </el-form-item>
        <el-form-item label="存放位置" prop="location">
          <el-input v-model="editForm.location" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="选择状态">
            <el-option label="正常" value="1" />
            <el-option label="需保养" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditForm(editFormRef)">保存</el-button>
          <el-button @click="cancelEditForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新增表单弹窗 -->
    <el-dialog v-model="addDialogVisible" title="新增模具信息" width="600px">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="auto"
      >
        <el-form-item label="模具编号" prop="moldid">
          <el-input v-model="addForm.moldid" />
        </el-form-item>
        <el-form-item label="模具名称" prop="name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="穴数" prop="count">
          <el-input v-model="addForm.count" />
        </el-form-item>
        <el-form-item label="适用机型" prop="type">
          <el-input v-model="addForm.type" />
        </el-form-item>
        <el-form-item label="设计寿命(模)" prop="life">
          <el-input v-model.number="addForm.life" />
        </el-form-item>
        <el-form-item label="已使用(模)" prop="usedlife">
          <el-input v-model.number="addForm.usedlife" />
        </el-form-item>
        <el-form-item label="存放位置" prop="location">
          <el-input v-model="addForm.location" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="addForm.status" placeholder="选择状态">
            <el-option label="正常" value="1" />
            <el-option label="需保养" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAddForm(addFormRef)">添加</el-button>
          <el-button @click="cancelAddForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { ElButton, ElTable, ElTableColumn, ElMessage, ElMessageBox, ElPagination, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus';
import addIcon from '@/views/basic-info/assets/add.png';
import deleteIcon from '@/views/basic-info/assets/delete.png';
import keepIcon from '@/views/basic-info/assets/keep.png';
import { getMoldList, updateMold, deleteMold, keepMold } from '@/api/information/mold';

// 格式化数字，添加千分隔符
const formatNumberWithCommas = (num) => {
  if (num == null || num === '') return '';
  return Number(num).toLocaleString('en-US');
};

// 解析带千分隔符的数字字符串为纯数字
const parseNumberWithCommas = (str) => {
  if (str == null || str === '') return '';
  return str.toString().replace(/,/g, '');
};

// 分页相关变量
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 批量删除相关变量
const multipleSelection = ref([]);

// 搜索相关变量
const searchForm = ref({
  moldid: '',
  name: '',
  count: '',
  type: '',
  location: ''
});

// 编辑相关变量
const editDialogVisible = ref(false);
const editFormRef = ref();
const editForm = ref({
  moldid: '',
  name: '',
  count: '',
  type: '',
  life: '',
  usedlife: '',
  location: '',
  status: ''
});
// 存储原始的模具编号
const originalMoldId = ref('');

// 新增相关变量
const addDialogVisible = ref(false);
const addFormRef = ref();
const addForm = ref({
  moldid: '',
  name: '',
  count: '',
  type: '',
  life: '',
  usedlife: '',
  location: '',
  status: ''
});

// 表单验证规则
const editFormRules = ref({
  moldid: [
    { required: true, message: '模具编号不能为空', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '模具名称不能为空', trigger: 'blur' }
  ],
  count: [
    { required: true, message: '穴数不能为空', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '适用机型不能为空', trigger: 'blur' }
  ],
  life: [
    { required: true, message: '设计寿命不能为空', trigger: 'blur' },
    { pattern: /^\d+$/, message: '设计寿命必须为数字', trigger: 'blur' }
  ],
  usedlife: [
    { required: true, message: '已使用数量不能为空', trigger: 'blur' },
    { pattern: /^\d+$/, message: '已使用数量必须为数字', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '存放位置不能为空', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '状态不能为空', trigger: 'change' }
  ]
});

// 新增表单验证规则
const addFormRules = ref({
  moldid: [
    { required: true, message: '模具编号不能为空', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '模具名称不能为空', trigger: 'blur' }
  ],
  count: [
    { required: true, message: '穴数不能为空', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '适用机型不能为空', trigger: 'blur' }
  ],
  life: [
    { required: true, message: '设计寿命不能为空', trigger: 'blur' },
    { pattern: /^\d+$/, message: '设计寿命必须为数字', trigger: 'blur' }
  ],
  usedlife: [
    { required: true, message: '已使用数量不能为空', trigger: 'blur' },
    { pattern: /^\d+$/, message: '已使用数量必须为数字', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '存放位置不能为空', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '状态不能为空', trigger: 'change' }
  ]
});

// 编辑处理函数
const handleEdit = (row) => {
  // 保存原始模具编号
  originalMoldId.value = row.moldid;
  console.log('保存原始模具编号:', originalMoldId.value); // 调试日志
  // 填充表单数据，直接使用后端API字段
  editForm.value = { ...row };
  console.log('填充表单数据:', editForm.value); // 调试日志
  // 显示编辑对话框
  editDialogVisible.value = true;
};

// 保养处理函数
const handleMaintenance = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要对模具 "${row.name}" 进行保养吗？`,
      '确认保养',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    // 调用保养接口，将单条数据也放入数组中进行保养
    const response = await keepMold({ moldids: [row.moldid] });
    
    if (response.code === 200) {
      ElMessage.success('保养成功');
      // 重新获取数据
      fetchData();
    } else {
      ElMessage.error(response.msg || '保养失败');
    }
  } catch (error) {
    // 用户取消保养或出现错误
    if (error !== 'cancel') {
      console.error('保养模具失败:', error);
      ElMessage.error('保养失败，请稍后重试');
    }
  }
};

// 删除处理函数
const handleDelete = async (row) => {
  // 确认删除提示
  try {
    await ElMessageBox.confirm(
      `确定要删除模具 "${row.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    // 调用删除接口，将单条数据也放入数组中进行删除
    const response = await deleteMold({ moldids: [row.moldid] });
    
    if (response.code === 200) {
      ElMessage.success('删除成功');
      // 重新获取数据
      fetchData();
    } else {
      ElMessage.error(response.msg || '删除失败');
    }
  } catch (error) {
    // 用户取消删除或出现错误
    if (error !== 'cancel') {
      console.error('删除模具失败:', error);
      ElMessage.error('删除失败，请稍后重试');
    }
  }
};

// 提交编辑表单
const submitEditForm = async (formEl) => {
  if (!formEl) return;
  
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        // 使用原始模具编号作为 id 参数，确保即使模具编号字段意外被修改也能正确更新
        const requestData = {
          ...editForm.value,
          life: parseInt(editForm.value.life),  // 转换为整型
          usedlife: parseInt(editForm.value.usedlife),  // 转换为整型
          moldid: originalMoldId.value  // 使用原始模具编号作为 id
        };
        
        console.log('发送请求数据:', requestData); // 调试日志
        
        const response = await updateMold(requestData);
        if (response.code === 200) {
          ElMessage.success('模具信息已更新');
          editDialogVisible.value = false;
          // 重新获取数据
          fetchData();
        } else {
          ElMessage.error(response.msg || '更新失败');
        }
      } catch (error) {
        console.error('更新模具信息失败:', error);
        ElMessage.error('更新失败，请稍后重试');
      }
    } else {
      console.log('验证失败!', fields);
    }
  });
};

// 取消编辑表单
const cancelEditForm = () => {
  editDialogVisible.value = false;
  if (editFormRef.value) {
    editFormRef.value.clearValidate(); // 清除验证状态
    editFormRef.value.resetFields(); // 重置表单字段
  }
};

// 显示新增表单
const showAddForm = () => {
  // 重置表单
  addForm.value = {
    moldid: '',
    name: '',
    count: '',
    type: '',
    life: '',
    usedlife: '',
    location: '',
    status: ''
  };
  
  if (addFormRef.value) {
    addFormRef.value.clearValidate(); // 清除验证状态
  }
  
  // 显示新增对话框
  addDialogVisible.value = true;
};

// 提交新增表单
const submitAddForm = async (formEl) => {
  if (!formEl) return;
  
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        // 只传递指定的字段
        const requestData = {
          moldid: addForm.value.moldid,
          name: addForm.value.name,
          count: addForm.value.count,  // 映射字段
          type: addForm.value.type,  // 映射字段
          life: addForm.value.life,  // 映射字段
          usedlife: addForm.value.usedlife,  // 映射字段
          location: addForm.value.location,
          status: addForm.value.status
        };
        
        console.log('发送新增请求数据:', requestData); // 调试日志
        
        const response = await updateMold(requestData);
        if (response.code === 200) {
          ElMessage.success('模具信息已添加');
          addDialogVisible.value = false;
          // 重新获取数据
          fetchData();
        } else {
          ElMessage.error(response.msg || '添加失败');
        }
      } catch (error) {
        console.error('添加模具信息失败:', error);
        ElMessage.error('添加失败，请稍后重试');
      }
    } else {
      console.log('验证失败!', fields);
    }
  });
};

// 取消新增表单
const cancelAddForm = () => {
  addDialogVisible.value = false;
  if (addFormRef.value) {
    addFormRef.value.clearValidate(); // 清除验证状态
    addFormRef.value.resetFields(); // 重置表单字段
  }
};



// 当选择项发生变化时触发
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

// 检查是否可以删除（可以根据业务逻辑决定哪些项目不能删除）
const canDelete = (row, index) => {
  // 这里可以添加条件判断，比如某些记录不允许删除
  // 目前允许所有记录被选择
  return true;
};

// 批量保养处理函数
const batchMaintain = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请至少选择一项需要保养的数据');
    return;
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要对选中的 ${multipleSelection.value.length} 项模具进行保养吗？`,
      '确认批量保养',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    // 收集要保养的模具编号
    const moldids = multipleSelection.value.map(item => item.moldid);
    
    // 调用批量保养接口
    const response = await keepMold({ moldids });
    
    if (response.code === 200) {
      ElMessage.success(`成功对 ${multipleSelection.value.length} 条模具进行了保养`);
      multipleSelection.value = [];
      // 重新获取数据
      fetchData();
    } else {
      ElMessage.error(response.msg || '批量保养失败');
    }
  } catch (error) {
    // 用户取消保养或出现错误
    if (error !== 'cancel') {
      console.error('批量保养失败:', error);
      ElMessage.error('批量保养失败，请稍后重试');
    }
  }
};

// 批量删除处理函数
const batchDelete = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请至少选择一项要删除的数据');
    return;
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${multipleSelection.value.length} 项数据吗？`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    // 收集要删除的模具编号
    const moldids = multipleSelection.value.map(item => item.moldid);
    
    // 调用批量删除接口
    const response = await deleteMold({ moldids });
    
    if (response.code === 200) {
      ElMessage.success(`成功删除了 ${multipleSelection.value.length} 条数据`);
      multipleSelection.value = [];
      // 重新获取数据
      fetchData();
    } else {
      ElMessage.error(response.msg || '批量删除失败');
    }
  } catch (error) {
    // 用户取消删除或出现错误
    if (error !== 'cancel') {
      console.error('批量删除失败:', error);
      ElMessage.error('批量删除失败，请稍后重试');
    }
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
    moldid: '',
    name: '',
    count: '',
    type: '',
    location: ''
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
      moldid: searchForm.value.moldid || undefined,
      name: searchForm.value.name || undefined,
      count: searchForm.value.count || undefined,
      type: searchForm.value.type || undefined,
      location: searchForm.value.location || undefined
    };
    
    const response = await getMoldList(params);
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
      console.error('获取模具列表失败:', response.msg);
      ElMessage.error(response.msg || '获取模具列表失败');
    }
  } catch (error) {
    console.error('获取模具列表失败:', error);
  }
};

// 页面加载时获取模具列表数据
onMounted(async () => {
  fetchData();
});


</script>

<style scoped>
.mold-info-container {
  width: 100%;
  height: 100%;
  padding-top: 0px;
  box-sizing: border-box;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.info-card {
  background-color: #FFFFFF; /* 白色背景 (RGB: 255, 255, 255) */
  border-radius: 2px; /* 圆角 */
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-top: 0px; /* 与标题的间距 */
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
  height: 2px; /* 顶部蓝色点缀高度 */
  background-color: rgb(60, 141, 188); /* 您指定的颜色 (60, 141, 188) */
  border-radius: 5px 5px 0 0; /* 顶部保持圆角 */
}

/* 为内容留出空间，避免被顶部装饰遮挡 */
.info-card > * {
  position: relative;
  z-index: 1;
  padding-top: 20px; /* 额外的内边距以避开顶部蓝色区域 */
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

.el-button {
  margin-left: 30px;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.normal-tag {
  background-color: #ecf5ff;
  color: #409EFF;
  border: 1px solid #b3d8ff;
  height: 15px;
}

.maintenance-tag {
  background-color: #f0f9eb;
  color: #e6a23c;
  border: 1px solid #f5dab1;
  height: 15px;
}

.search-bar{
  padding-bottom: 0px;
}

</style>