/**
 * 为文件上传提供方法
 */
(function(window, undefined){
/**
 * setting {
 *   url
 *   form_id
 *   submit_id
 *   complete(data<json>)
 * }
 */
function ajax_file_upload(setting){
}
ajax_file_upload.prototype = {
  upload: function(setting){
    // 读取用户设置
    var form_id = setting.form_id;
    var submit_id = setting.submit_id;
    this.complete = setting.complete || this.complete;
    var url = setting.url;
    // 获取表单 并设置表单属性
    this.form = $('#' + form_id);
    this.form.attr('target', this.iframe_id);
    this.form.attr('action', url);
    // 获取提交事件对象
    this.submit = $('#' + submit_id);
    // 用于闭包this
    var closure_this = this;
    // 建立iframe
    this.build_iframe();
    // 绑定iframe载入完成事件
    this.iframe.load(function(){
      var responseText;
      if(this.contentWindow)
      {
         responseText = this.contentWindow.document.body?this.contentWindow.document.body.innerHTML:null;
         
      }else if(this.contentDocument)
      {
         responseText = this.contentDocument.document.body?this.contentDocument.document.body.innerHTML:null;
      } 
      responseText = (responseText == '' ? '[]' : responseText);
      var responseData = JSON.parse(responseText);
      
      // 调用完成回调函数
      closure_this.complete(responseData);
    });
    this.submit.bind('click', function(){
      closure_this.form.trigger('submit');
    });
  },
  build_iframe: function(){
    // 建立一个iframe
    var iframe_html = '<iframe id="' + this.iframe_id + '" name="' + this.iframe_id + '" style="position:absolute; top:-9999px; left:-9999px"';
    if(window.ActiveXObject)
    {
      if(typeof uri== 'boolean'){
        iframe_html += ' src="' + 'javascript:false' + '"';
      }
      else if(typeof uri== 'string'){
        iframe_html += ' src="' + uri + '"';
      } 
    }
    iframe_html += ' />';
    this.iframe = jQuery(iframe_html).appendTo(document.body);
  },
  complete: function(){},
  iframe_id: 'ajax_file_upload_iframe'
}

window.ajax_upload = new ajax_file_upload();

})(window);

