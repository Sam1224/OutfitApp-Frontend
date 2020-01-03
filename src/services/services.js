/**
 * @Author: Sam
 * @Date: 2020/1/3
 * @Version: 1.0
 **/
import Api from './api'

export default {
  getUsers() {
    return Api().get('/user')
  }
}
