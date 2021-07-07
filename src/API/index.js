import ajax from './ajax'

// 发起登录请求
export const reqLogin = (username, password) => ajax.post('/login', { username, password })

// 请求左侧菜单栏列表
export const reqMenuList = () => ajax('/menus')

// 获取用户列表
export const reqUserList = (pagenum, pagesize, query) => ajax('/users', { params: { pagenum, pagesize, query } })

// 修改用户状态
export const reqUpdateState = (uId, type) => ajax.put(`/users/${uId}/state/${type}`)

// 添加用户
export const reqAddUser = ({ username, password, email, mobile }) => ajax.post('/users', { username, password, email, mobile })

// 修改用户信息
export const reqUpdateUser = (id, { mobile, email }) => ajax.put(`/users/${id}`, { mobile, email })

// 根据id查询用户信息
export const reqQueryInfo = (id) => ajax(`/users/${id}`)

// 删除单个用户
export const reqDeleteUser = (id) => ajax.delete(`/users/${id}`)

// 获取所有权限列表
export const reqRightsList = (type) => ajax(`/rights/${type}`)

// 获取角色列表
export const reqRolesList = () => ajax('/roles')

// 分配角色
export const reqAllocationRole = (id, rid) => ajax.put(`/users/${id}/role`, { rid })

// 删除角色指定权限
export const reqRemoveRight = (roleId, rightId) => ajax.delete(`/roles/${roleId}/rights/${rightId}`)

// 分配权限
export const reqApportionRight = (roleId, rids) => ajax.post(`/roles/${roleId}/rights`, { rids })

// 添加角色
export const reqAddRoles = (roleName, roleDesc) => ajax.post('/roles', { roleName, roleDesc })

// 删除角色
export const reqDeleteRoles = (id) => ajax.delete(`/roles/${id}`)

// 编辑角色信息
export const reqUpdateRoles = (id, { roleName, roleDesc }) => ajax.put(`roles/${id}`, { roleName, roleDesc })

// 获取商品分类列表
export const reqCategoryList = ({ type, pagenum, pagesize }) => ajax('/categories', { params: { type, pagenum, pagesize } })

// 添加商品分类
export const reqAddCategory = ({ cat_name, cat_pid, cat_level }) => ajax.post('/categories', { cat_name, cat_pid, cat_level })

// 删除商品分类
export const reqDeleteCategory = (id) => ajax.delete(`/categories/${id}`)

// 获取分类参数列表
export const reqParamsList = (id, sel) => ajax(`/categories/${id}/attributes`, { params: { sel } })

// 删除参数
export const reqDelateParams = (id, attrid) => ajax.delete(`/categories/${id}/attributes/${attrid}`)

//添加动态参数或者静态属性
export const reqAddParams = (id, { attr_name, attr_sel, attr_vals }) => ajax.post(`/categories/${id}/attributes`, { attr_name, attr_sel, attr_vals })

//  编辑提交参数
export const reqEditParams = (id, attrId, attr_name, attr_sel, attr_vals) => ajax.put(`/categories/${id}/attributes/${attrId}`, { attr_name, attr_sel, attr_vals })

// 获取商品列表
export const reqGoodsList = ({ query, pagenum, pagesize }) => ajax('/goods', { params: { query, pagenum, pagesize } })

// 删除商品
export const reqDeleteGoods = (id) => ajax.delete(`/goods/${id}`)

// 编辑商品信息
export const reqEditGoods = (id, { goods_name, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs }) => ajax.put(`/goods/${id}`, { goods_name, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs })

// 获取订单数据列表
export const reqOrderList = ({ query, pagenum, pagesize, user_id, pay_status, is_send, order_fapiao_title, order_fapiao_company, order_fapiao_content, consignee_addr }) => ajax('/orders', { params: { query, pagenum, pagesize, user_id, pay_status, is_send, order_fapiao_title, order_fapiao_company, order_fapiao_content, consignee_addr } })

// 查看物流信息
export const reqLookLogisticsInfo = (id) => ajax(`/kuaidi/${id}`)

// 基于时间统计的折线图
export const reqReports = () => ajax('/reports/type/1')