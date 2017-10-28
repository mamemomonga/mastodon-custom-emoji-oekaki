'use strict';

(function(){

let Utility=function(){}
Utility.prototype={
	regex_escape: function(str) {
		return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
	},
};

let Application=function(args){
	this.width=11;
	this.height=11;
	this.util=new Utility();
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

		t.emojifetch_active=false;
		$('#instance_info_submit').on('click',function() {
			if(!t.emojifetch_active) { t.emojifetch_start() }
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
		t.switch_show_container('main');
		t.emoji_palette(json);
		t.tiles();
		$('#instance_domain').text(t.instance_domain);
		$('.container_intro').hide();
		$('.container_main').show();
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
			let tg=e.target;
			if (tg == t.selected_idom ) { return; }
			$('#selected_shortname').text(':'+tg.dataset.shortcode+':');
			$(tg).css('border','2px solid #FFFFFF');
			t.selected_idom=tg;
			if(t.prev_selected_idom) {
				$(t.prev_selected_idom).css('border','2px solid rgb(57, 63, 79)');
			}
			t.prev_selected_idom=tg;
		});
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
