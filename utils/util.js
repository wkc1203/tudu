const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const switchTime = a => {
  console.log('a=',a)
  if (a >= 0 && a <= 6) {
    return "凌晨"
  }
  if (a > 6 && a <= 12) {
    return "上午"
  }
  if (a > 12 && a <= 13) {
    return "中午"
  }
  if (a > 13 && a <= 18) {
    return "下午"
  }
  if (a > 18 && a <= 24) {
    return "晚上"
  }

}

module.exports = {
  formatTime: formatTime,
  switchTime: switchTime
}
