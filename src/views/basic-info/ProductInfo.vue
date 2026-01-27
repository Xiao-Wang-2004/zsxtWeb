<template>
  <div class="product-info-container">
    <div class="info-card">
      <p class="info-title">产品信息表</p>
      <el-button type="primary" class="el-button" @click="showAddForm">
        <img :src="addIcon" alt="" style="width: 16px; height: 16px; margin-right: 5px;" />
        新增产品
      </el-button>
      <el-button type="danger" class="el-button" @click="batchDelete" :disabled="multipleSelection.length === 0" style="margin-left: 30px;">
        <img :src="deleteIcon" alt="" style="width: 16px; height: 16px; margin-right: 5px;" />
        批量删除
        <span v-if="multipleSelection.length > 0" style="margin-left: 5px;">({{ multipleSelection.length }})</span>
      </el-button>
      
      <!-- 搜索栏 -->
      <div class="search-bar" style="margin-left: 15px; display: flex; flex-wrap: nowrap; overflow-x: auto;">
        <el-input
          v-model="searchForm.productid"
          placeholder="请输入产品编码"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-input
          v-model="searchForm.name"
          placeholder="请输入产品名称"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-input
          v-model="searchForm.model"
          placeholder="请输入规格型号"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-input
          v-model="searchForm.moldid"
          placeholder="请输入关联模具"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-input
          v-model="searchForm.quantity"
          placeholder="请输入单重(g)"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-button type="primary" @click="handleSearch" style="margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;">搜索</el-button>
        <el-button @click="resetSearch" style="margin-bottom: 10px; flex-shrink: 0;">重置</el-button>
      </div>
      <el-table :data="tableData" height="auto" style="width: 100%; margin-top: 0px; margin-bottom: 0px;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="canDelete" />
        <el-table-column prop="productid" label="产品编码" width="150" />
        <el-table-column prop="name" label="产品名称" width="140" />
        <el-table-column prop="model" label="规格型号" width="140" />
        <el-table-column prop="moldid" label="关联模具" width="140" />
        <el-table-column prop="quantity" label="单重(g)" width="140" />
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
    <el-dialog v-model="editDialogVisible" title="编辑产品信息" width="600px">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="auto"
      >
        <el-form-item label="产品编码" prop="productid">
          <el-input v-model="editForm.productid" :disabled="true" />
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="规格型号" prop="model">
          <el-input v-model="editForm.model" />
        </el-form-item>
        <el-form-item label="关联模具" prop="moldid">
          <el-select v-model="editForm.moldid" placeholder="请选择关联模具">
            <el-option
              v-for="mold in moldOptions"
              :key="mold.moldid"
              :label="mold.moldname"
              :value="mold.moldid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单重(g)" prop="quantity">
          <el-input v-model="editForm.quantity" @input="handleQuantityInput($event, 'edit')" @keydown="(event) => {
            if (!/[0-9.]/.test(event.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
              event.preventDefault();
            }
          }" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditForm(editFormRef)">保存</el-button>
          <el-button @click="cancelEditForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新增表单弹窗 -->
    <el-dialog v-model="addDialogVisible" title="新增产品信息" width="600px">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="auto"
      >
        <el-form-item label="产品编码" prop="productid">
          <el-input v-model="addForm.productid" />
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="规格型号" prop="model">
          <el-input v-model="addForm.model" />
        </el-form-item>
        <el-form-item label="关联模具" prop="moldid">
          <el-select v-model="addForm.moldid" placeholder="请选择关联模具">
            <el-option
              v-for="mold in moldOptions"
              :key="mold.moldid"
              :label="mold.moldname"
              :value="mold.moldid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单重(g)" prop="quantity">
          <el-input v-model="addForm.quantity" @input="handleQuantityInput($event, 'add')" @keydown="(event) => {
            if (!/[0-9.]/.test(event.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
              event.preventDefault();
            }
          }" />
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
import { ref, onMounted, watch, nextTick } from 'vue';
import { ElButton, ElTable, ElTableColumn, ElMessage, ElMessageBox, ElPagination, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus';
import addIcon from '@/views/basic-info/assets/add.png';
import deleteIcon from '@/views/basic-info/assets/delete.png';
import { getProductInfoList, updateProductInfo, deleteProductInfo } from '@/api/information/product';
import { getMoldList } from '@/api/information/mold';

// 分页相关变量
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 模具选项
const moldOptions = ref([]);

// 批量删除相关变量
const multipleSelection = ref([]);

// 搜索相关变量
const searchForm = ref({
  productid: '',
  name: '',
  model: '',
  moldid: '',
  quantity: ''
});

// 编辑相关变量
const editDialogVisible = ref(false);
const editFormRef = ref();
const editForm = ref({
  productid: '',
  name: '',
  model: '',
  moldid: '',
  quantity: ''
});

// 存储原始的产品编号
const originalProductId = ref('');

// 输入处理函数：只允许数字和小数点输入（用于单重）
const handleQuantityInput = (event, formRefName) => {
  let value;
  if (event instanceof Event) {
    // 如果是事件对象，从target获取值
    value = event.target.value;
  } else if (typeof event === 'string') {
    // 如果直接传入字符串值
    value = event;
  } else if (event && typeof event === 'object' && 'target' in event) {
    // 如果是事件对象但不是Event实例
    value = event.target.value;
  } else {
    value = String(event);
  }

  // 允许数字和一个小数点
  const filteredValue = value.replace(/[^\d.]/g, ''); // 移除非数字和非小数点字符
  // 确保最多只有一个句点
  const parts = filteredValue.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  } else {
    value = filteredValue;
  }
  
  if(formRefName === 'edit') {
    editForm.value.quantity = value;
  } else if(formRefName === 'add') {
    addForm.value.quantity = value;
  }
};

