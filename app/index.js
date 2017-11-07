'use strict';

(function(){

/* Utility */
let Utility=function(){}
Utility.prototype={
	regex_escape: function(str) {
		return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
	},
	shortcode2elm: function() {
		let sc2elm={};
		$('#emoji_palette img').each(function(idx,elm) {
			sc2elm[elm.dataset.shortcode]=elm;
		});
		return sc2elm;
	},
};

/* EmojiMoji */
let EmojiMojis=function(cfg) {
	let t=this;
	t.startup_configs=cfg;
	t.cb=function(){}
	t.init();
};

EmojiMojis.prototype={
	init: function() {
		let t=this;
		t.container=$('.cont_ret_ctrl .left .emojimoji_btn');
		t.container.empty();
		t.ems=[];
		for(let i in t.startup_configs) {
			t.ems[i]=new EmojiMoji(function(r){ t.cb(r) },t.startup_configs[i]);
		}
	},
	set_apply_callback: function(cb) {
		this.cb=cb;
	},
	load: function(emojis_jq) {
		let t=this;
		emojis_jq.each(function(idx,elm){
			let sc=elm.dataset.shortcode;
			for(let i in t.ems) {
				let em=t.ems[i];
				let ma=sc.match(em.scm);
				if(ma) {
					if(sc==em.icon.sc) { em.icon.url=elm.src }
					em.emojis[parseInt(ma[1],16)]=sc;
				}
			}
		});
		for(let i in t.ems) {
			let em=t.ems[i];
			if(Object.keys(em.emojis).length > 0) {
				em.icon.jq=$('<img>',{
					'src': em.icon.url,
					'css': {
						'vertical-align': 'middle',
						'object-fit': 'contain',
						'width':  24,
						'height': 24,
					}
				});
				(function(m){
					m.icon.jq.on('click',function(e) { m.convert() });
				})(em);
				t.container.append(em.icon.jq);
			}
		}
	}
}

let EmojiMoji=function(cb,cfg) {
	var t=this;
	t.prefix   = cfg.prefix;
	t.h2k      = cfg.h2k ? true : false;
	t.icon     = { sc: cfg.icon, jq: undefined, url: '' };
	t.scm      = new RegExp('^'+t.prefix+'([0-9a-f]{4})$');
	t.emojis   = {};
	t.callback = cb;
};
EmojiMoji.prototype={
	convert: function() {
		let t=this;
		// console.log(t);
		let lines=$('#result').val().split(/\r\n|\r|\n/);
		let nl=[];
		for(let y=0; y<lines.length; y++) {
			let p=function(x) { return parseInt(x,16) };
			let k=function(x) { return t.emojis[x] ? t.emojis[x] : 'blank' };
			let emj=[];
			for(let chi in lines[y]) {
				t.cb=function(){}
				let chr=lines[y].charCodeAt(chi);
				// スペース
				if (chr == p('0020') || chr == p('3000')) {
					emj.push('blank');

				// ひらがなはカタカナに
				} else if ( t.h2k && ( chr>=p('3041') && chr<=p('3093') ) ) {
					emj.push(k(chr+96));

				// あうやつを拾う
				} else if( t.emojis[chr] ) {
					emj.push(t.emojis[chr]);
				}
			}
			nl[y]=emj;
		}
		t.callback(nl);
	}
};

/* Application */
let Application=function(args){
	this.width  = 11;
	this.height = 11;
	this.util=new Utility();
	this.emojimojis=new EmojiMojis([
		{ prefix: 'klg', icon: 'klg2640', h2k: true },
		{ prefix: 'nrk', icon: 'nrk30ca', h2k: true },
	]);
};
Application.prototype={

	run: function(args){
		let t=this;

		// ? を # に変更
		if(window.location.search) {
			let l=window.location;
			let src=l.search;
			l.href=l.href.replace(new RegExp(t.util.regex_escape(src)),'')+'#'+src.substring(1);
		}

		$('#instance_domain').on('click',function() {
			t.reset();
			t.emojimojis.init();
		});

		$('#selected_shortname').on('click',function() {
			if(t.selected_idom) {
				window.open(t.selected_idom.src);
			}
		});

		$('#bt_search_clear').on('click',function() {
			$('#text_search').val("");
		});

		$('#bt_ret_copy').on('click',function() {
			$('#result').focus().select();
			document.execCommand('copy');
		});

		$('#bt_ret_share').on('click',function() {
			window.open('https://'+t.instance_domain+'/share?text='+encodeURI($('#result').val()));
		});

		$('#bt_reset').on('click',function() { t.tiles_reset() });

		$('#bt_load').on('click',function() { t.tiles_load() });

		$('#btn_left').on( 'click',function() { t.tiles_move('left')  });
		$('#btn_right').on('click',function() { t.tiles_move('right') });
		$('#btn_up').on(   'click',function() { t.tiles_move('up')    });
		$('#btn_down').on( 'click',function() { t.tiles_move('down')  });

		$('#btn_blank').on('click',function() {
			let sc2elm=t.util.shortcode2elm();
			t.emoji_palette_select(sc2elm['blank']);
		});

		t.emojifetch_active=false;
		$('#instance_info_submit').on('click',function() {
			if(!t.emojifetch_active) { t.emojifetch_start() }
		});

		// emojimoji
		t.emojimojis.set_apply_callback(function(kmb){
			t.tiles_reset();
			for(let y=0; y<t.height; y++) {
				let tiles=[];
				if(!kmb[y]) { continue }
				for(let x=0; x<t.width; x++) {
					tiles[x]=kmb[y][x] || 'blank';
				}
				t.tiles_sc[y]=tiles;
			}
			t.tiles_from_sc();
		});

		let instance_domain=window.location.hash.substring(1) || "";
		if( instance_domain ) {
			$('#instance_info_domain').val(instance_domain);
			if(!t.emojifetch_active) { t.emojifetch_start() }
			return;
		}

		t.switch_show_container('intro');
	},

	switch_show_container: function(container) {
		let t=this;
		let containers=['main','loading','intro'];
		for( let c in containers) {
			let con=containers[c];
			if(con==container) {
				$('.container_'+con).show();
			} else {
				$('.container_'+con).hide();
			}
		}
	},

	reset: function() {
		let t=this;
		t.switch_show_container('intro');
	},

	emojifetch_start: function() {
		let t=this;
		t.emojifetch_active=true;
		t.switch_show_container('loading');
		t.instance_domain=$("#instance_info_domain").val();
		$.ajax({
			type: 'GET',
			url: "https://"+t.instance_domain+"/api/v1/custom_emojis",
			success: function(json) {
				t.emojifetch_active=false;
				t.emojifetch_success(json);
			},
			error: function(jqXHR, textStatus, errorThrown){
				t.emojifetch_active=false;
				t.switch_show_container('intro');
				alert("取得失敗");

			}
		});
	},

	emojifetch_success: function(json) {
		let t=this;
		window.location.hash=t.instance_domain;
		$('#instance_domain').text(t.instance_domain);
		t.emoji_palette(json);
		t.tiles();
		t.switch_show_container('main');
	},

	search_update: function() {
		let t=this;
		let keyword=$('#text_search').val();
		if(keyword != t.prev_keyword) {
			if(keyword == "") {
				$('#emoji_palette img').each(function(idx,elm) { $(elm).show() });
			} else {
				$('#emoji_palette img').each(function(idx,elm) {
					if(elm.dataset.shortcode.search(keyword)!=-1) {
						$(elm).show();
					} else {
						$(elm).hide();
					}
				});
			}
			t.prev_keyword=keyword;
		}
	},	

	tiles_reset: function() {
		let t=this;
		let blank_src=t.blank_idom.src;
		$('#tiles img').each(function(idx,elm) {
			elm.src=blank_src;
			t.tiles_sc[elm.dataset.y][elm.dataset.x]='blank';
		});
		t.result();
	},

	tiles_update(tile_elms){
		let t=this;
		t.tiles_reset();
		$('#tiles img').each(function(idx,elm) {
			let x=elm.dataset.x, y=elm.dataset.y;
			if(!tile_elms[y]) { return }
			if(!tile_elms[y][x]) { return }
			let te=tile_elms[y][x];
			elm.src=te.src;
			elm.dataset.shortcode=te.dataset.shortcode;
			t.tiles_sc[elm.dataset.y][elm.dataset.x]=te.dataset.shortcode;
		});
		t.result();
	},

	tiles_from_sc:function() {
		let t=this;
		let sc2elm=t.util.shortcode2elm();
		let te=[];
		for(let y=0; y<t.height; y++) {
			let tex=[];
			for(let x=0; x<t.width; x++) { tex[x]=sc2elm[t.tiles_sc[y][x]] }
			te.push(tex);
		}
		t.tiles_update(te);
	},

	tiles_move(dir) {
		let t=this;
		let sc=t.tiles_sc;
		if(dir=="left") { for(let y in sc) { sc[y].push(sc[y].shift()) }}
		if(dir=="right"){ for(let y in sc) { sc[y].unshift(sc[y].pop()) }}
		if(dir=="up")   { sc.push(sc.shift()) }
		if(dir=="down") { sc.unshift(sc.pop()) }
		t.tiles_from_sc();
	},

	tiles: function() {
		let t=this;
		t.tiles_sc=[];
		$('#tiles').text('');

		for(let y=0; y<t.height; y++) {
			let scr=[];
			for(let x=0; x<t.width; x++) {
				let blank=$(t.blank_idom).clone();
				blank.css({
					'border':'2px solid #333333',
					'margin':'1px',
				});
				$(blank).attr({
					'data-x':x,
					'data-y':y,
				});
				$('#tiles').append( blank );
				scr[x]='blank';
			}
			$('#tiles').append( $('<br>') );
			t.tiles_sc[y]=scr;
		}
		$('#tiles img').on('click',function(e) {
			let tg=e.target;
			let x=tg.dataset.x, y=tg.dataset.y;
			if(!t.selected_idom) { return }
			if ( tg.src == t.selected_idom.src ) {
				$(tg).attr({ src: t.blank_idom.src });
				t.tiles_sc[y][x]='blank';
			} else {
				$(tg).attr({ src: t.selected_idom.src });
				t.tiles_sc[y][x]=t.selected_idom.dataset.shortcode;
			}
			t.result();
		});
		if(t.search_update_interval) { clearInterval(t.search_update_interval); }
		t.search_update_interval=setInterval(function() { t.search_update() },500);
	},

	tiles_load: function() {
		let t=this;
		let sc2elm=t.util.shortcode2elm();

		let ntile=[];
		let lines=$('#result').val().split(/\r\n|\r|\n/);
		for(let y=0;y < ((lines.length > t.height) ? t.height : lines.length); y++) {
			let line=lines[y].split(/\u200B| /);
			let ntilex=[];
			for(let x=0;x< ((line.length > t.width) ? t.width : line.length); x++) {
				let sc=line[x].replace(/^:/,'').replace(/:$/,'');
				let elm=sc2elm[line[x].replace(/^:/,'').replace(/:$/,'')];
				if(!elm) { continue }
				ntilex[x]=elm;
			}
			ntile[y]=ntilex;
		}
		t.tiles_update(ntile);
	},

	emoji_palette: function(emoji) {
		let t=this;
		$('#emoji_palette').text("");

		emoji.sort(function(a,b) {
			if(a.shortcode < b.shortcode) {
				return -1;
			} else if (a.shortcode > b.shortcode) {
				return 1
			}
			return 0;
		});

		for(let i=0;i<emoji.length;i++) {
		//	console.log(emoji[i]);
			let ijq=$('<img>',{
				src: emoji[i].url,
				'data-shortcode': emoji[i].shortcode,
				css: {
					'border': '2px solid rgb(57, 63, 79)',
					'object-fit': 'contain',
					'width':  32,
					'height': 32,
				},
			});
			$('#emoji_palette').append(ijq);
			if( emoji[i].shortcode == 'blank' ) {
				t.blank_idom=ijq[0];
			}
		}
		if(!t.blank_idom) {
			alert("このインスタンスには :blank: がないため使用できません");
		}
		$('#emoji_palette img').on('click',function(e) {
			t.emoji_palette_select(e.target)
		});

		// emojimoji
		t.emojimojis.load($('#emoji_palette img'));
	},

	emoji_palette_select: function(dom) {
		let t=this;
		if (dom == t.selected_idom ) { return; }
		$('#selected_shortname').text(':'+dom.dataset.shortcode+':');
		$(dom).css('border','2px solid #FFFFFF');
		t.selected_idom=dom;
		if(t.prev_selected_idom) {
			$(t.prev_selected_idom).css('border','2px solid rgb(57, 63, 79)');
		}
		t.prev_selected_idom=dom;
	},

	result: function() {
		let t=this;
		let nr=[];
		let seen_y=false;
		for(let y=t.height-1;y>=0;y--) {
			let nc=[];
			let seen_x=false;
			for(let x=t.width-1;x>=0;x--) {
				let ts=':'+t.tiles_sc[y][x]+':';
				if(ts != ':blank:') { seen_x=true }
				if(seen_x) { nc.push(ts) }
			}
			if(nc.length>0) {
				seen_y=true;
			} else {
				nc.push("\u200B");
			}

			if(seen_y) {
				nr.push(nc.reverse());
			}
		}
		let lines=[];
		for(let y=nr.length-1;y>=0;y--) {
			lines.push(nr[y].join("\u200B"));
		}
		let buf=lines.join("\n");
		let buflen=buf.length;
		let bgcolor='#000000';
		if(buflen > 500) { bgcolor='#FF0000'; }
		$('.cont_result_count').css('background-color',bgcolor);
		$('#result_count').text(buflen);
		$('#result').val(buf);
	},

};

window['MstdnCustomEmojiOekaki']=Application; })();
