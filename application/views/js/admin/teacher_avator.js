// ========================================
// 创建视图
// ========================================
var v_upload = nyJS.view.create({
  contructor: function(){
    
  },
  prototype: {
    upload: $('#img_upload'),
    preview: $('#preview img'),
    avator_temp: $('#avator_temp img'),
    avator: $('#avator img'),
    form: $('#avator_upload_form'),
    crop: $('#avator_crop'),
    Jcrop_api: null,
    set_url: function(img_name, url){
      this[img_name].attr('src', url);
    },
    reset: function(){
      this.crop.hide();
      this.set_url('preview', '');
      this.set_url('avator_temp', '');
      this.form[0].reset();
      this.form.show();
      if(this.Jcrop_api !== null) {
        this.Jcrop_api.destroy();
      }
      
    },
    /**
     * 根据图片大小，适应容器大小调整图片显示尺寸
     */
    resize: function(){
      var width = this.avator_temp[0].width;
      var height = this.avator_temp[0].height;
      if((width / 400.0) > (height / 500.0)){
        var new_width = 400;
        var new_height = parseInt(400 * height / width);
      }
      else {
        var new_width = parseInt(500 * width / height);
        var new_height = 500;
      }
      
      this.avator_temp.css({
        width: new_width + 'px',
        height: new_height + 'px'
      });
      this.preview.css({
        width: new_width + 'px',
        height: new_height + 'px'
      });
    },
    /**
     * 根据裁剪选取修改缩略图
     */
    show_preview: function(coords){
      // 获取图片的缩放后尺寸（为了适应容器大小而设置的尺寸，并非实际尺寸）
      var width_str = v_upload.avator_temp.css('width');
      var height_str = v_upload.avator_temp.css('height');
      var img_info = {
        width: parseInt(width_str.substring(0, width_str.indexOf('px'))),
        height: parseInt(height_str.substring(0, height_str.indexOf('px')))
      };

      var rx = 200 / coords.w;
      var ry = 200 / coords.h;
      v_upload.preview.css({
        width: Math.round(rx * img_info.width) + 'px',
        height: Math.round(ry * img_info.height) + 'px',
        marginLeft: '-' + Math.round(rx * coords.x) + 'px',
        marginTop: '-' + Math.round(ry * coords.y) + 'px'
      });
    }
  }
});


/**
 * 图片ajax上传
 */
ajax_upload.upload({
  url: teachersys.base_url + 'img/upload/',
  form_id: 'avator_upload_form',
  submit_id: 'avator_upload_form input[type=button]',
  complete: function(responseData){
    
    v_upload.form.hide();
    v_upload.crop.show();
    
    var img_preview = $('#preview img');
    var img_avator = $('#avator_temp img');
    if(responseData.data){
    	// 设置缩略图图片地址
	    v_upload.set_url('preview', responseData.data.url);
	    // 设置待裁剪图片地址
	    v_upload.set_url('avator_temp', responseData.data.url);
	    v_upload.avator_temp.load(function(){
	      v_upload.resize();
	      // 添加裁剪控件
	      v_upload.Jcrop_api = $.Jcrop(this, {
	        onChange: v_upload.show_preview,
	        onSelect: v_upload.show_preview,
	        aspectRatio: 1
	      }); 
	      $('#avator_temp img').unbind('load');
	    });
    }
    
  }
});

// ========================================
// 创建组控制器
// ========================================
var c_upload = nyJS.controller.create();

// ========================================
// 创建组件
// ========================================
// overlay
var overlay = nyJS.component.create('overlay', {
  target: $('#img_upload'), 
  before_show: function(){
    v_upload.reset();
  }, 
  before_hide: function(){
    //alert('before_hide');
  }
});

// ========================================
// 注册事件
// ========================================
nyJS._event.reg({
  type: 'click',
  jq: $('#avator a.avator_tip'),
  name: 'avator_click'
});
nyJS._event.reg({
  type: 'click',
  jq: $('#crop_save'),
  name: 'crop_save'
});
nyJS._event.reg({
  type: 'click',
  jq: $('#avator_upload_close'),
  name: 'avator_upload_close'
});
nyJS._event.reg({
  type: 'mouseover',
  jq: $('#avator'),
  name: 'avator_mouseover'
});
nyJS._event.reg({
  type: 'mouseout',
  jq: $('#avator'),
  name: 'avator_mouseout'
});
// ========================================
// 响应事件
// ========================================
c_upload.response({
  avator_click: {
    upload_show: function(){
      overlay.show('slow');
    }
  },
  avator_upload_close: {
    close: function(){
      overlay.hide();
    }
  },
  crop_save: {
    save: function(){
      var crop_info = v_upload.Jcrop_api.tellScaled();
      // 如果用户已经选择好了裁剪区域
      if(crop_info.w !== 0){
        var ori_width = $('#avator_temp img')[0].width;
        alert('width:' + ori_width);
        var new_width = $('#avator_temp img').css('width');
        new_width = parseInt(new_width.substring(0, new_width.indexOf('px')));
        alert('css_width:' + new_width);
        var r = ori_width / new_width;
        var img_url = $('#avator_temp img').attr('src');
        var id_str = img_url.substring(img_url.lastIndexOf('/') + 1);
        m_teacher.post({
          name: 'crop_save',
          type: 'avator_crop',
          data: {
            id_str: m_teacher.get_id_str(),
            pic_id_str: id_str,
            ori_width: parseInt(crop_info.w * r),
            ori_height: parseInt(crop_info.h * r),
            ori_x: parseInt(crop_info.x * r),
            ori_y: parseInt(crop_info.y * r)
          }
        });
      }
      else {
        alert('请先选择裁剪区域！');
      }
      
    }
  },
  avator_mouseover: {
  	show_a: function(){
  		$('#avator a').show();
  	}
  },
  avator_mouseout: {
  	show_a: function(){
  		$('#avator a').hide();
  	}
  }
});

// ========================================
// 响应ajax事件
// ========================================
c_upload.response_ajax({
  /**
   * 用于教师信息更新的ajax
   */
  crop_save: {
    before_send: {
      ajax_loading: function(){
        ajax_tip.set('正在保存...');
        ajax_tip.show();
      }
    },
    complete: {
      ajax_finish: function(args){
        ajax_tip.delay(4000).hide(1);
      }
    },
    success: {
      ajax_success: function(args){
        var result = ajax_helper.success(args)
        if(result === true){
          ajax_tip.set('您的头像已经保存！');
          v_upload.set_url('avator', v_upload.avator_temp.attr('src') + '/'); // 添加/ 防止浏览器缓存
        }
        else
          ajax_tip.set('保存失败！请稍候重试');
        
        overlay.hide();
      }
    },
    error: {
      ajax_error: function(args){
        ajax_tip.set(ajax_helper.error(args));
      }
    }
  }
})
