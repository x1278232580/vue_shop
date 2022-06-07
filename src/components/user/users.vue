<template>
    <div class="users">
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 用户搜索和查询 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userList" stripe border>
                <el-table-column type="index" label="编号" width="80px"></el-table-column>
                <el-table-column prop="username" label="姓名">
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column prop="mobile" label="电话">
                </el-table-column>
                <el-table-column prop="role_name" label="角色">
                </el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                        <!-- {{ scope.row }} -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="{ row }">
                        <!-- {{ row }} -->
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(row.id)">
                        </el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserInfo(row.id)">
                        </el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 4]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
            <!-- 添加用户信息提示框 -->
            <el-dialog title="添加用户信息" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
                <!-- 内容主题区域 -->
                <el-form :model="addForm" :rules="addFormRules" ref="ruleFormRef" label-width="70px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部信息 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改用户信息提示框 -->
            <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" @close="editDialogClosed" width="50%">
                <el-form :model="editForm" :rules="editFormRules" ref="ruleFormRef" label-width="70px">
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="namobileme">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>

</template>

<script>
export default {
    props: {

    },
    data() {
        // 验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (regEmail.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        // 验证手机号的规则
        var checkMobile = (rule, value, cb) => {
            // 验证手机号的正则表达式
            const regMobile = /^(?:(?:\+|00)86)?1\d{10}$/
            if (regMobile.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的手机号'))
        }
        return {
            // 获取用户列表的参数
            queryInfo: {
                query: '',
                // 当前的页数
                pagenum: 1,
                // 当前每页显示多少条数据
                pagesize: 3
            },
            userList: [],
            total: 0,
            // 控制添加用户对话框的显示与隐藏
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加用户的验证规则
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            // 修改用户对话框的显示与隐藏
            editDialogVisible: false,
            // 查询到的用户信息对象
            editForm: {},
            //修改表单的验证规则对象
            editFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        // 获取用户列表信息
        async getUserList() {
            const { data: res } = await this.$http.get('users', { params: this.queryInfo })
            if (res.meta.status != 200) {
                return this.$message.error('获取用户列表失败')
            }
            this.userList = res.data.users
            this.total = res.data.total
            console.log(res);
        },
        // 监听 pageSize  改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize);
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            // console.log(newPage);
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.ruleFormRef.resetFields()
        },
        // 点击按钮添加新用户
        addUser() {
            this.$refs.ruleFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) return
                // 可以发起添加用农户的网络请求
                const { data: res } = await this.$http.post('users', this.addForm)
                if (res.meta.status !== 201) {
                    this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功！')
                this.addDialogVisible = false;
                this.getUserList()
            })
        },
        // 展开修改用户的对话框
        async showEditDialog(id) {
            const { data: res } = await this.$http.get('users/' + id, this.editForm)
            if (res.meta.status !== 200) {
                this.$message.error('修改用户信息失败')
            }
            this.editForm = res.data
            // console.log(id);
            this.editDialogVisible = true
        },
        // 监听修改用户对话框的关闭事件
        editDialogClosed() {
            this.$refs.ruleFormRef.resetFields()
        },
        //发起修改用户信息的请求
        editUserInfo() {
            this.$refs.ruleFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) return
                // 发起修改用户信息的请求
                const { data: res } = await this.$http.put('users/' + this.editForm.id, {
                    email: this.editForm.email, mobile: this.editForm.mobile
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('修改用户失败')
                }

                this.editDialogVisible = false;
                this.getUserList()
                this.$message.success('修改用户成功！')
            })
        },
        // 删除用户信息并提交
        async removeUserInfo(id) {
            const confirmResult = await
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => { return err })
            // 如果用户确认删除，则返回值为字符串 confirm
            // 如果用户取消了删除，则返回值为字符串 cancel
            // console.log(confirmResult);
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            // console.log('确认了删除');
            const { data: res } = await this.$http.delete('users/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('删除用户失败')
            }
            this.$message.success('删除用户成功')
            this.getUserList()
        },
        // 监听 switch 状态事件的改变
        async userStateChanged(userinfo) {
            console.log(userinfo);
            const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if (res.meta.status !== 200) {
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('更新用户状态成功')
        }

    },
    components: {

    },
};
</script>

<style scoped lang="scss">
.users {
    width: 100%;
}
</style>
