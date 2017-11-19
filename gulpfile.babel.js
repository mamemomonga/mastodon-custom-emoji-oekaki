// ------------------------
// gulpfile.babel.js
// ------------------------

import gulp from 'gulp'
import gutil from 'gulp-util'
import webserver from 'gulp-webserver'

import fs from 'fs'

import ejs from 'gulp-ejs'

import webpack from 'webpack-stream'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

import sass from 'gulp-sass'

let production=false;

// ------------------------
// タスク
// ------------------------

// es6
gulp.task('es6',()=>{
	return gulp.src('./src/es6/app.es6')
	.pipe(webpack({
		output: { filename: 'app.js' },
		devtool: production ? undefined : 'source-map',
		plugins: production ? [ new UglifyJSPlugin() ] : undefined,
		module: { loaders: [{ test: /\.es6$/, loader: 'babel-loader', }] }
	}))
	.pipe( gulp.dest( production ? './var/prod' : './var/dev') );
})

// sass
gulp.task('sass',()=>{
	return gulp.src('./src/sass/*.scss')
	.pipe(sass({ outputStyle: production ? 'compressed' : 'expanded' })
	.on('error',sass.logError))
	.pipe( gulp.dest( production ? './var/prod' : './var/dev') );
})

// index
gulp.task('index',()=>{
	const css = production ? fs.readFileSync('./var/prod/main.css') : '';
	const js  = production ? fs.readFileSync('./var/prod/app.js') : '';
	let buildnum = fs.readFileSync('./BUILDNUM');
	if(production) {
		buildnum++;
		gutil.log(`BUILD NUMBER ${buildnum}`);
		fs.writeFileSync('./BUILDNUM',buildnum)
	}
	return gulp.src('./src/templates/index.ejs')
	.pipe(ejs({
		css: css,
		js: js,
		buildnum: buildnum,
 		production: production,
	},{},{ ext: '.html' }).on('error', gutil.log))
	.pipe( gulp.dest( production ? './' : './var/dev') );
})

// assets
gulp.task('assets',['jquery','font-awesome']);
gulp.task('jquery',() => {
	return gulp.src('./node_modules/jquery/dist/jquery.min.js').pipe(gulp.dest('./assets'))
})
gulp.task('font-awesome',() => {
	return gulp.src([
		'./node_modules/font-awesome/css/font-awesome.min.css',
		'./node_modules/font-awesome/fonts/*'
	],{ base: './node_modules' })
	.pipe(gulp.dest('./assets'))
})

// webserver
gulp.task('webserver',()=>{
	return gulp.src('./')
	.pipe(webserver({
		liveload: true,
		directoryListing: true,
		port: 3000
	}));
})

// build
gulp.task('build', ['sass','es6','assets'],()=>{
	return gulp.start('index')
})

// production
// production(更新監視なし)  http://localhost:3000/index.html
gulp.task('production',()=>{
	production=true
	gulp.start('build')
	gulp.start('webserver')
})

// default: 開発環境の実行
// development(更新監視あり) http://localhost:3000/var/dev/index.html
gulp.task('default',['build'],()=>{
	gulp.watch('./src/es6/*.es6',   ['es6']);
	gulp.watch('./src/sass/*.scss', ['sass']);
	gulp.watch('./src/templates/index.ejs', ['index']);
	gulp.start('webserver')
})

