// vim:ft=javascript
import Utility from './utility'
import EmojiMojis from './emoji_mojis'

export default class EmojiOekaki {
	constructor(args){
		this.width  = 11;
		this.height = 11;
		this.util=new Utility();
		this.emojimojis=new EmojiMojis([
			{ prefix: 'klg', icon: 'klg2640', h2k: true },
			{ prefix: 'nrk', icon: 'nrk30ca', h2k: true },
		]);
	}

	init() {
		// ? を # に変更
		if(window.location.search) {
			const src=window.location.search;
			window.location.href=window.location.href.replace(
				new RegExp(this.util.regex_escape(src)),''
			)+'#'+src.substring(1);
		}

		// 絵文字取得中フラグ
		this.emojifetch_active=false;

		// emojimoji
		this.emojimojis.set_apply_callback((kmb)=>{
			this.tiles_reset();
			for(let y=0; y<this.height; y++) {
				let tiles=[];
				if(!kmb[y]) continue;
				for(let x=0; x<this.width; x++) {
					tiles[x]=kmb[y][x] || 'blank';
				}
				this.tiles_sc[y]=tiles;
			}
			this.tiles_from_sc();
		});

		// イベントリスナー
		$('#instance_domain').on('click',()=>{
			this.reset();
			this.emojimojis.init();
		});

		$('#selected_shortname').on('click',()=>{
			if(this.selected_idom) {
				window.open(this.selected_idom.src);
			}
		});

		$('#bt_search_clear').on('click',()=>{
			$('#text_search').val("");
		});

		$('#bt_ret_copy').on('click',()=>{
			$('#result').focus().select();
			document.execCommand('copy');
		});

		$('#bt_ret_share').on('click',()=>{
			window.open('https://'+this.instance_domain+'/share?text='+encodeURI($('#result').val()));
		});

		$('#bt_reset' ).on( 'click',()=>{ this.tiles_reset()       });
		$('#bt_load'  ).on( 'click',()=>{ this.tiles_load()        });
		$('#btn_left' ).on( 'click',()=>{ this.tiles_move('left')  });
		$('#btn_right').on( 'click',()=>{ this.tiles_move('right') });
		$('#btn_up'   ).on( 'click',()=>{ this.tiles_move('up')    });
		$('#btn_down' ).on( 'click',()=>{ this.tiles_move('down')  });

		$('#btn_blank').on('click',()=>{
			this.emoji_palette_select(this.util.shortcode2elm()['blank']);
		});

		$('#instance_info_submit').on('click',()=>{
			if (! this.emojifetch_active ) this.emojifetch_start();
		});

	}

	run(){
		this.init();

		// ドメインがhashで指定してあったらロード
		const instance_domain=window.location.hash.substring(1) || "";
		if( instance_domain ) {
			$('#instance_info_domain').val(instance_domain);
			if(!this.emojifetch_active) this.emojifetch_start();
			return;
		}
		this.switch_show_container('intro');
	}

	switch_show_container(container) {
		const containers=['main','loading','intro'];
		for( let c in containers ) {
			const con=containers[c];
			if(con==container) {
				$('.container_'+con).show();
			} else {
				$('.container_'+con).hide();
			}
		}
	}

	reset() {
		this.switch_show_container('intro');
	}

	emojifetch_start() {
		this.emojifetch_active=true;
		this.switch_show_container('loading');
		this.instance_domain=$("#instance_info_domain").val();
		$.ajax({
			type: 'GET',
			url: "https://"+this.instance_domain+"/api/v1/custom_emojis",
			success: (json)=>{
				this.emojifetch_active=false;
				this.emojifetch_success(json);
			},
			error:(jqXHR, textStatus, errorThrown)=>{
				this.emojifetch_active=false;
				this.switch_show_container('intro');
				alert("取得失敗");
			}
		});
	}

	emojifetch_success(json) {
		window.location.hash=this.instance_domain;
		$('#instance_domain').text(this.instance_domain);
		this.emoji_palette(json);
		this.tiles();
		this.switch_show_container('main');
	}

	search_update() {
		const keyword=$('#text_search').val();
		if(keyword == this.prev_keyword) return;
		if(keyword == "") {
			$('#emoji_palette img').each((idx,elm)=>{ $(elm).show() });
		} else {
			$('#emoji_palette img').each((idx,elm)=>{
				( elm.dataset.shortcode.search(keyword)!=-1 ) ? $(elm).show() : $(elm).hide();
			});
		}
		this.prev_keyword=keyword;
	}

	tiles_reset() {
		const blank_src=this.blank_idom.src;
		$('#tiles img').each((idx,elm)=>{
			elm.src=blank_src;
			this.tiles_sc[elm.dataset.y][elm.dataset.x]='blank';
		});
		this.result();
	}

