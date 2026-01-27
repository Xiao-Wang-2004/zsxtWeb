<template>
  <div class="number-info-container">
    <div class="info-card">
      <p class="info-title">注塑原料库</p>
      <el-button type="primary" class="el-button" @click="showAddForm">
        <img :src="addIcon" alt="" style="width: 16px; height: 16px; margin-right: 5px;" />
        新增原料
      </el-button>
      <el-button type="danger" class="el-button" @click="batchDelete" :disabled="multipleSelection.length === 0" style="margin-left: 30px;">
        <img :src="deleteIcon" alt="" style="width: 16px; height: 16px; margin-right: 5px;" />
        批量删除
        <span v-if="multipleSelection.length > 0" style="margin-left: 5px;">({{ multipleSelection.length }})</span>
      </el-button>
      
      <!-- 搜索栏 -->
      <div class="search-bar" style="margin-left: 15px; display: flex; flex-wrap: nowrap; overflow-x: auto;">
        <el-input
          v-model="searchForm.numberid"
          placeholder="请输入原料编号"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-input
          v-model="searchForm.product_name"
          placeholder="请输入产品名"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-input
          v-model="searchForm.brand_name"
          placeholder="请输入牌号"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-input
          v-model="searchForm.color"
          placeholder="请输入颜色"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-input
          v-model="searchForm.name"
          placeholder="请输入供应商名称"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-input
          v-model="searchForm.inventory"
          placeholder="请输入当前库存(kg)"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-button type="primary" @click="handleSearch" style="margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;">搜索</el-button>
        <el-button @click="resetSearch" style="margin-bottom: 10px; flex-shrink: 0;">重置</el-button>
      </div>
      <el-table :data="tableData" height="auto" style="width: 100%; margin-top: 0px; margin-bottom: 0px;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="canDelete" />
        <el-table-column prop="numberid" label="原料编号" width="150" />
        <el-table-column prop="product_name" label="产品名" width="140" />
        <el-table-column prop="brand_name" label="牌号" width="140" />
        <el-table-column prop="color" label="颜色" width="110" />
        <el-table-column prop="name" label="供应商名称" width="250" />
        <el-table-column prop="inventory" label="当前库存(kg)" width="150"/>
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
    <el-dialog v-model="editDialogVisible" title="编辑原料信息" width="600px">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="auto"
      >
        <el-form-item label="原料编号" prop="numberid">
          <el-input v-model="editForm.numberid" :disabled="true" />
        </el-form-item>
        <el-form-item label="产品名" prop="product_name">
          <el-input v-model="editForm.product_name" />
        </el-form-item>
        <el-form-item label="牌号" prop="brand_name">
          <el-input v-model="editForm.brand_name" />
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-input v-model="editForm.color" />
        </el-form-item>
        <el-form-item label="供应商编号" prop="unitid">
          <el-select v-model="editForm.unitid" placeholder="请选择供应商编号" style="width: 100%">
            <el-option
              v-for="item in supplierOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="当前库存(kg)" prop="inventory">
          <el-input v-model="editForm.inventory" @input="handleInventoryInput($event, 'edit')" @keydown="(event) => {
            if (!/[0-9]/.test(event.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
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
    <el-dialog v-model="addDialogVisible" title="新增原料信息" width="600px">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="auto"
      >
        <el-form-item label="原料编号" prop="numberid">
          <el-input v-model="addForm.numberid" />
        </el-form-item>
        <el-form-item label="产品名" prop="product_name">
          <el-input v-model="addForm.product_name" />
        </el-form-item>
        <el-form-item label="牌号" prop="brand_name">
          <el-input v-model="addForm.brand_name" />
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-input v-model="addForm.color" />
        </el-form-item>
        <el-form-item label="供应商编号" prop="unitid">
          <el-select v-model="addForm.unitid" placeholder="请选择供应商编号" style="width: 100%">
            <el-option
              v-for="item in supplierOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="当前库存(kg)" prop="inventory">
          <el-input v-model="addForm.inventory" @input="handleInventoryInput($event, 'add')" @keydown="(event) => {
            if (!/[0-9]/.test(event.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
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
import { getNumberInfoList, updateNumberInfo, deleteNumberInfo } from '@/api/information/numberInfo';
import { getUnitList } from '@/api/information/unit';

// 分页相关变量
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 供应商下拉框相关变量
const supplierOptions = ref([]);

// 批量删除相关变量
const multipleSelection = ref([]);

// 搜索相关变量
const searchForm = ref({
  numberid: '',
  product_name: '',
  brand_name: '',
  color: '',
  unitid: '',
  inventory: ''
});

// 编辑相关变量
const editDialogVisible = ref(false);
const editFormRef = ref();
const editForm = ref({
  numberid: '',
  product_name: '',
  brand_name: '',
  color: '',
  unitid: '',
  inventory: ''
});

// 存储原始的原料编号
const originalNumberId = ref('');

// 输入处理函数：只允许数字输入
const handleInventoryInput = (event, formRefName) => {
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

  const filteredValue = value.replace(/\D/g, ''); // 移除所有非数字字符
  if(formRefName === 'edit') {
    editForm.value.inventory = filteredValue;
  } else if(formRefName === 'add') {
    addForm.value.inventory = filteredValue;
  }
};

// 新增相关变量
const addDialogVisible = ref(false);
const addFormRef = ref();
const addForm = ref({
  numberid: '',
  product_name: '',
  brand_name: '',
  color: '',
  unitid: '',
  inventory: ''
});

// 动态错误信息存储
const addFormBackendErrors = ref({
  unitid: ''
});

// 表单验证规则
const editFormRules = ref({
  numberid: [
    { required: true, message: '原料编号不能为空', trigger: 'blur' }
  ],
  product_name: [
    { required: true, message: '产品名不能为空', trigger: 'blur' }
  ],
  brand_name: [
    { required: true, message: '牌号不能为空', trigger: 'blur' }
  ],
  color: [
    { required: true, message: '颜色不能为空', trigger: 'blur' }
  ],
  unitid: [
    { required: true, message: '供应商编号不能为空', trigger: 'blur' }
  ],
  inventory: [
    { required: true, message: '当前库存不能为空', trigger: 'blur' },
    { pattern: /^\d+$/, message: '当前库存必须为数字', trigger: 'blur' }
  ]
});

// 新增表单验证规则
const baseAddFormRules = {
  numberid: [
    { required: true, message: '原料编号不能为空', trigger: 'blur' }
  ],
  product_name: [
    { required: true, message: '产品名不能为空', trigger: 'blur' }
  ],
  brand_name: [
    { required: true, message: '牌号不能为空', trigger: 'blur' }
  ],
  color: [
    { required: true, message: '颜色不能为空', trigger: 'blur' }
  ],
  unitid: [
    { required: true, message: '供应商编号不能为空', trigger: 'blur' }
  ],
  inventory: [
    { required: true, message: '当前库存不能为空', trigger: 'blur' },
    { pattern: /^\d+$/, message: '当前库存必须为数字', trigger: 'blur' }
  ]
};

// 创建响应式的表单规则
const addFormRules = ref({ ...baseAddFormRules });

// 监听后端错误信息变化，动态更新验证规则
watch(() => addFormBackendErrors.value.unitid, (newValue) => {
  if (newValue) {
    // 添加后端错误信息到验证规则
    addFormRules.value.unitid = [
      { required: true, message: '供应商编号不能为空', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          callback(new Error(newValue));
        },
        trigger: 'manual'
      }
    ];
  } else {
    // 恢复基础验证规则
    addFormRules.value.unitid = [
      { required: true, message: '供应商编号不能为空', trigger: 'blur' }
    ];
  }
}, { immediate: true });

// 编辑处理函数
const handleEdit = async (row) => {
  // 保存原始原料编号
  originalNumberId.value = row.numberid;
  console.log('保存原始原料编号:', originalNumberId.value); // 调试日志
  // 填充表单数据
  editForm.value = { ...row };
  // 如果后端返回的是unitid字段，则将其映射到unitid字段
  if (row.unitid !== undefined) {
    editForm.value.unitid = row.unitid;
  }
  console.log('填充表单数据:', editForm.value); // 调试日志
  
  // 获取供应商列表
  await fetchSupplierList();
  
  // 显示编辑对话框
  editDialogVisible.value = true;
};

// 删除处理函数
const handleDelete = async (row) => {
  // 确认删除提示
  try {
    await ElMessageBox.confirm(
      `确定要删除原料 "${row.product_name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    // 调用删除接口，按照统一规范使用数组格式传递ID参数
    const response = await deleteNumberInfo({ numberids: [row.numberid] });

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
      console.error('删除原料失败:', error);
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
        // 使用原始原料编号作为 id 参数，确保即使原料编号字段意外被修改也能正确更新
        const requestData = {
          numberid: editForm.value.numberid,
          product_name: editForm.value.product_name,
          brand_name: editForm.value.brand_name,
          color: editForm.value.color,
          unitid: editForm.value.unitid, // 使用unitid字段
          inventory: editForm.value.inventory,
          id: originalNumberId.value  // 使用原始原料编号作为 id
        };

        console.log('发送请求数据:', requestData); // 调试日志

        const response = await updateNumberInfo(requestData);
        if (response.code === 200) {
          ElMessage.success('原料信息已更新');
          editDialogVisible.value = false;
          // 重新获取数据
          fetchData();
        } else {
          ElMessage.error(response.msg || '更新失败');
        }
      } catch (error) {
        console.error('更新原料信息失败:', error);
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
const showAddForm = async () => {
  // 重置表单
  addForm.value = {
    numberid: '',
    product_name: '',
    brand_name: '',
    color: '',
    unitid: '',
    inventory: ''
  };

  if (addFormRef.value) {
    addFormRef.value.clearValidate(); // 清除验证状态
  }

  // 获取供应商列表
  await fetchSupplierList();
  
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
          numberid: addForm.value.numberid,
          product_name: addForm.value.product_name,
          brand_name: addForm.value.brand_name,
          color: addForm.value.color,
          unitid: addForm.value.unitid, // 使用unitid字段
          inventory: addForm.value.inventory
        };

        console.log('发送新增请求数据:', requestData); // 调试日志

        const response = await updateNumberInfo(requestData);
        if (response.code === 200) {
          ElMessage.success('原料信息已添加');
          addDialogVisible.value = false;
          // 重置表单验证状态和错误信息
          addFormBackendErrors.value.unitid = '';
          if (addFormRef.value) {
            addFormRef.value.clearValidate();
          }
          // 重新获取数据
          fetchData();
        } else {
          // 如果是"无当前供应商信息"错误，显示在表单验证中
          if (response.msg && response.msg.includes('无当前供应商信息')) {
            addFormBackendErrors.value.unitid = '无当前供应商信息';

            // 触发表单验证以显示错误
            setTimeout(() => {
              if (addFormRef.value) {
                addFormRef.value.validateField('unitid');
              }
            }, 0);
          }

          ElMessage.error(response.msg || '添加失败');
        }
      } catch (error) {
        console.error('添加原料信息失败:', error);
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
  addFormBackendErrors.value.unitid = '';
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

    // 收集要删除的原料编号
    const numberids = multipleSelection.value.map(item => item.numberid);

    // 调用批量删除接口
    const response = await deleteNumberInfo({ numberids });

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
    numberid: '',
    product_name: '',
    brand_name: '',
    color: '',
    unitid: '',
    inventory: ''
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
      numberid: searchForm.value.numberid || undefined,
      product_name: searchForm.value.product_name || undefined,
      brand_name: searchForm.value.brand_name || undefined,
      color: searchForm.value.color || undefined,
      name: searchForm.value.name || undefined,  // 使用name字段用于搜索
      inventory: searchForm.value.inventory ? parseInt(searchForm.value.inventory) || undefined : undefined
    };

    const response = await getNumberInfoList(params);
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
      console.error('获取原料列表失败:', response.msg);
      ElMessage.error(response.msg || '获取原料列表失败');
    }
  } catch (error) {
    console.error('获取原料列表失败:', error);
  }
};

// 获取供应商列表
const fetchSupplierList = async () => {
  try {
    const params = {
      type: 2  // 获取类型为2的供应商
    };
    const response = await getUnitList(params);
    
    if (response.code === 200) {
      // 过滤出type为2的供应商，并提取unitid作为选项
      supplierOptions.value = response.data && response.data.list 
        ? response.data.list.filter(item => item.type === '2').map(item => ({
            value: item.unitid,
            label: item.unitid
          }))
        : [];
    } else {
      console.error('获取供应商列表失败:', response.msg);
      ElMessage.error(response.msg || '获取供应商列表失败');
    }
  } catch (error) {
    console.error('获取供应商列表失败:', error);
    ElMessage.error('获取供应商列表失败，请稍后重试');
  }
};

// 页面加载时获取原料列表数据
onMounted(async () => {
  await fetchData();
  // 获取供应商列表
  await fetchSupplierList();
});
</script>

<style scoped>
.number-info-container {
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