export function formatDate(date, fmt) {
  var y = date.getFullYear()
  var M = date.getMonth() + 1
  var d = date.getDate()
  var h = date.getHours()
  var m = date.getMinutes()
  var s = date.getSeconds()
  return y + '-' + padLeftZero(M) + '-' + padLeftZero(d) + ' ' + padLeftZero(h) + ':' + padLeftZero(m) + ':' + padLeftZero(s)
}

function padLeftZero(str) {
  return str < 10 ? '0' + str : str
}