	tiles_update(tile_elms) {
		this.tiles_reset();
		$('#tiles img').each((idx,elm)=>{
			const x=elm.dataset.x, y=elm.dataset.y;
			if(!tile_elms[y]) return;
			if(!tile_elms[y][x]) return;
			const te=tile_elms[y][x];
			elm.src=te.src;
			elm.dataset.shortcode=te.dataset.shortcode;
			this.tiles_sc[elm.dataset.y][elm.dataset.x]=te.dataset.shortcode;
		});
		this.result();
	}

	tiles_from_sc(){
		const sc2elm=this.util.shortcode2elm();
		let te=[];
		for(let y=0; y<this.height; y++) {
			let tex=[];
			for(let x=0; x<this.width; x++) { tex[x]=sc2elm[this.tiles_sc[y][x]] }
			te.push(tex);
		}
		this.tiles_update(te);
	}

	tiles_move(dir){
		const sc=this.tiles_sc;
		if(dir=="left") { for(let y in sc) { sc[y].push(sc[y].shift()) }}
		if(dir=="right"){ for(let y in sc) { sc[y].unshift(sc[y].pop()) }}
		if(dir=="up")   { sc.push(sc.shift()) }
		if(dir=="down") { sc.unshift(sc.pop()) }
		this.tiles_from_sc();
	}

	tiles(){
		this.tiles_sc=[];
		$('#tiles').text('');

		for(let y=0; y<this.height; y++) {
			let scr=[];
			for(let x=0; x<this.width; x++) {
				const blank=$(this.blank_idom).clone();
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
			this.tiles_sc[y]=scr;
		}
		$('#tiles img').on('click',(e)=>{
			const tg=e.target;
			const x=tg.dataset.x, y=tg.dataset.y;
			if(!this.selected_idom) { return }
			if ( tg.src == this.selected_idom.src ) {
				$(tg).attr({ src: this.blank_idom.src });
				this.tiles_sc[y][x]='blank';
			} else {
				$(tg).attr({ src: this.selected_idom.src });
				this.tiles_sc[y][x]=this.selected_idom.dataset.shortcode;
			}
			this.result();
		});
		if(this.search_update_interval) clearInterval(this.search_update_interval);
		this.search_update_interval=setInterval(()=>{ this.search_update() },500);
	}

	tiles_load() {
		const sc2elm=this.util.shortcode2elm();
		const lines=$('#result').val().split(/\r\n|\r|\n/);
		let ntile=[];
		for(let y=0;y < ((lines.length > this.height) ? this.height : lines.length); y++) {
			const line=lines[y].split(/\u200B| /);
			let ntilex=[];
			for(let x=0;x< ((line.length > this.width) ? this.width : line.length); x++) {
				let elm=sc2elm[line[x].replace(/^:/,'').replace(/:$/,'')];
				if(!elm) continue;
				ntilex[x]=elm;
			}
			ntile[y]=ntilex;
		}
		this.tiles_update(ntile);
	}

	emoji_palette(emoji) {
		$('#emoji_palette').text("");

		emoji.sort((a,b)=>{
			if(a.shortcode < b.shortcode) {
				return -1;
			} else if (a.shortcode > b.shortcode) {
				return 1
			}
			return 0;
		});

		for(let i=0;i<emoji.length;i++) {
			const ijq=$('<img>',{
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
			if( emoji[i].shortcode == 'blank' ) this.blank_idom=ijq[0];
		}
		if(!this.blank_idom) alert("このインスタンスには :blank: がないため使用できません");

		$('#emoji_palette img').on('click',(e)=>{ this.emoji_palette_select(e.target) });
		this.emojimojis.load($('#emoji_palette img'));
	}

	emoji_palette_select(dom) {
		if (dom == this.selected_idom ) return;
		$('#selected_shortname').text(':'+dom.dataset.shortcode+':');
		$(dom).css('border','2px solid #FFFFFF');
		this.selected_idom=dom;
		if(this.prev_selected_idom) $(this.prev_selected_idom).css('border','2px solid rgb(57, 63, 79)');
		this.prev_selected_idom=dom;
	}

	result() {
		let nr=[];
		let seen_y=false;
		for(let y=this.height-1;y>=0;y--) {
			let nc=[];
			let seen_x=false;
			for(let x=this.width-1;x>=0;x--) {
				let ts=':'+this.tiles_sc[y][x]+':';
				if(ts != ':blank:') { seen_x=true }
				if(seen_x) { nc.push(ts) }
			}
			if(nc.length>0) {
				seen_y=true;
			} else {
				nc.push("\u200B");
			}
			if(seen_y) nr.push(nc.reverse());
		}
		let lines=[];
		for(let y=nr.length-1;y>=0;y--) lines.push(nr[y].join("\u200B"));

		const buf=lines.join("\n");
		const buflen=buf.length;
		let bgcolor='#000000';
		if(buflen > 500) bgcolor='#FF0000';
		$('.cont_result_count').css('background-color',bgcolor);
		$('#result_count').text(buflen);
		$('#result').val(buf);
	}

}
