import { reqMenuList, reqUserList, reqGoodsList } from "../API/index";
import { REVEVIC_MENU_LIST, REVEVIC_USER, REVEVIC_GOODS_LIST } from './mutation-type'
/**
 * 包含n个用于间接改变状态数据的方法
 * 
 */
export default {

    // 获取菜单栏列表
    async getMenuList({ commit }) {
        const result = await reqMenuList()
        if (result.meta.status === 200) {
            const menuList = result.data
            commit(REVEVIC_MENU_LIST, menuList)
        }
    },

    // 获取用户列表
    async getUserList({ commit, state }) {
        const { pageNum, pageSize, keyWord } = state
        const userList = await reqUserList(pageNum, pageSize, keyWord)
        commit(REVEVIC_USER, userList.data)
    },
    // 获取商品列表
    async getGoodsList({ commit, state }) {
        // const {query,pagenum,pagesize} = state.queryInfo
        const result = await reqGoodsList(state.queryInfo)
        commit(REVEVIC_GOODS_LIST, result.data)
    }
}