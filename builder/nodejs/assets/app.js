#!/usr/bin/env node
'use strict';

let app=function(){};
app.prototype={
	run: function() {
		let t=this;
		t.data={};
		new Promise( (res,rej)=>{ t.css(res,rej) } ).then(function() {
			new Promise( (res,rej)=>{ t.js(res,rej) } ).then(function() {
				t.ejs();
			})
		});

	},
	css: function(resolve,reject){
		let t=this;
		let fs=require('fs');
		let ejs = require('ejs');
		let CleanCSS = require('clean-css');

		let buf="";
		fs.readFile('/volumes/app/reset.css', 'utf8', function (err,reset) {	
			fs.readFile('/volumes/app/index.css', 'utf8', function (err,index) {	
				t.data['css']=new CleanCSS({}).minify(reset+index).styles;
				resolve( true );
			});
		});
	},
	js: function(resolve,reject) {
		let t=this;
		let fs=require('fs');
		fs.readFile('/volumes/var/index.min.js', 'utf8', function (err, text) {	
			t.data['js']=text;
			resolve( true );
		});

	},
	ejs: function() {
		let t=this;
		let fs=require('fs');

		fs.readFile('/volumes/app/index.ejs.html','utf8', function(err,tmpl) {
			let ejs=require('ejs');
			{
				let data=t.data;
				data['production']=true;
				fs.writeFile(
					'/volumes/var/index.prod.html',
					ejs.render(tmpl,t.data),	
					(err)=>{
						if (err) throw err;
						console.log("Write: index.prod.html");
					}
				);
			}
			{
				let data=t.data;
				data['production']=false;
				fs.writeFile(
					'/volumes/var/index.dev.html',
					ejs.render(tmpl,t.data),	
					(err)=>{
						if (err) throw err;
						console.log("Write: index.dev.html");
					}
				)
			}
		});

	}

};


new app().run();
