
// 构造ajax model
var m_teacher = nyJS.model.create({
  prototype: {
    /**
     * 获取教师id字符串
     */
    get_id_str: function(){
      if(this.id_str === undefined){
        var id_str = $('#teacher_id_str').val();
        $('#teacher_id_str').remove();
        this.id_str = id_str;
        return id_str;
      }
      else {
        return this.id_str;
      }
    },
    id_str: undefined,
    /**
     * 将以秒记的时间戳转化为字符串形式
     * @param <string> 以秒记的时间戳
     * @return <string> 时间的字符串表示形式
     */
    handle_date: function(timestamp){
      var date_obj = new Date(timestamp * 1000);
      var date_str = date_obj.getFullYear() + '-';
      var month = date_obj.getMonth() + 1;
      if(month < 10){
        month = ('0' + month);
      }
      var day = date_obj.getDate();
      if(day < 10){
        day= ('0' + day);
      }
      date_str += (month + '-' + day);
      return date_str;
    }
  }
});

// ========================================
// 注册ajax事件
// ========================================

// 用于教师基本信息的修改和获取等
m_teacher.reg_ajax({
  name: "teacher_info",
  setting: {
    url: teachersys.ajax_url + "teacher_info/"
  }
});
// 用于教师论文项目信息的获取等
m_teacher.reg_ajax({
  name: "teacher_other_get",
  setting: {
    url: teachersys.ajax_url + "teacher_info/"
  }
});
// 用于教师论文项目信息的更新等
m_teacher.reg_ajax({
  name: "teacher_other_update",
  setting: {
    url: teachersys.ajax_url + "teacher_info/"
  }
});
// 用于教师论文项目信息的添加等
m_teacher.reg_ajax({
  name: "teacher_other_add",
  setting: {
    url: teachersys.ajax_url + "teacher_info/"
  }
});
// 用于教师论文项目信息的删除等
m_teacher.reg_ajax({
  name: "teacher_other_delete",
  setting: {
    url: teachersys.ajax_url + "teacher_info/"
  }
});
// 用于教师论文项目信息的更新等
m_teacher.reg_ajax({
  name: "teacher_login_update",
  setting: {
    url: teachersys.ajax_url + "teacher_info/"
  }
});
// 用于教师论文项目信息的搜索等
m_teacher.reg_ajax({
  name: "teacher_search",
  setting: {
    url: teachersys.ajax_url + "search/"
  }
});
// 用于教师的添加
m_teacher.reg_ajax({
  name: "teacher_add",
  setting: {
    url: teachersys.ajax_url + "add_teacher/"
  }
});
// 用于信息项目的修改
m_teacher.reg_ajax({
  name: "item_update",
  setting: {
    url: teachersys.ajax_url + "item/"
  }
});
// 用于教研所place的获取
m_teacher.reg_ajax({
  name: "item_tru_place_get",
  setting: {
    url: teachersys.ajax_url + "item/"
  }
});
// 用于项目的添加
m_teacher.reg_ajax({
  name: "item_add",
  setting: {
    url: teachersys.ajax_url + "item/"
  }
});
// 用于项目的删除
m_teacher.reg_ajax({
  name: "item_delete",
  setting: {
    url: teachersys.ajax_url + "item/"
  }
});
// 用于头像的裁剪
m_teacher.reg_ajax({
  name: "crop_save",
  setting: {
    url: teachersys.ajax_url + "teacher_info/"
  }
});
// 用于头像的裁剪
m_teacher.reg_ajax({
  name: "teacher_active",
  setting: {
    url: teachersys.ajax_url + "teacher_info/"
  }
});
