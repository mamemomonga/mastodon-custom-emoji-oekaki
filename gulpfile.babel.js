// ------------------------
// gulpfile.babel.js
// ------------------------
'use strict'
import { task, src, dest, series, parallel, watch } from 'gulp'
import log       from 'fancy-log'
import ejs       from 'gulp-ejs'
import sass      from 'gulp-sass'
import htmlmin   from 'gulp-htmlmin'
import fs        from 'fs'
import webpack   from 'webpack-stream'
import webserver from 'gulp-webserver'

const PRODUCTION = ( process.env.NODE_ENV === 'production' ) ? true : false
const ENV_PATH = PRODUCTION ? 'prod': 'dev'

// ------------------------
// tasks
// ------------------------

// es
task('es',()=>{
	return src('./src/es/app.js')
	.pipe(webpack({
		output: { filename: 'app.js' },
		devtool: PRODUCTION ? undefined : 'source-map',
		mode: PRODUCTION ? 'production' : 'development',
		module: { rules: [{
			test: /\.js$/,
			use: { loader: 'babel-loader', options: { presets: [
				[ '@babel/preset-env',{ targets: { browsers: "last 2 versions" }}]
			]}}
		}]}
	}))
	.pipe( dest( `./var/${ENV_PATH}` ))
})

// sass
task('sass',()=>{
	return src('./src/sass/*.scss')
	.pipe(sass({ outputStyle: PRODUCTION ? 'compressed' : 'expanded' })
	.on('error',sass.logError))
	.pipe( dest( `./var/${ENV_PATH}`))
})

// index
task('index',()=>{
	const css = PRODUCTION ? fs.readFileSync(`./var/${ENV_PATH}/main.css`) : '';
	const js  = PRODUCTION ? fs.readFileSync(`./var/${ENV_PATH}/app.js`) : '';
	let buildnum = fs.readFileSync('./BUILDNUM');
	if(PRODUCTION) {
		buildnum++;
		log.info(`BUILD NUMBER ${buildnum}`);
		fs.writeFileSync('./BUILDNUM',buildnum)
	}

	let h = src('./src/templates/index.ejs')
	.pipe(ejs({
		css: css,
		js: js,
		buildnum: buildnum,
 		production: PRODUCTION,
	},{},{ ext: '.html' }).on('error', log))

	if(PRODUCTION){
		h=h.pipe(htmlmin({collapseWhitespace: true}))
	}
	h.pipe( dest( PRODUCTION ? './' : './var/dev') )
	return h
})

task('jquery',()=>{
	return src('./node_modules/jquery/dist/jquery.min.js').pipe(dest('./assets'))
})

task('font-awesome',() => {
	return src([
		'./node_modules/font-awesome/css/font-awesome.min.css',
		'./node_modules/font-awesome/fonts/*'
	],{ base: './node_modules' })
	.pipe(dest('./assets'))
})

// webserver
task('webserver',()=>{
	return src('./')
	.pipe(webserver({
		liveload: true,
		directoryListing: true,
		port: 3000
	}));
})

// assets
task('assets',series('jquery','font-awesome'))

// build
task('build', series( parallel('sass','es','assets'), 'index'))

task('default',series(
	'build',
	(done)=>{
		if(PRODUCTION) {
			log.info("*** [PRODUCTION] http://localhost:3000/index.html ***")
		} else {
			log.info("*** [DEVELOPMENT] http://localhost:3000/var/dev/index.html ***")
		}
		done()
	},
	(done)=>{
		if(PRODUCTION) { done() }
		watch('./src/es/*.js',             series('es'))
		watch('./src/sass/*.scss',         series('sass'))
		watch('./src/templates/index.ejs', series('index'))
		done()
	},
	'webserver'
))
