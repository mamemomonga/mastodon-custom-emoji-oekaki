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
			function(res,rej){ t.ejs(res,rej) }
		],function() { console.log("FINISH"); }).run();
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
	ejs: function(resolve,reject) {
		let t=this;
		let fs=require('fs');
		let ejs=require('ejs');
		let tmpl;

		new SerializeTask([
			function(res,rej) {
				fs.readFile('/volumes/app/index.ejs.html','utf8', function(err,data){
					tmpl=data;
					console.log("Read: index.ejs.html");
					res(true);
				});
			},
			function(res,rej) {
				let data=t.data;
				data['production']=true;
				data['buildnum']=process.env.BUILDNUM;
				fs.writeFile('/volumes/var/index.prod.html',
					ejs.render(tmpl,data),	
					(err)=>{
						if (err) throw err;
						console.log("Write: index.prod.html");
						res(true);
					}
				);
			},
			function(res,rej) {
				let data=t.data;
				data['production']=false;
				fs.writeFile('/volumes/var/index.dev.html',
					ejs.render(tmpl,data),	
					(err)=>{
						if (err) throw err;
						console.log("Write: index.dev.html");
						res(true);
					}
				);
			}
		],function(){ resolve() }).run();
	}
};


new app().run();
