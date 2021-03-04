import request from '@/utils/request'
var groupName = 'shopBrand'
export default {
  getByPage(page) { // 分页查询
    return request({
      url: `/${groupName}/getByPage`,
      method: 'post',
      data: page
    })
  },
  save(shopBrand) { // 保存
    return request({
      url: `/${groupName}/save`,
      method: 'post',
      data: shopBrand
    })
  },
  get(id) { // 根据id查询
    return request({
      url: `/${groupName}/get/${id}`,
      method: 'get'
    })
  },
  update(shopBrand) { // 更新
    return request({
      url: `/${groupName}/update`,
      method: 'put',
      data: shopBrand
    })
  },
  getUpdate(id) { // 根据id查询修改回显
    return request({
      url: `/${groupName}/getUpdate/${id}`,
      method: 'get'
    })
  },
  deleteById(id) { // 根据id删除
    return request({
      url: `/${groupName}/delete/${id}`,
      method: 'delete'
    })
  }
}
