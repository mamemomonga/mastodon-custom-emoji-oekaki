// vim:ft=javascript

export default class EmojiMojis {
	constructor(cfg) {
		this.startup_configs=cfg;
		this.container=$('.cont_ret_ctrl .left .emojimoji_btn');
		this.cb=()=>{}
		this.init();
	}
	init() {
		this.container.empty();
		this.ems=[];
		for(let i in this.startup_configs) {
			this.ems[i]=new EmojiMoji((r)=>{ this.cb(r) },this.startup_configs[i]);
		}
	}
	set_apply_callback(cb) {
		this.cb=cb;
	}
	load(emojis_jq) {
		emojis_jq.each((idx,elm)=>{
			const sc=elm.dataset.shortcode;
			for(let i in this.ems) {
				const em=this.ems[i];
				const ma=sc.match(em.re_shortcode);
				if(ma) {
					if(sc==em.icon.sc) em.icon.url=elm.src;
					em.emojis[parseInt(ma[1],16)]=sc;
				}
			}
		});
		for(let i in this.ems) {
			const em=this.ems[i];
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
				( (m)=>{ m.icon.jq.on('click',function(e) { m.convert() }) } )(em);
				this.container.append(em.icon.jq);
			}
		}
	}
}

class EmojiMoji {
	constructor(cb,cfg) {
		this.prefix = cfg.prefix;
		this.h2k    = cfg.h2k ? true : false;
		this.icon   = { sc: cfg.icon, jq: undefined, url: '' };
		this.re_shortcode = new RegExp('^'+this.prefix+'([0-9a-f]{4})$');
		this.re_emojimoji = new RegExp(':'+this.prefix+'([0-9a-f]{4}):','mg');
		this.jq_textarea  = $('#result');
		this.emojis   = {};
		this.callback = cb;
		this.text="";
	}
	convert() {
		this.text=this.jq_textarea.val();
		this.text.match(this.re_emojimoji) ? this.decode() : this.encode();
	}
	decode(){
		this.jq_textarea.val( this.text.replace( this.re_emojimoji,(m,p1) => {
			return String.fromCodePoint(parseInt(p1,16));
		}));
	}
	encode(){
		const lines=this.text.split(/\r\n|\r|\n/);
		const p=(x)=>{ return parseInt(x,16) };
		const k=(x)=>{ return this.emojis[x] ? this.emojis[x] : 'blank' };
		let nl=[];
		for(let y=0; y<lines.length; y++) {
			let emj=[];
			for(let chi in lines[y]) {
				let chr=lines[y].charCodeAt(chi);
				// スペース
				if (chr == p('0020') || chr == p('3000')) {
					emj.push('blank');

				// ひらがなはカタカナに
				} else if ( this.h2k && ( chr>=p('3041') && chr<=p('3093') ) ) {
					emj.push(k(chr+96));

				// あうやつを拾う
				} else if( this.emojis[chr] ) {
					emj.push(this.emojis[chr]);
				}
			}
			nl[y]=emj;
		}
		this.callback(nl);
	}
}


