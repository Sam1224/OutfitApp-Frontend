/**
 * @Author: Sam
 * @Date: 2019/12/26
 * @Version: 1.0
 **/
const statusCode = {
  ERR_NOK: -1,
  ERR_OK: 0,
  USER_NL: 1,
  USERNAME_DUP: 2,
  PHONE_DUP: 3,
  EMAIL_DUP: 4,
  USER_NE: 5,
  USER_WP: 6,
  INV_EXT: 7,
  ID: '0',
  USERNAME: '1',
  PHONE: '2',
  EMAIL: '3',
  ACTIVATE: '0',
  UNACTIVATE: '1',
  GITHUB: 'github',
  GITLAB: 'gitlab',
  GITEE: 'gitee',
  BITBUCKET: 'bitbucket',
  WEIBO: 'weibo'
}

module.exports = statusCode
