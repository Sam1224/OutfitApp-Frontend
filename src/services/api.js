/**
 * @Author: Sam
 * @Date: 2020/1/3
 * @Version: 1.0
 **/
import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'https://outfitapp-sam.herokuapp.com/'
  })
}
