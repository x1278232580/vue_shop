<template>
    <div class="goods">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图区域 -->
        <el-card>
            <!-- 商品列表搜索 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" @close="getGoodsList" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 商品列表区域 -->
            <el-table :data="goodsList" stripe border>
                <el-table-column type="index" label="编号" width="80px"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称">
                </el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)">
                </el-table-column>
                <el-table-column prop="goods_weight" label="商品重量">
                </el-table-column>
                <el-table-column prop="add_time" label="创建时间">
                    <template v-slot="scope">
                        {{ scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="{ row }">
                        <!-- {{ row }} -->
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini">
                        </el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 4]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
    props: {

    },
    data() {
        return {
            queryInfo: {
                // 查询参数
                query: '',
                // 当前的页数
                pagenum: 1,
                // 每页显示多少条数据
                pagesize: 5
            },
            // 商品列表数据
            goodsList: [],
            // 初始总数据条数
            total: 0,
        };
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        //
        async getGoodsList() {
            const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败！')
            }
            this.goodsList = res.data.goods
            this.total = res.data.total
            // console.log(res.data)
        },
        // 监听 pageSize  改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize);
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            // console.log(newPage);
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        // 
        goAddPage() {
            this.$router.push('goods/addgoods')
        }
    },
    components: {
    },
};
</script>

<style scoped lang="scss">
.goods {
    width: 100%;
}
</style>
