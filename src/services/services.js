/**
 * @Author: Sam
 * @Date: 2020/1/3
 * @Version: 1.0
 **/
import Api from './api'

export default {
  getUsers() {
    return Api().get('/user')
  },
  deleteUser(id, user) {
    return Api().delete(`/user/${id}`, {
      data: user,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  backLogin(admin) {
    return Api().post('/admin/login', admin, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  getAdminToken(username) {
    return Api().get(`/admin/token/${username}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
