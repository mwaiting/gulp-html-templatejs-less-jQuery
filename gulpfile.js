var gulp = require('gulp'),
	changed = require('gulp-changed'),
	del = require('del'),
	uglify = require('gulp-uglify'),
	less = require('gulp-less'),
	fileinclude = require('gulp-file-include'),
	tinypng_nokey = require('gulp-tinypng-nokey'),
	gulpSequence = require('gulp-sequence'),
	cssmin = require('gulp-clean-css'),
	gulpif = require('gulp-if'),
	jshint = require('gulp-jshint'),
	fs = require('fs'),
	// autoprefixer = require('gulp-autoprefixer'),
	browserSync = require("browser-sync").create();
var isDebug = false;

gulp.task('fileinclude', function () {
	return gulp.src(['*.html'])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./dist'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('less', function () {
	return gulp.src(['less/**/*.less'])
		.pipe(less())
		.pipe(gulpif(!isDebug, cssmin()))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('css', function () {
	return gulp.src(['less/**/*.css'])
		.pipe(gulpif(!isDebug, cssmin()))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('js', function () {
	return gulp.src(['js/**/*.js'])
		.pipe(uglify().on('error', function (err) {
			console.log(err);
			this.emit('end');
		}))
		.pipe(gulpif(!isDebug, uglify()))
		.pipe(gulp.dest('./dist/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('img', function () {
	return gulp.src(['img/**/*'])
		// .pipe(gulpif(!isDebug, tinypng_nokey()))
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('autoprefixer', function () {　　　　　　//做一个gulp的任务
	gulp.src(['less/**/*'])
		.pipe(autoprefixer({　　　　　　　　　　　　//这是自动处理的参数
			borwsers: ["last 2 versions", "last 6 Explorer versions"]　　　　//针对浏览器
			// remove:false,		//是否去掉不必要（过时）的前缀 
			// add: true,　　　　　//是否应该加前缀　　　　
			// supports: true,　　//是否为"@supports"属性添加前缀　　　　　　　　
			// flexbox: true,　　 //是否为flexbox属性是否为IE的添加前缀　　　　　　　
			// grid: true,　　　　//是否为Grid布局属性添加IE前缀
		}))
		.pipe(gulp.dest('./dist/autocss'))　　　　　//这是输出css的路径,如果该文件夹没有,那就自动创建　　　　　　　　　　　　　　　////cb跟踪的参数,监控用的.
})

gulp.task('jshint', function () {
	gulp.src(['js/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
});


gulp.task('json', function () {
	gulp.src(['json/*.json'])
		.pipe(gulp.dest('./dist/json'))
})


//  gulp.task('minImg', function() {
// 	var path = "./img/";
// 	fs.readdir(path, function(err, files) {
// 		console.log(files)
// 		console.log('sub folder count = ', files.length);
// 		var totalCount = files.length;
// 		var finishCount = 0;
// 		var finishCb = function () {
// 			finishCount++;
// 			var file = files[finishCount];
// 			console.log("------------finishCount--------：", finishCount)
// 			if (finishCount == totalCount) {
// 				console.log(' ---------------- finish ------------ ');
// 				return false;
// 			}
// 			minImg(path, file, finishCb);
// 		};
// 		minImg(path, files[0], finishCb);
// 	})
// }); 

//  function minImg(path, file, callback) {
// 	gulp.src("img/**/*")
// 		.pipe(tinypng_nokey())
// 		.pipe(gulp.dest('./dist/img'))
// 		.on("end", function() {
// 			console.log(' ------------ finish min img');
// 			callback();
// 		});
// } 

gulp.task('clean', function(cb) {
	return del([
		'dist/**/*'
	], { force: true }, cb);
});


gulp.task('dev', function () {
	isDebug = true;
	gulpSequence('clean', ["fileinclude", "js", "css", "less", "img", "json"], function () {
		browserSync.init({
			port: 8889,
			server: {
				baseDir: ['dist']
			}
		});
		gulp.watch('js/**/*.js', ['js']);
		gulp.watch('json/*.json', ['json']);
		gulp.watch('less/**/*.less', ['less']);
		gulp.watch(['*.html', 'views/*.html'], ['fileinclude']);
		gulp.watch('img/**/*', ['img']);
	});
});
gulp.task('prod', gulpSequence('clean', ["fileinclude", "js", "css", "less", "img"]));

gulp.task('startprod', function () {
	isDebug = false;
	gulp.start("prod");
});



gulp.task('default', ['dev']);
gulp.task('build', ['startprod']);
