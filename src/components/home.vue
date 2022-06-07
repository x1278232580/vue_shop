
<template>

    <el-container class="home_container">
        <!-- 头部信息 -->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button @click="logout">退出</el-button>
        </el-header>
        <!-- 下边的侧边栏和主页面内容 -->
        <el-container>
            <!-- 侧边导航栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" style=" background-color: rgb(85 90 106)" @click="toggeleCollapse">
                    |&nbsp;|&nbsp;|
                </div>
                <el-menu background-color="#545455" text-color="#fff" active-text-color="#409EFF" unique-opened
                    :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="(item, index) in menulist" :key="item.id">
                        <template slot="title">
                            <i :class="iconlist[item.id]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + ite.path" v-for="(ite, index) in item.children" :key="ite.id"
                            @click="saveNavState('/' + ite.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ ite.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 路由占位符 -->
            <router-view></router-view>
            <el-main>

            </el-main>
        </el-container>
    </el-container>



</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            menulist: [],
            iconlist: {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao',
            },
            isCollapse: false,
            // 被激活的动态地址
            activePath: ''
        };
    },
    created() {
        this.getMenuList(),
            this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        // 获取所有的菜单
        async getMenuList() {
            const { data: res } = await this.$http.get('menus')
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            this.menulist = res.data
            // console.log(res);
        },
        // 点击按钮 切换菜单的折叠与展开
        toggeleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        // 保存连接激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath),
                this.activePath = activePath
        }

    },
    components: {

    },
};
</script>

<style scoped lang="scss">
.home_container {
    height: 100%;
}

.el-header {
    background-color: #474748;
    color: #fff;
    text-align: center;
    line-height: 60px;
    display: flex;
    justify-content: space-between;

    div {
        display: flex;
        justify-content: flex-start;

        span {
            font-size: 24px;
            margin-left: 20px;
        }
    }

    .el-button {
        height: 40px;
        margin: 10px 0;
    }

}

.el-aside {
    background-color: #545455;
    color: #fff;
    text-align: center;
    line-height: 24px;

    .el-menu-item {
        padding: 0 10px;
    }

    .el-menu {
        border-right: none;
    }

    .togggle-button {
        font-size: 10px;
        height: 24px;
        line-height: 24px;
        color: #fff;
        cursor: pointer;


    }
}

.el-main {
    background-color: #fff;
    color: #333;
    text-align: center;
    line-height: 160px;
}

body>.el-container {
    margin-bottom: 40px;

}

.iconfont {
    width: 16px;
    height: 16px;
    margin: 0 10px;
}
</style>
