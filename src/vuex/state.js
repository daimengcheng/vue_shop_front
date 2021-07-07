/**
 * 包含n个状态数据属性的对象
 * 
 */
export default {
    menuList: [], //菜单栏列表
    userList: [], //用户列表
    pageSize: 1, //每页显示条数 
    pageNum: 1, //当前页码
    keyWord: '', //关键字查询
    goodsList: [], //商品列表数据
    total: 0,
    queryInfo: {
        query: '', //商品查询参数
        pagenum: 1, //当前商品列表页码
        pagesize: 5, //当前商品列表每页显示条数
    },

}