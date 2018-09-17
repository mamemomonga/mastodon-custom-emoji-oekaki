// ------------------------
// gulpfile.babel.js
// ------------------------
import gulp      from 'gulp'
import log       from 'fancy-log'
import webserver from 'gulp-webserver'
import ejs       from 'gulp-ejs'
import sass      from 'gulp-sass'
import fs        from 'fs'
import webpack        from 'webpack-stream'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

let production=false;

// ------------------------
// tasks
// ------------------------

// es6
gulp.task('es6',()=>{
	return gulp.src('./src/es6/app.es6')
	.pipe(webpack({
		output: { filename: 'app.js' },
		devtool: production ? undefined : 'source-map',
		plugins: production ? [ new UglifyJSPlugin() ] : undefined,
		mode: production ? 'production' : 'development',
		module: { rules: [{
			test: /\.es6$/,
			use: { loader: 'babel-loader', options: { presets: [
				[ '@babel/preset-env',{ targets: { browsers: "last 2 versions" }}]
			]}}
		}]}
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
		log.info(`BUILD NUMBER ${buildnum}`);
		fs.writeFileSync('./BUILDNUM',buildnum)
	}
	return gulp.src('./src/templates/index.ejs')
	.pipe(ejs({
		css: css,
		js: js,
		buildnum: buildnum,
 		production: production,
	},{},{ ext: '.html' }).on('error', log))
	.pipe( gulp.dest( production ? './' : './var/dev') )
})

gulp.task('jquery',()=>{
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

// assets
gulp.task('assets',gulp.series('jquery','font-awesome'))

// build
gulp.task('build', gulp.series( gulp.parallel('sass','es6','assets'), 'index'))

// production(更新監視なし)
gulp.task('production',gulp.series(
	(done)=>{
		production=true
		log.info('PRODUCTION MODE')	
		done()
	},
	'build',
	(done)=>{
		log.info("*** http://localhost:3000/index.html ***")
		done()
	},
	'webserver'
))

// development(更新監視あり)
gulp.task('development',gulp.series(
	'build',
	(done)=>{
		gulp.watch('./src/es6/*.es6',           gulp.series('es6'))
		gulp.watch('./src/sass/*.scss',         gulp.series('sass'))
		gulp.watch('./src/templates/index.ejs', gulp.series('index'))
		log.info("*** http://localhost:3000/var/dev/index.html ***")
		done()
	},
	'webserver'
))

gulp.task('default',gulp.series('development'))

