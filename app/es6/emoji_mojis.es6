// vim:ft=javascript

export default class EmojiMojis {
	constructor(cfg) {
		const t=this;
		t.startup_configs=cfg;
		t.cb=function(){}
		t.init();
	}
	init() {
		const t=this;
		t.container=$('.cont_ret_ctrl .left .emojimoji_btn');
		t.container.empty();
		t.ems=[];
		for(let i in t.startup_configs) {
			t.ems[i]=new EmojiMoji(function(r){ t.cb(r) },t.startup_configs[i]);
		}
	}
	set_apply_callback(cb) {
		this.cb=cb;
	}
	load(emojis_jq) {
		const t=this;
		emojis_jq.each(function(idx,elm){
			const sc=elm.dataset.shortcode;
			for(let i in t.ems) {
				const em=t.ems[i];
				const ma=sc.match(em.re_shortcode);
				if(ma) {
					if(sc==em.icon.sc) { em.icon.url=elm.src }
					em.emojis[parseInt(ma[1],16)]=sc;
				}
			}
		});
		for(let i in t.ems) {
			const em=t.ems[i];
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

class EmojiMoji {
	constructor(cb,cfg) {
		const t=this;
		t.prefix = cfg.prefix;
		t.h2k    = cfg.h2k ? true : false;
		t.icon   = { sc: cfg.icon, jq: undefined, url: '' };
		t.re_shortcode = new RegExp('^'+t.prefix+'([0-9a-f]{4})$');
		t.re_emojimoji = new RegExp(':'+t.prefix+'([0-9a-f]{4}):','mg');
		t.jq_textarea  = $('#result');
		t.emojis   = {};
		t.callback = cb;
		t.text="";
	}
	convert() {
		const t=this;
		t.text=t.jq_textarea.val();
		t.text.match(t.re_emojimoji) ? t.decode() : t.encode();
	}
	decode(){
		const t=this;
		t.jq_textarea.val( t.text.replace( t.re_emojimoji,(m,p1) => {
			return String.fromCodePoint(parseInt(p1,16));
		}));
	}
	encode(){
		const t=this;
		const lines=t.text.split(/\r\n|\r|\n/);
		const p=function(x) { return parseInt(x,16) };
		const k=function(x) { return t.emojis[x] ? t.emojis[x] : 'blank' };
		let nl=[];
		for(let y=0; y<lines.length; y++) {
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
}


