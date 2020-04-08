/**
 * @Author: Sam
 * @Date: 2020/1/3
 * @Version: 1.0
 **/
import Api from './api'

export default {
  getOneUserById(id) {
    return Api().get(`/user/one?type=0&query=${id}`)
  },
  getUsers() {
    return Api().get('/user')
  },
  addUser(user) {
    return Api().post('/user', user, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  updateUser(id, user) {
    return Api().put(`/user/${id}`, user, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  deleteUser(id, user) {
    return Api().delete(`/user/${id}`, {
      data: user,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  getAdmins(token) {
    return Api().get('/admin', {
      headers: {
        token: token,
        'Content-Type': 'application/json'
      }
    })
  },
  getOneAdminById(id, token) {
    return Api().get(`/admin/${id}`, {
      headers: {
        token: token,
        'Content-Type': 'application/json'
      }
    })
  },
  addAdmin(admin) {
    return Api().post('/admin', admin, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  updateAdmin(id, admin) {
    return Api().put(`/admin/${id}`, admin, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  deleteAdmin(id, admin) {
    return Api().delete(`/admin/${id}`, {
      data: admin,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  frontLogin(user) {
    return Api().post('/login', user, {
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
