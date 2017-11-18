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

// wabpack設定
const webpack_config={
	module: {
		loaders: [{
			test: /\.es6$/,
			loader: 'babel-loader',
		}]
	}
}

// es6のコンパイル
const compile_es6=(production)=>{
	return gulp.src('./src/es6/app.es6')
		.pipe(webpack(Object.assign({
				output: { filename: 'app.js' },
				devtool: production ? undefined : 'source-map',
				plugins: production ? [ new UglifyJSPlugin() ] : undefined		
			}, webpack_config
		)))
		.pipe( production ? gulp.dest('/tmp') : gulp.dest('./dev') );
}

// sassのコンパイル
const compile_sass=(production)=>{
	return gulp.src('./src/sass/*.scss')
		.pipe(sass({
			outputStyle: production ? 'compressed' : 'expanded'
		}).on('error',sass.logError))
		.pipe( production ? gulp.dest('/tmp') : gulp.dest('./dev'))
}

// ------------------------
// タスク
// ------------------------

// es6
gulp.task('es6-dev',  () => { return compile_es6(false)  });
gulp.task('es6-prod', () => { return compile_es6(true)   });

// sass
gulp.task('sass-dev', () => { return compile_sass(false) });
gulp.task('sass-prod',() => { return compile_sass(true)  });

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
});

// webserver: 開発用ウェブサーバ
gulp.task('webserver',() => {
	return gulp.src('./')
	.pipe(webserver({
		liveload: true,
		directoryListing: true,
		port: 3000
	}));
});

// index-dev: 開発用index.html
gulp.task('index-dev',() => {
	return gulp.src('./src/templates/index.ejs')
	.pipe(ejs({
 		production: false,
	},{},{ ext: '.html' }).on('error', gutil.log))
	.pipe(gulp.dest('./dev'))
});

// build: 公開版統合HTMLを生成
gulp.task('build', ['sass-prod','es6-prod','assets'],() => {
	const css = fs.readFileSync('/tmp/main.css');
	const js  = fs.readFileSync('/tmp/app.js');
	let buildnum = fs.readFileSync('./BUILDNUM');
	buildnum++;
	gutil.log(`BUILD NUMBER ${buildnum}`);
	fs.writeFileSync('./BUILDNUM',buildnum)
	return gulp.src('./src/templates/index.ejs')
		.pipe(ejs({
			css: css,
			js: js,
 			production: true,
			buildnum: buildnum,
		},{},{ ext: '.html' }).on('error', gutil.log))
		.pipe(gulp.dest('./'))
});

// default: 開発環境の実行
// production(更新監視なし)  http://localhost:3000/index.html
// development(更新監視あり) http://localhost:3000/dev/index.html
gulp.task('default',['es6-dev','sass-dev','assets','index-dev','webserver'],() => {
	gulp.watch('./src/es6/*.es6',   ['es6-dev']);
	gulp.watch('./src/sass/*.scss', ['sass-dev']);
	gulp.watch('./src/templates/index.ejs', ['index-dev']);
});

