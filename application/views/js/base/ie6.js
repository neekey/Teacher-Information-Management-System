/* 用于为ie6 中的表单元素添加  样式 类 */
$(document).ready(function(){
	$('input').each(function(){
		var type = $(this).attr('type');
		$(this).addClass('input_' + type);
	});
});
