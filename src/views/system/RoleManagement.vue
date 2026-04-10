<template>
  <div class="role-management-container">
    <div class="info-card">
      <p class="info-title">角色管理表</p>
      <el-button type="primary" class="el-button" @click="showAddForm">
        <img :src="addIcon" alt="" style="width: 16px; height: 16px; margin-right: 5px;" />
        新增用户
      </el-button>
      <el-button type="danger" class="el-button" @click="batchDelete" :disabled="multipleSelection.length === 0" style="margin-left: 30px;">
        <img :src="deleteIcon" alt="" style="width: 16px; height: 16px; margin-right: 5px;" />
        批量删除
        <span v-if="multipleSelection.length > 0" style="margin-left: 5px;">({{ multipleSelection.length }})</span>
      </el-button>
      
      <!-- 搜索栏 -->
      <div class="search-bar" style="margin-left: 15px; display: flex; flex-wrap: nowrap; overflow-x: auto;">
        <el-input
          v-model="searchForm.admin_user"
          placeholder="请输入用户ID"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-input
          v-model="searchForm.name"
          placeholder="请输入用户名"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-input
          v-model="searchForm.username"
          placeholder="请输入用户账号"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-input
          v-model="searchForm.type"
          placeholder="请输入权限类型"
          style="width: 150px; margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;"
        />
        <el-button type="primary" @click="handleSearch" style="margin-right: 10px; margin-bottom: 10px; flex-shrink: 0;">搜索</el-button>
        <el-button @click="resetSearch" style="margin-bottom: 10px; flex-shrink: 0;">重置</el-button>
      </div>
      <el-table :data="tableData" height="auto" style="width: 100%; margin-top: 0px; margin-bottom: 0px;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="canDelete" />
        <el-table-column prop="admin_user" label="用户ID" width="120" />
        <el-table-column prop="name" label="用户名" width="140" />
        <el-table-column prop="username" label="用户账号" width="140" />
        <el-table-column prop="password" label="用户密码" width="140" show-overflow-tooltip />
        <el-table-column prop="userid" label="所属用户" width="100" />
        <el-table-column prop="type" label="权限类型" width="100">
          <template #default="{ row }">
            <span v-if="row.type === 1">管理员</span>
            <span v-else-if="row.type === 2">员工</span>
            <span v-else>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="修改时间" width="180" />
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
    <el-dialog v-model="editDialogVisible" title="编辑用户信息" width="600px">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="auto"
      >
        <el-form-item label="用户ID" prop="admin_user">
          <el-input v-model="editForm.admin_user" :disabled="true" />
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="editForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="权限类型" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择权限类型">
            <el-option label="管理员" value="1" />
            <el-option label="员工" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditForm(editFormRef)">保存</el-button>
          <el-button @click="cancelEditForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新增表单弹窗 -->
    <el-dialog v-model="addDialogVisible" title="新增用户信息" width="600px">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="auto"
      >
        <el-form-item label="用户ID" prop="admin_user">
          <el-input v-model="addForm.admin_user" />
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="权限类型" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择权限类型">
            <el-option label="管理员" value="1" />
            <el-option label="员工" value="2" />
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
import { ref, onMounted, watch } from 'vue';
import { ElButton, ElTable, ElTableColumn, ElMessage, ElMessageBox, ElPagination, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus';
import addIcon from '@/views/basic-info/assets/add.png';
import deleteIcon from '@/views/basic-info/assets/delete.png';
import { getUserList, updateUser, deleteUser } from '@/api/system/role';

// 分页相关变量
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 批量删除相关变量
const multipleSelection = ref([]);

// 搜索相关变量
const searchForm = ref({
  admin_user: '',
  name: '',
  username: '',
  type: ''
});

// 编辑相关变量
const editDialogVisible = ref(false);
const editFormRef = ref();
const editForm = ref({
  admin_user: '',
  name: '',
  username: '',
  password: '',
  type: ''
});

// 存储原始的用户ID
const originalUserId = ref('');

// 新增相关变量
const addDialogVisible = ref(false);
const addFormRef = ref();
const addForm = ref({
  admin_user: '',
  name: '',
  username: '',
  password: '',
  type: ''
});

// 动态错误信息存储
const addFormBackendErrors = ref({});

// 表单验证规则
const editFormRules = ref({
  admin_user: [
    { required: true, message: '用户ID不能为空', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '用户账号不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '用户密码不能为空', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '权限类型不能为空', trigger: 'change' }
  ]
});

// 新增表单验证规则
const baseAddFormRules = {
  admin_user: [
    { required: true, message: '用户ID不能为空', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '用户账号不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '用户密码不能为空', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '权限类型不能为空', trigger: 'change' }
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
  // 重置表单
  addForm.value = {
    admin_user: '',
    name: '',
    username: '',
    password: '',
    type: ''
  };

  if (addFormRef.value) {
    addFormRef.value.clearValidate(); // 清除验证状态
  }

  // 显示新增对话框
  addDialogVisible.value = true;
};

// 编辑处理函数
const handleEdit = async (row) => {
  // 保存原始用户ID
  originalUserId.value = row.admin_user;
  console.log('保存原始用户ID:', originalUserId.value); // 调试日志
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
      `确定要删除用户 "${row.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    // 调用删除接口，按照统一规范使用数组格式传递ID参数
    const response = await deleteUser({ admin_users: [row.admin_user] });

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
      console.error('删除用户失败:', error);
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
        // 使用原始用户ID作为 id 参数，确保即使产品编号字段意外被修改也能正确更新
        const requestData = {
          admin_user: editForm.value.admin_user,
          name: editForm.value.name,
          username: editForm.value.username,
          password: editForm.value.password,
          type: editForm.value.type,
          id: originalUserId.value  // 使用原始用户ID作为 id
        };

        console.log('发送请求数据:', requestData); // 调试日志

        const response = await updateUser(requestData);
        if (response.code === 200) {
          ElMessage.success('用户信息已更新');
          editDialogVisible.value = false;
          // 重新获取数据
          fetchData();
        } else {
          ElMessage.error(response.msg || '更新失败');
        }
      } catch (error) {
        console.error('更新用户信息失败:', error);
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
          admin_user: addForm.value.admin_user,
          name: addForm.value.name,
          username: addForm.value.username,
          password: addForm.value.password,
          type: addForm.value.type
        };

        console.log('发送新增请求数据:', requestData); // 调试日志

        const response = await updateUser(requestData);
        if (response.code === 200) {
          ElMessage.success('用户信息已添加');
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
        console.error('添加用户信息失败:', error);
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

    // 收集要删除的用户ID
    const admin_users = multipleSelection.value.map(item => item.admin_user);

    // 调用批量删除接口
    const response = await deleteUser({ admin_users });

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
    admin_user: '',
    name: '',
    username: '',
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
      admin_user: searchForm.value.admin_user || undefined,
      name: searchForm.value.name || undefined,
      username: searchForm.value.username || undefined,
      type: searchForm.value.type || undefined
    };

    const response = await getUserList(params);
    console.log('API Response:', response); // 调试日志

    if (response.code === 200) {
      // 尝试不同的数据结构
      let dataList = [];
      if (response.data && response.data.list !== undefined && response.data.total !== undefined) {
        // 符合预期的分页数据结构
        dataList = response.data.list || [];
        total.value = response.data.total || 0;
      } else if (Array.isArray(response.data)) {
        // 如果直接返回数组
        dataList = response.data || [];
        total.value = response.data.length || 0;
      } else {
        // 其他情况
        dataList = response.data || [];
        total.value = response.data ? response.data.length || 0 : 0;
      }
      
      // 排序：管理员（type=1）排在前面
      tableData.value = dataList.sort((a, b) => {
        if (a.type === 1 && b.type !== 1) return -1;
        if (a.type !== 1 && b.type === 1) return 1;
        return 0;
      });
    } else {
      console.error('获取用户列表失败:', response.msg);
      ElMessage.error(response.msg || '获取用户列表失败');
    }
  } catch (error) {
    console.error('获取用户列表失败:', error);
  }
};

// 页面加载时获取用户列表数据
onMounted(async () => {
  fetchData();
});
</script>

<style scoped>
.role-management-container {
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

.search-bar{
  padding-bottom: 0px;
}
</style>
