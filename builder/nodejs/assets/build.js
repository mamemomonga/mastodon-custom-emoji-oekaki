#!/usr/bin/env node
'use strict';

// 定義した順番に処理を実行する
let SerializeTask=function(tsk,fin){
	this.tasks=tsk;
	if(fin) { this.finish=fin } else { this.finish=function(){} }
};
SerializeTask.prototype={
	run: function() {
		let t=this;
		if(t.tasks.length == 0) {t.finish(); return; }
		let task=t.tasks.shift();
		new Promise( (res,rej)=>{ task(res,rej) } ).then( function() { t.run() });
	}
};

// 
let app=function(){};
app.prototype={
	run: function() {
		let t=this;
		t.data={};
		new SerializeTask([
			function(res,rej){ t.css(res,rej) },
			function(res,rej){ t.js(res,rej)  },
			function(res,rej){
				switch( process.argv[2] ) {
					case 'dev':    t.ejs_dev(res,rej);    break;
					case 'prod':   t.ejs_prod(res,rej);   break;
					case 'manual': t.ejs_manual(res,rej); break;
				}
			}
		],function(){}).run();
	},
	css: function(resolve,reject){
		let t=this;
		let fs=require('fs');
		let ejs = require('ejs');
		let CleanCSS = require('clean-css');

		let buf="";
		fs.readFile('/volumes/app/reset.css', 'utf8',(err,reset)=>{	
			fs.readFile('/volumes/app/index.css', 'utf8',(err,index)=>{	
				t.data['css']=new CleanCSS({}).minify(reset+index).styles;
				resolve( true );
			});
		});
	},
	js: function(resolve,reject) {
		let t=this;
		let fs=require('fs');
		fs.readFile('/volumes/var/index.min.js', 'utf8',(err,text)=>{	
			t.data['js']=text;
			resolve( true );
		});

	},
	ejs_prod: function(resolve,reject) {
		let t=this;
		let fs=require('fs');
		let ejs=require('ejs');
		fs.readFile('/volumes/app/index.ejs.html','utf8',(err,tmpl)=>{
			console.log("Read: index.ejs.html");
			let data=t.data;
			let minify = require('html-minifier').minify;
			data['production']=true;
			data['buildnum']=process.env.BUILDNUM;
			let html=minify(ejs.render(tmpl,data),{
				removeAttributeQuotes: true,
				removeComments: true,
			});
			fs.writeFile('/volumes/var/index.prod.html',
				html,
				(err)=>{
					if (err) throw err;
					console.log("Write: index.prod.html");
					resolve(true);
				}
			);
		});
	},
	ejs_dev: function(resolve,reject) {
		let t=this;
		let fs=require('fs');
		let ejs=require('ejs');
		fs.readFile('/volumes/app/index.ejs.html','utf8',(err,tmpl)=>{
			console.log("Read: index.ejs.html");
			let data=t.data;
			data['production']=false;
			fs.writeFile('/volumes/var/index.dev.html',
				ejs.render(tmpl,data),	
				(err)=>{
					if (err) throw err;
					console.log("Write: index.dev.html");
					resolve(true);
				}
			);
		});
	},
	ejs_manual: function(resolve,reject) {
		let t=this;
		let fs=require('fs');
		let ejs=require('ejs');
		fs.readFile('/volumes/app/manual.ejs.html','utf8',(err,tmpl)=>{
			console.log("Read: manual.ejs.html");
			let data=t.data;
			fs.writeFile('/volumes/var/manual.html',
				ejs.render(tmpl,data),	
				(err)=>{
					if (err) throw err;
					console.log("Write: manual.html");
					resolve(true);
				}
			);
		});
	},


};
new app().run();
