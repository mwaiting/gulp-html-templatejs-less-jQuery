(function (window) {
	window.app = {
		baseUrl: "http://192.168.0.1:8091/",
		// 获取url中的参数
		getRequestUrl: function () { // 获取?后的参数
			var url = location.search;
			if (url.indexOf("?") != -1) {
				var str = url.substr(1);
				return str;
			} else {
				return false;
			}
		},
		// 将url中的参数转为对象
		getRequest: function () { //获取url的参数
			var url = location.search; //获取url中"?"符后的字串  
			var theRequest = new Object();
			if (url.indexOf("?") != -1) {
				var str = url.substr(1);
				strs = str.split("&");
				for (var i = 0; i < strs.length; i++) {
					theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
				}
			}
			return theRequest;
		},
		// 获取url中指定参数的值
		getUrlKey: function (name) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
		},
		//获取项目名称
		getName: function () {
			//获取当前网址，如： http://localhost:8083/xxx/index/meun.jsp
			var curWwwPath = window.location.href;

			//获取主机地址之后的目录，如： xxx/index/meun.jsp
			var pathName = window.location.pathname;
			var pos = curWwwPath.indexOf(pathName);

			//获取主机地址，如： http://localhost:8083
			var hostPath = curWwwPath.substring(0, pos);

			//获取带"/"的项目名，如：/xxx
			var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);

			return projectName;
		},
		// 初始化swiper插件
		initSwiper: function (id, slidesPerView) {
			var mySwiper = null;

			var right_on = '<img class="img" src="img/jiantou_right.png" >';
			var left_on = '<img class="img" src="img/jiantou_left.png" >';

			var right_off = '<img class="img" src="img/jiantou_disable_right.png" >';
			var left_off = '<img class="img" src="img/jiantou_disable_left.png" >';

			var prevBtn = $(id).find(".prev-btn");	//上一个
			var nextBtn = $(id).find(".next-btn");	//下一个
			var $swiperContainer = $(id).find(".swiper-container");
			var $swiperWrapper = $swiperContainer.find(".swiper-wrapper");
			var $swiperSlide = $swiperWrapper.find(".swiper-slide");

			mySwiper = $swiperContainer.swiper({
				loop: false,
				calculateHeight: true,
				slidesPerView: slidesPerView,
				cssWidthAndHeight: true,
				spaceBetween: 20,
				onTouchEnd: function (swiper) {
					if (!swiper.activeIndex) {
						prevBtn.html(left_off)
						nextBtn.html(right_on)
					} else {
						prevBtn.html(left_on)
					}

					if (mySwiper.activeIndex >= slideLength - slidesPerView) {
						nextBtn.html(right_off)
					} else {
						nextBtn.html(right_on)
					}
				}
			});
			var slideLength = mySwiper.slides.length;

			function _getWidth() {
				var bodyWidth, wrapperWidth, sliderWidth;
					bodyWidth = $(id).width();						//swiper-wrapper父级宽度
				sliderWidth = bodyWidth / slidesPerView;			//单个swiper-slide宽度
				
				wrapperWidth = sliderWidth * slideLength;	//swiper-wrapper宽度（所有silde宽度）

				$swiperSlide.width(sliderWidth);
				$swiperContainer.width('100%');
				$swiperWrapper.width(wrapperWidth);
			}
			_getWidth()

			if (mySwiper.activeIndex < 1) {
				prevBtn.html(left_off)
			}
			prevBtn.on('click', function (e) {
				e.preventDefault()
				mySwiper.swipePrev()
				if (!mySwiper.activeIndex) {
					prevBtn.html(left_off)
				}
				if (mySwiper.activeIndex < slideLength - slidesPerView) {
					nextBtn.html(right_on)
				}
			})

			nextBtn.on('click', function (e) {
				e.preventDefault()
				mySwiper.swipeNext()
				if (mySwiper.activeIndex) {
					prevBtn.html(left_on)
				}
				if (mySwiper.activeIndex >= slideLength - slidesPerView) {
					nextBtn.html(right_off)
				}
			})
			$(window).resize(function () {  //当浏览器大小变化时
				_getWidth()
			});
			return mySwiper
		}
	}
})(window);