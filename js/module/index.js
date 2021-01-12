(function (app) {
	$(document).ready(function () {
		var list = [
			{ url: 'img/2.64M.jpg'},
			{ url: 'img/nnn.jpg'},
			{ url: 'img/aaaa.jpg'},
			{ url: 'img/sss.jpg'}
		]
		$("#swiperWrapper").html(template($("#tpl").html(), { list: list }));
		var mySwiper = app.initSwiper('#swiperDom', 2);
	});
})(app)