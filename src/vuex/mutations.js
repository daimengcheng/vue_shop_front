/**
 * 包含n个直接改变state状态数据的方法
 * 
 */
import { REVEVIC_MENU_LIST, REVEVIC_USER, CHANGE_PAGE_NUM, CHANGE_PAGE_SIZE, CHANGE_MG_STATE, CHANGE_QUERYKEYWORD, REVEVIC_GOODS_LIST } from './mutation-type'
export default {

    [REVEVIC_MENU_LIST](state, menuList) {
        state.menuList = menuList
    },
    [REVEVIC_USER](state, userList) {
        state.userList = userList
    },
    [CHANGE_PAGE_NUM](state, newPageNum) {
        state.pageNum = newPageNum
    },
    [CHANGE_PAGE_SIZE](state, newPageSize) {
        state.pageSize = newPageSize
    },
    [CHANGE_MG_STATE](state, newMgState) {
        state.userList.users.mg_state = newMgState
    },
    [CHANGE_QUERYKEYWORD](state, keyWord) {
        state.keyWord = keyWord
    },
    [REVEVIC_GOODS_LIST](state, data) {
        state.goodsList = data.goods
        state.total = data.total
    },
    changePageSize(state, newPageSize) {
        state.queryInfo.pagesize = newPageSize
    },
    changePageNum(state, newPageNum) {
        state.queryInfo.pagenum = newPageNum
    },

}