// 新增相关变量
const addDialogVisible = ref(false);
const addFormRef = ref();
const addForm = ref({
  productid: '',
  name: '',
  model: '',
  moldid: '',
  quantity: ''
});

// 动态错误信息存储
const addFormBackendErrors = ref({});

// 根据模具ID获取模具名称
const getMoldNameById = (moldId) => {
  if (!moldOptions.value || moldOptions.value.length === 0) {
    return moldId || '未知模具'; // 如果模具选项还未加载，返回ID或默认文本
  }
  const mold = moldOptions.value.find(m => m.moldid === moldId);
  return mold ? mold.moldname : (moldId || '未找到模具');
};

// 表单验证规则
const editFormRules = ref({
  productid: [
    { required: true, message: '产品编码不能为空', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '产品名称不能为空', trigger: 'blur' }
  ],
  moldid: [
    { required: true, message: '关联模具不能为空', trigger: 'change' }
  ]
});

// 新增表单验证规则
const baseAddFormRules = {
  productid: [
    { required: true, message: '产品编码不能为空', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '产品名称不能为空', trigger: 'blur' }
  ],
  moldid: [
    { required: true, message: '关联模具不能为空', trigger: 'change' }
  ]
};

// 创建响应式的表单规则
const addFormRules = ref({ ...baseAddFormRules });

// 监听后端错误信息变化，动态更新验证规则
watch(() => addFormBackendErrors.value, (newValue) => {
  // 对于新增表单，目前没有特别的后端验证错误需要处理
}, { immediate: true });

// 显示新增表单
const showAddForm = async () => {
  // 加载模具列表
  await fetchMoldList();
  
  // 重置表单
  addForm.value = {
    productid: '',
    name: '',
    model: '',
    moldid: '',
    quantity: ''
  };

  if (addFormRef.value) {
    addFormRef.value.clearValidate(); // 清除验证状态
  }

  // 显示新增对话框
  addDialogVisible.value = true;
};

// 编辑处理函数
const handleEdit = async (row) => {
  // 加载模具列表
  await fetchMoldList();
  
  // 保存原始产品编号
  originalProductId.value = row.productid;
  console.log('保存原始产品编号:', originalProductId.value); // 调试日志
  // 填充表单数据
  editForm.value = { ...row };
  // 显示编辑对话框
  editDialogVisible.value = true;
};

