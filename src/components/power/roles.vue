<template>
    <div class="roles">
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 角色列表卡片 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <!--  角色列表数据展示区域-->
            <el-table :data="rolesList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id"
                            :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vertical']">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightsById(scope.row, item1.id)">{{ item1.authName }}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <el-row v-for="(item2, i2) in item1.children" :key="item2.id"
                                    :class="[i2 === 0 ? '' : 'bdtop', 'vertical']">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightsById(scope.row, item2.id)">
                                            {{ item2.authName }}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id"
                                            closable @close="removeRightsById(scope.row, item3.id)">
                                            {{ item2.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- <pre> {{ scope.row }}</pre> -->
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column label="编号" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" v-slot="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit"
                        @click="showEditRolesDialog(scope.row.id)">编辑
                    </el-button>
                    <el-button size="mini" type="danger" icon="el-icon-share" @click="removeRolesInfo(scope.row.id)">删除
                    </el-button>
                    <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">
                        分配权限
                    </el-button>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightdialogVisible" width="50%" @close="setRightDialogClosed">
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defKeys">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRightdialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加角色对话框 -->
        <el-dialog title="添加角色信息" :visible.sync="addRoleDialogVisible" @click="addRoleDialogClosed" width="50%">
            <el-form :model="addRolesForm" :rules="addRolesFormRules" ref="ruleFormRef" label-width="90px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="showRolesDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改角色信息对话框 -->
        <el-dialog title="修改角色信息" :visible.sync="editRolesDialogVisible" @click="editRolesDialogClosed" width="50%">
            <el-form :model="editRolesForm" :rules="editRolesFormRules" ref="ruleFormRef" label-width="90px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRolesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRolesinfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            rolesList: [],
            // 控制分配权限对话框的显示与隐藏
            setRightdialogVisible: false,
            // 所有数据的权限
            rightsList: [],
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            //默认选中的节点Id值
            defKeys: [],
            //控制添加角色对话框的显示与隐藏
            addRoleDialogVisible: false,
            // 添加角色的表单数据
            addRolesForm: {
                roleName: '',
                roleDesc: ''
            },
            // 添加角色的表单验证规则
            addRolesFormRules: {
                roleName: [
                    { required: true, message: '请输入用户角色名称', trigger: 'blur' },
                    { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: '请输入用户角色描述', trigger: 'blur' },
                    { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                ]
            },
            // 修改角色信息对话框的显示与隐藏
            editRolesDialogVisible: false,
            // 查询到的角色信息对象
            editRolesForm: {},
            // 修改表单验证的规则对象
            editRolesFormRules: {
                roleName: [
                    { required: true, message: '请输入用户角色名称', trigger: 'blur' },
                    { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: '请输入用户角色描述', trigger: 'blur' },
                    { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                ]
            },
        };
    },
    created() {
        this.getRolesList()
    },
    methods: {
        // 获取角色列表数据
        async getRolesList() {
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) {
                return this.$message.error("获取角色列表失败")
            }
            this.rolesList = res.data
            // console.log(this.rolesList);

        },
        // 根据Id删除对应的权限
        async removeRightsById(role, rightId) {
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult != 'confirm') {
                return this.$message.info('取消了删除')
            }
            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            // console.log(res);

            if (res.meta.status !== 200) {
                return this.$message.error('删除权限失败')

            }

            // this.getRolesList()
            role.children = res.data;
        },
        // 展示分配权限对话框
        async showSetRightDialog(role) {
            // 获取权限数据
            const { data: res } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200) {
                this.$message.error('获取权限数据失败')
            }
            // 把获取到的权限保存到rightsList中
            this.rightsList = res.data;
            // console.log(this.rightsList);
            // 递归获取三级节点的id
            this.getleafKeys(role, this.defKeys)
            this.setRightdialogVisible = true
        },
        // 监听分配权限对话框的关闭事件
        setRightDialogClosed() {
            this.defKeys = []
        },
        // 通过递归的形式，获取角色下所有三级权限的id ，并保存到defKeys中
        getleafKeys(node, arr) {
            // 如果当前node节点不包含children属性，则是三级节点
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item =>
                this.getleafKeys(item, arr)
            )
        },
        // 展示添加角色对话框
        showRolesDialog() {
            this.$refs.ruleFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post('roles', this.addRolesForm)
                if (res.meta.status !== 201) {
                    return this.$message.error('添加角色失败')
                }
                this.$message.success('添加角色成功！')
                this.addRoleDialogVisible = false
                this.getRolesList()
            })
        },
        // 点击添加角色对话框关闭按钮触发的事件
        addRoleDialogClosed() {
            this.$refs.ruleFormRef.resetFields()
        },
        // 展示修改角色信息对话框
        async showEditRolesDialog(id) {
            const { data: res } = await this.$http.get('roles/' + id, this.addRolesForm)
            if (res.meta.status !== 200) {
                this.$message.error('修改角色信息失败')
            }

            this.editRolesForm = res.data
            console.log(this.editRolesForm);
            console.log(id);
            console.log(res.data);
            this.editRolesDialogVisible = true
        },
        // 发起修改角色信息的请求
        editRolesinfo() {
            this.$refs.ruleFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) return
                // 发起修改用户信息的请求
                const { data: res } = await this.$http.put('roles/' + this.editRolesForm.roleId, {
                    roleName: this.editRolesForm.roleName, roleDesc: this.editRolesForm.roleDesc
                })
                console.log(this.editRolesForm.id);
                console.log(res);
                if (res.meta.status !== 200) {
                    return this.$message.error('修改用户失败')
                }

                this.editRolesDialogVisible = false;
                this.getRolesList()
                this.$message.success('修改用户成功！')
            })
        },
        //  监听修改角色对话框的关闭事件
        editRolesDialogClosed() {
            this.$refs.ruleFormRef.resetFields()
        },
        // 删除用户信息并提交
        async removeRolesInfo(id) {
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
            const { data: res } = await this.$http.delete('roles/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('删除用户失败')
            }
            this.$message.success('删除用户成功')
            this.getRolesList()
        },
    }
};
</script>

<style scoped lang="scss">
.roles {
    width: 100%;
}

.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

.vertical {
    display: flex;
    align-items: center;
}
</style>
