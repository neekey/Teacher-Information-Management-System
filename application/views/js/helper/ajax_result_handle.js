(function(window, undefined){
function ajax_handle(){
}
ajax_handle.prototype = {
  error: function(args){
    var str;
    switch(args.textStatus){
      case 'timeout':
        str = '链接超时，请稍后重试！';
        break;
      case 'error':
        str = '数据请求出错，请稍后重试！';
        break;
      case 'abort':
        str = '与服务器的链接被中断，请稍后重试！';
        break;
      case 'parsererror':
        str = '数据解析出错，请稍后重试！';
        break;
      default:
        str = '出现未知错误，请刷新页面，或者稍后重试！';
    }
    return str;
  },
  success: function(args){
    var result;
    if(args.data.result == false){
      if(args.data.data.error == null){
        result = '出现未知错误，请刷新页面，或者稍后重试！';
      }
      result = args.data.data.error;
    }
    else {
      result = true;
    }
    return result;
  }
}

window.ajax_helper = new ajax_handle();
})(window)
