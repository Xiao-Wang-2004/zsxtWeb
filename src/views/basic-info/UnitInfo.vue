<template>
  <div class="unit-info-container">
    <div class="info-card">
      <p class="info-title">公司/往来单位基本信息</p>
      <el-button type="primary" class="el-button" @click="showAddForm">
        <img :src="addIcon" alt="" style="width: 16px; height: 16px; margin-right: 5px;" />
        新增单位
      </el-button>
      <el-button type="danger" class="el-button" @click="batchDelete" :disabled="multipleSelection.length === 0" style="margin-left: 30px;">
        <img :src="deleteIcon" alt="" style="width: 16px; height: 16px; margin-right: 5px;" />
        批量删除
        <span v-if="multipleSelection.length > 0" style="margin-left: 5px;">({{ multipleSelection.length }})</span>
      </el-button>
      
      <!-- 搜索栏 -->
      <div class="search-bar" style="margin-left: 15px;">
        <el-input
          v-model="searchForm.unitid"
          placeholder="请输入单位编码"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px;"
        />
        <el-input
          v-model="searchForm.name"
          placeholder="请输入单位名称"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px;"
        />
        <el-input
          v-model="searchForm.person"
          placeholder="请输入联系人"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px;"
        />
        <el-input
          v-model="searchForm.phone"
          placeholder="请输入电话"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px;"
        />
        <el-input
          v-model="searchForm.address"
          placeholder="请输入地址"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px;"
        />
        <el-select
          v-model="searchForm.type"
          placeholder="请选择类型"
          clearable
          style="width: 120px; margin-right: 10px; margin-bottom: 10px;"
        >
          <el-option label="客户" value="1" />
          <el-option label="供应商" value="2" />
        </el-select>
        <el-button type="primary" @click="handleSearch" style="margin-right: 10px; margin-bottom: 10px;">搜索</el-button>
        <el-button @click="resetSearch" style="margin-bottom: 10px;">重置</el-button>
      </div>
      <el-table :data="tableData" height="auto" style="width: 100%; margin-top: 0px; margin-bottom: 0px;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="canDelete" />
        <el-table-column prop="unitid" label="单位编码" width="150" />
        <el-table-column prop="name" label="单位名称" width="180" />
        <el-table-column prop="person" label="联系人" width="100"/>
        <el-table-column prop="phone" label="联系方式" width="180"/>
        <el-table-column prop="address" label="地址" width="200"/>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <span v-if="row.type === '1'" class="type-tag client-tag">客户</span>
            <span v-else class="type-tag supplier-tag">供应商</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
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
    <el-dialog v-model="editDialogVisible" title="编辑单位信息" width="600px">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="auto"
      >
        <el-form-item label="单位编码" prop="unitid">
          <el-input v-model="editForm.unitid" :disabled="true" />
        </el-form-item>
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="联系人" prop="person">
          <el-input v-model="editForm.person" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="editForm.phone" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="editForm.type" placeholder="选择类型">
            <el-option label="客户" value="1" />
            <el-option label="供应商" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditForm(editFormRef)">保存</el-button>
          <el-button @click="cancelEditForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新增表单弹窗 -->
    <el-dialog v-model="addDialogVisible" title="新增单位信息" width="600px">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="auto"
      >
        <el-form-item label="单位编码" prop="unitid">
          <el-input v-model="addForm.unitid" />
        </el-form-item>
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="联系人" prop="person">
          <el-input v-model="addForm.person" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="addForm.phone" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="addForm.type" placeholder="选择类型">
            <el-option label="客户" value="1" />
            <el-option label="供应商" value="2" />
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
import { ref, onMounted } from 'vue';
import { ElButton, ElTable, ElTableColumn, ElMessage, ElMessageBox, ElPagination, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus';
import addIcon from '@/views/basic-info/assets/add.png';
import deleteIcon from '@/views/basic-info/assets/delete.png';
import { getUnitList, updateUnit, deleteUnit } from '@/api/information/unit';

// 分页相关变量
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 批量删除相关变量
const multipleSelection = ref([]);

// 搜索相关变量
const searchForm = ref({
  unitid: '',
  name: '',
  person: '',
  phone: '',
  address: '',
  type: ''
});

// 编辑相关变量
const editDialogVisible = ref(false);
const editFormRef = ref();
const editForm = ref({
  unitid: '',
  name: '',
  person: '',
  phone: '',
  address: '',
  type: 1
});
// 存储原始的单位编码
const originalUnitId = ref('');

// 新增相关变量
const addDialogVisible = ref(false);
const addFormRef = ref();
const addForm = ref({
  unitid: '',
  name: '',
  person: '',
  phone: '',
  address: '',
  type: 1
});

// 表单验证规则
const editFormRules = ref({
  unitid: [
    { required: true, message: '单位编码不能为空', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '单位名称不能为空', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '类型不能为空', trigger: 'change' }
  ],
  phone: [
    { pattern: /^.{0}$|^1[3-9]\d{9}$/, message: '请输入正确的手机号码格式', trigger: 'blur' } // 允许空值，但非空时必须符合格式
  ]
});

// 新增表单验证规则
const addFormRules = ref({
  unitid: [
    { required: true, message: '单位编码不能为空', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '单位名称不能为空', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '类型不能为空', trigger: 'change' }
  ],
  phone: [
    { pattern: /^.{0}$|^1[3-9]\d{9}$/, message: '请输入正确的手机号码格式', trigger: 'blur' } // 允许空值，但非空时必须符合格式
  ]
});

// 编辑处理函数
const handleEdit = (row) => {
  // 保存原始单位编码
  originalUnitId.value = row.unitid;
  console.log('保存原始单位编码:', originalUnitId.value); // 调试日志
  // 填充表单数据
  editForm.value = { ...row };
  console.log('填充表单数据:', editForm.value); // 调试日志
  // 显示编辑对话框
  editDialogVisible.value = true;
};

// 删除处理函数
const handleDelete = async (row) => {
  // 确认删除提示
  try {
    await ElMessageBox.confirm(
      `确定要删除单位 "${row.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    // 调用删除接口，传入单位编码
    const response = await deleteUnit({ unitid: row.unitid });
    
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
      console.error('删除单位失败:', error);
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
        // 使用原始单位编码作为 id 参数，确保即使单位编码字段意外被修改也能正确更新
        const requestData = {
          ...editForm.value,
          id: originalUnitId.value  // 使用原始单位编码作为 id
        };
        
        console.log('发送请求数据:', requestData); // 调试日志
        
        const response = await updateUnit(requestData);
        if (response.code === 200) {
          ElMessage.success('单位信息已更新');
          editDialogVisible.value = false;
          // 重新获取数据
          fetchData();
        } else {
          ElMessage.error(response.msg || '更新失败');
        }
      } catch (error) {
        console.error('更新单位信息失败:', error);
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
    unitid: '',
    name: '',
    person: '',
    phone: '',
    address: '',
    type: 1
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
        // 对于新增操作，也调用updateUnit接口，按照需求要求
        const requestData = {
          ...addForm.value,
          id: addForm.value.unitid  // 使用单位编码作为 id
        };
        
        console.log('发送新增请求数据:', requestData); // 调试日志
        
        const response = await updateUnit(requestData);
        if (response.code === 200) {
          ElMessage.success('单位信息已添加');
          addDialogVisible.value = false;
          // 重新获取数据
          fetchData();
        } else {
          ElMessage.error(response.msg || '添加失败');
        }
      } catch (error) {
        console.error('添加单位信息失败:', error);
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
    
    // 收集要删除的单位编码
    const unitids = multipleSelection.value.map(item => item.unitid);
    
    // 调用批量删除接口
    const response = await deleteUnit({ unitids });
    
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
    unitid: '',
    name: '',
    person: '',
    phone: '',
    address: '',
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
      unitid: searchForm.value.unitid || undefined,
      name: searchForm.value.name || undefined,
      person: searchForm.value.person || undefined,
      phone: searchForm.value.phone || undefined,
      address: searchForm.value.address || undefined,
      type: searchForm.value.type || undefined
    };
    
    const response = await getUnitList(params);
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
      console.error('获取单位列表失败:', response.msg);
      ElMessage.error(response.msg || '获取单位列表失败');
    }
  } catch (error) {
    console.error('获取单位列表失败:', error);
  }
};

// 页面加载时获取单位列表数据
onMounted(async () => {
  fetchData();
});


</script>

<style scoped>
.unit-info-container {
  width: 100%;
  height: 100%;
  padding: 15px;
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

.type-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.client-tag {
  background-color: #ecf5ff;
  color: #409EFF;
  border: 1px solid #b3d8ff;
  height: 15px;
}

.supplier-tag {
  background-color: #f0f9eb;
  color: #67C23A;
  border: 1px solid #c2e7b0;
  height: 15px;
}

.search-bar{
  padding-bottom: 0px;
}

</style>