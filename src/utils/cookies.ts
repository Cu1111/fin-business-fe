function getCookie(name) {
  // 将document.cookie字符串按照; 分割成数组
  const cookies = document.cookie.split(';');
  // 修剪字符串两侧的空格
  name = name + '=';
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // 检查当前cookie是否是目标cookie
    if (cookie.indexOf(name) == 0)
      return cookie.substring(name.length, cookie.length);
  }
  return ''; // 如果没有找到，返回空字符串
}

function setCookie(c_name, value, expiredays) {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie =
    c_name +
    '=' +
    escape(value) +
    (expiredays == null ? '' : ';expires=' + exdate.toString());
}

export { getCookie, setCookie };
