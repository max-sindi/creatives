'use strict';

const
		autoprefixer = require('autoprefixer'),
		babel = require('gulp-babel'),
		browserSync = require('browser-sync').create(),
		cssnano = require('cssnano'),
		debug = require('gulp-debug'),
		gulp = require('gulp'),
		less = require('gulp-sass'),
		// nsg = require('node-sprite-generator'),
		jsConcat = require('gulp-concat'),
		// imgMin = require('gulp-image'),
		multipipe = require('multipipe'),
		notify = require('gulp-notify'),
		postcss = require('gulp-postcss'),
		postUncss = require('postcss-uncss'),
		pug = require('gulp-pug'),
		rename = require('gulp-rename'),
		sass = require('gulp-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		tinify = require('tinify'),
		uglify = require('gulp-uglify');

let buildPath = './docs';

/*
	Development tasks
*/
gulp.task("pug:compile", function() {
	return multipipe(
					gulp.src('./source/pug/**/*.pug'),
					pug({
						debug: false,
						compileDebug: true,
						pretty: true
					}),
					gulp.dest(`${buildPath}/`)
				).on('error', notify.onError());
});


gulp.task("less:compile", function() {

		return gulp.src('./source/less/**/*.less')
				.pipe( sourcemaps.init() )
				.pipe( less() )
				.pipe( sourcemaps.write('.') )
				.pipe( gulp.dest(`${buildPath}/css`) );

});


gulp.task('sass:compile', function() {

		return multipipe(
				gulp.src('./source/sass/**/*.scss'),
				sourcemaps.init(),
				sass(),
				sourcemaps.write('.'),
				gulp.dest(`${buildPath}/css`)
		).on( 'error', notify.onError() );

});


gulp.task('js', function() {
	return gulp.src('./source/js/*.js')
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest(`${buildPath}/js/`));
})


gulp.task('img', function() {
	return gulp.src('./source/img/*.*')
		.pipe(gulp.dest(`${buildPath}/img/`));
})

gulp.task('font', function() {
	return gulp.src('./source/font/*.*')
		.pipe(gulp.dest(`${buildPath}/font/`));
})

/*
		DEFAULT
*/
gulp.task("default", ['sass:compile', 'pug:compile', 'js'],function() {

		browserSync.init({
				server: {
						baseDir: `${buildPath}`
				}
		});

		gulp.watch('source/sass/**/*.scss', ['sass:compile'])
				.on('error', notify.onError());
		gulp.watch('source/pug/**/*.pug',   ['pug:compile']);
		gulp.watch('source/js/*.js',        ['js']);
		gulp.watch('source/img/**/*.*',     ['img']);
		gulp.watch('source/fonts/**/*.*',     ['font']);

		gulp.watch(`${buildPath}/**/*.*`).on('change', browserSync.reload);
});



/*
Build tasks
*/

// gulp.task("img:min", function() {
// 	gulp.src('./source/img/*.png')
// 			.pipe( imgMin() )
// 			.pipe(gulp.dest(`${buildPath}/img/`));
// });


gulp.task('js:build', function() {

  multipipe(
		gulp.src([`./source/js/*.js`, `./source/js/modules/*.js`]),
		jsConcat('bundle.js'),
		babel(),
		gulp.dest(`${buildPath}/js/`), // write not minified bundle.js
		uglify(),
		rename('bundle.min.js'),
		gulp.dest(`${buildPath}/js/`)
	)

});


// for build task
gulp.task("pug:build", function() {

	gulp.src('./source/pug/**/*.pug')
			.pipe( pug() )
			.pipe(gulp.dest(`${buildPath}/`));

});

gulp.task('css:build', ['sass:compile'], function() {
		let plugins = [
				autoprefixer(
					{
						browsers: ['last 10 versions']
					}
				),
				cssnano()
		];

		return multipipe(
				gulp.src(`${buildPath}/css/main.css`),
				debug(),
				postcss(plugins),
				rename('main.min.css'),
				debug(),
				gulp.dest(`${buildPath}/css`)
		).on('error', notify.onError());

});

// build all
gulp.task("build", ["pug:build", "css:build", "js:build", "img:min"]);
