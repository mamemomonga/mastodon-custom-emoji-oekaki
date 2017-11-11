// gulp
import gulp from 'gulp';

import webserver from 'gulp-webserver';

// ejs
import ejs from 'gulp-ejs';
import gutil from 'gulp-util';

// js
import browserify from 'browserify';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

// sass
import sass from 'gulp-sass';

import fs from 'fs';

gulp.task('index', ['sass','es6'],() => {
	const css = fs.readFileSync('../build/main.css');
	const js  = fs.readFileSync('../build/app.js');

	gulp.src('./templates/index.ejs')
		.pipe(ejs({
			css: css,
			js: js,
 			production: true,
			buildnum: "BUILDNUMBER",
		},{},{
			ext: '.html'
		}).on('error', gutil.log))
		.pipe(gulp.dest('../build'))
});
 
gulp.task('es6',() => {
	browserify({
		entries: ['./es6/app.es6'],
		extentions: ['.es6','.js'],
		debug: true
	})
	.transform(babelify)
	.bundle()
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(gulp.dest('../build'))
});

// gulp.task('es6',() => {
// 	browserify({
// 		entries: ['./es6/app.es6'],
// 		extentions: ['.es6','.js'],
// 		debug: true
// 	})
// 	.transform(babelify)
// 	.bundle()
// 	.pipe(source('app.js'))
// 	.pipe(buffer())
// 	.pipe(sourcemaps.init('loadMps:true'))
// 	.pipe(uglify())
// 	.pipe(sourcemaps.write('../build'))
// 	.pipe(gulp.dest('../build'))
// });

gulp.task('jquery',() => {
	gulp.src('node_modules/jquery/dist/jquery.min.js')
		.pipe(gulp.dest('../build'))
});

gulp.task('sass',() => {
	gulp.src('./sass/*.scss')
	.pipe(sass({
		outputStyle: 'compressed'
	}).on('error',sass.logError))
	.pipe(gulp.dest('../build'))
});

gulp.task('webserver',() => {
	gulp.src('../build')
	.pipe(webserver({
		liveload: true,
		directoryListing: true,
		host: '0.0.0.0',
		port: 3000
	}));
});

gulp.task('default',['es6','sass','index','webserver','jquery'],() => {
	gulp.watch('./es6/*.es6', ['es6','index']);
	gulp.watch('./sass/*.scss', ['sass','index']);
	gulp.watch('./templates/index.ejs', ['index']);
});

