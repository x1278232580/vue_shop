<template>
    <div class="addgoods">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-alert title="消息提示的文案" type="info" center show-icon>
                    </el-alert>
                </el-col>
            </el-row>
            <el-steps :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <!-- 选择商品分类的级联选择框 -->
                            <el-cascader v-model="addForm.goods_cat" :options="catelist" :props="cateProps"
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">

                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">

                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload class="upload-demo" :action="uploadURL" :on-preview="handlePreview"
                            :on-remove="handleRemove" list-type="picture" :headers="headlerObj"
                            :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">

                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片展示 -->
        <el-dialog title="图片展示" :visible.sync="dialogVisible" width="50%">
            <img :src="previewPath" alt="" class="tupian">
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            activeIndex: "0",
            // 添加商品的表单数据对象
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat: [],
                // 图片数组
                pics: [],

            },
            // 添加表单验证的规则
            addFormRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
                goods_cat: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' },
                ]
            },
            // 商品分类数据
            catelist: [],
            // 级联选择框双向绑定到的数组
            selectedCateKeys: [],
            // 级联选择框的配置对象
            cateProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 上传图片的URL地址
            uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
            headlerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            // 图片预览效果图存放地址
            previewPath: '',
            // 控制监听对话框的显示与隐藏
            dialogVisible: false
        };
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取商品分类数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败！')
            }
            // console.log(res.data);
            // 把数据列表 赋值给商品分类的数据列表  catelist
            this.catelist = res.data
            // console.log(this.catelist);
        },
        // 级联选择框变化会触发这个函数
        handleChange() {
            // console.log(this.addForm.goods_cat);
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
            }

        },
        beforeTabLeave(activeName, oldActiveName) {
            // if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
            //     this.$message.error('请先选择商品分类!')
            //     return false
            // }
        },
        // 处理图片的预览效果
        handlePreview(file) {
            console.log(file);
            this.previewPath = file.response.data.url
            this.dialogVisible = true
        },
        // 处理移除图片的操作
        handleRemove(file) {
            // 1.获取将要删除的图片的临时路径
            const filePath = file.response.data.tmp_path
            // 2.从pics数组中,找到这个图片对应的索引值
            const i = this.addForm.pics.findIndex(x => {
                x.pics === filePath
            })
            // 3.调用数组的splice方法,把图片信息对象,从pics数组中移除
            this.addForm.pics.splice(i, 1)
            console.log(this.addForm);
        },
        // 监听图片上传成功的事件
        handleSuccess(response) {
            console.log(response);
            // 1.拼接得到一个图片信息对象
            const picInfo = { pic: response.data.tmp_path }
            // 2.将图片信息对象,push到 pics数组中
            this.addForm.pics.push(picInfo)
            console.log(this.addForm);
        }
    }
}
</script>

<style scoped lang="scss">
.addgoods {
    width: 100%;
}

.tupian {
    width: 100%;
}
</style>