// 删除处理函数
const handleDelete = async (row) => {
  // 确认删除提示
  try {
    await ElMessageBox.confirm(
      `确定要删除产品 "${row.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    // 调用删除接口，按照统一规范使用数组格式传递ID参数
    const response = await deleteProductInfo({ productids: [row.productid] });

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
      console.error('删除产品失败:', error);
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
        // 使用原始产品编号作为 id 参数，确保即使产品编号字段意外被修改也能正确更新
        const requestData = {
          productid: editForm.value.productid,
          name: editForm.value.name,
          model: editForm.value.model,
          moldid: editForm.value.moldid,
          quantity: editForm.value.quantity,
          id: originalProductId.value  // 使用原始产品编号作为 id
        };

        console.log('发送请求数据:', requestData); // 调试日志

        const response = await updateProductInfo(requestData);
        if (response.code === 200) {
          ElMessage.success('产品信息已更新');
          editDialogVisible.value = false;
          // 重新获取数据
          fetchData();
        } else {
          ElMessage.error(response.msg || '更新失败');
        }
      } catch (error) {
        console.error('更新产品信息失败:', error);
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

// 提交新增表单
const submitAddForm = async (formEl) => {
  if (!formEl) return;

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        // 只传递指定的字段
        const requestData = {
          productid: addForm.value.productid,
          name: addForm.value.name,
          model: addForm.value.model,
          moldid: addForm.value.moldid,
          quantity: addForm.value.quantity
        };

        console.log('发送新增请求数据:', requestData); // 调试日志

        const response = await updateProductInfo(requestData);
        if (response.code === 200) {
          ElMessage.success('产品信息已添加');
          addDialogVisible.value = false;
          // 重置表单验证状态和错误信息
          if (addFormRef.value) {
            addFormRef.value.clearValidate();
          }
          // 重新获取数据
          fetchData();
        } else {
          ElMessage.error(response.msg || '添加失败');
        }
      } catch (error) {
        console.error('添加产品信息失败:', error);
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
  // 清除后端错误信息
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

    // 收集要删除的产品编号
    const productids = multipleSelection.value.map(item => item.productid);

    // 调用批量删除接口
    const response = await deleteProductInfo({ productids });

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
    productid: '',
    name: '',
    model: '',
    moldid: '',
    quantity: ''
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

// 获取模具列表
const fetchMoldList = async () => {
  try {
    const params = {
      page: 1,
      size: 1000 // 获取所有模具
    };
    
    const response = await getMoldList(params);
    console.log('获取模具列表响应:', response); // 调试日志

    if (response.code === 200) {
      if (response.data && response.data.list !== undefined) {
        moldOptions.value = response.data.list || [];
      } else if (Array.isArray(response.data)) {
        moldOptions.value = response.data || [];
      } else {
        moldOptions.value = response.data || [];
      }
      console.log('模具选项已加载:', moldOptions.value); // 调试日志
    } else {
      console.error('获取模具列表失败:', response.msg);
      ElMessage.error(response.msg || '获取模具列表失败');
    }
  } catch (error) {
    console.error('获取模具列表失败:', error);
    ElMessage.error('获取模具列表失败');
  }
};

// 获取数据函数
const fetchData = async () => {
  try {
    // 将搜索条件加入请求参数
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      productid: searchForm.value.productid || undefined,
      name: searchForm.value.name || undefined,
      model: searchForm.value.model || undefined,
      moldid: searchForm.value.moldid || undefined,
      quantity: searchForm.value.quantity ? parseFloat(searchForm.value.quantity) || undefined : undefined
    };

    const response = await getProductInfoList(params);
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
      console.error('获取产品列表失败:', response.msg);
      ElMessage.error(response.msg || '获取产品列表失败');
    }
  } catch (error) {
    console.error('获取产品列表失败:', error);
  }
};

// 页面加载时获取产品列表数据
onMounted(async () => {
  fetchData();
});
</script>

<style scoped>
.product-info-container {
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

.type-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.running-tag {
  background-color: #f0f9eb;
  color: #67C23A;
  border: 1px solid #c2e7b0;
  height: 15px;
}

.standby-tag {
  background-color: #fdf6ec;
  color: #E6A23C;
  border: 1px solid #f3d19d;
  height: 15px;
}

.search-bar{
  padding-bottom: 0px;
}
</style>