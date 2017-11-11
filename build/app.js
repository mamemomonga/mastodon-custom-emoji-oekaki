(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _emoji_oekaki = require('./emoji_oekaki.es6');

var _emoji_oekaki2 = _interopRequireDefault(_emoji_oekaki);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window['MstdnCustomEmojiOekaki'] = _emoji_oekaki2.default; // vim:ft=javascript

},{"./emoji_oekaki.es6":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// vim:ft=javascript

var EmojiMojis = function () {
	function EmojiMojis(cfg) {
		_classCallCheck(this, EmojiMojis);

		var t = this;
		t.startup_configs = cfg;
		t.cb = function () {};
		t.init();
	}

	_createClass(EmojiMojis, [{
		key: 'init',
		value: function init() {
			var t = this;
			t.container = $('.cont_ret_ctrl .left .emojimoji_btn');
			t.container.empty();
			t.ems = [];
			for (var i in t.startup_configs) {
				t.ems[i] = new EmojiMoji(function (r) {
					t.cb(r);
				}, t.startup_configs[i]);
			}
		}
	}, {
		key: 'set_apply_callback',
		value: function set_apply_callback(cb) {
			this.cb = cb;
		}
	}, {
		key: 'load',
		value: function load(emojis_jq) {
			var t = this;
			emojis_jq.each(function (idx, elm) {
				var sc = elm.dataset.shortcode;
				for (var i in t.ems) {
					var em = t.ems[i];
					var ma = sc.match(em.re_shortcode);
					if (ma) {
						if (sc == em.icon.sc) {
							em.icon.url = elm.src;
						}
						em.emojis[parseInt(ma[1], 16)] = sc;
					}
				}
			});
			for (var i in t.ems) {
				var em = t.ems[i];
				if (Object.keys(em.emojis).length > 0) {
					em.icon.jq = $('<img>', {
						'src': em.icon.url,
						'css': {
							'vertical-align': 'middle',
							'object-fit': 'contain',
							'width': 24,
							'height': 24
						}
					});
					(function (m) {
						m.icon.jq.on('click', function (e) {
							m.convert();
						});
					})(em);
					t.container.append(em.icon.jq);
				}
			}
		}
	}]);

	return EmojiMojis;
}();

exports.default = EmojiMojis;

var EmojiMoji = function () {
	function EmojiMoji(cb, cfg) {
		_classCallCheck(this, EmojiMoji);

		var t = this;
		t.prefix = cfg.prefix;
		t.h2k = cfg.h2k ? true : false;
		t.icon = { sc: cfg.icon, jq: undefined, url: '' };
		t.re_shortcode = new RegExp('^' + t.prefix + '([0-9a-f]{4})$');
		t.re_emojimoji = new RegExp(':' + t.prefix + '([0-9a-f]{4}):', 'mg');
		t.jq_textarea = $('#result');
		t.emojis = {};
		t.callback = cb;
		t.text = "";
	}

	_createClass(EmojiMoji, [{
		key: 'convert',
		value: function convert() {
			var t = this;
			t.text = t.jq_textarea.val();
			t.text.match(t.re_emojimoji) ? t.decode() : t.encode();
		}
	}, {
		key: 'decode',
		value: function decode() {
			var t = this;
			t.jq_textarea.val(t.text.replace(t.re_emojimoji, function (m, p1) {
				return String.fromCodePoint(parseInt(p1, 16));
			}));
		}
	}, {
		key: 'encode',
		value: function encode() {
			var t = this;
			var lines = t.text.split(/\r\n|\r|\n/);
			var p = function p(x) {
				return parseInt(x, 16);
			};
			var k = function k(x) {
				return t.emojis[x] ? t.emojis[x] : 'blank';
			};
			var nl = [];
			for (var y = 0; y < lines.length; y++) {
				var emj = [];
				for (var chi in lines[y]) {
					t.cb = function () {};
					var chr = lines[y].charCodeAt(chi);
					// スペース
					if (chr == p('0020') || chr == p('3000')) {
						emj.push('blank');

						// ひらがなはカタカナに
					} else if (t.h2k && chr >= p('3041') && chr <= p('3093')) {
						emj.push(k(chr + 96));

						// あうやつを拾う
					} else if (t.emojis[chr]) {
						emj.push(t.emojis[chr]);
					}
				}
				nl[y] = emj;
			}
			t.callback(nl);
		}
	}]);

	return EmojiMoji;
}();

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // vim:ft=javascript


var _utility = require('./utility.es6');

var _utility2 = _interopRequireDefault(_utility);

var _emoji_mojis = require('./emoji_mojis.es6');

var _emoji_mojis2 = _interopRequireDefault(_emoji_mojis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EmojiOekaki = function () {
	function EmojiOekaki(args) {
		_classCallCheck(this, EmojiOekaki);

		this.width = 11;
		this.height = 11;
		this.util = new _utility2.default();
		this.emojimojis = new _emoji_mojis2.default([{ prefix: 'klg', icon: 'klg2640', h2k: true }, { prefix: 'nrk', icon: 'nrk30ca', h2k: true }]);
	}

	_createClass(EmojiOekaki, [{
		key: 'run',
		value: function run(args) {
			var t = this;

			// ? を # に変更
			if (window.location.search) {
				var l = window.location;
				var src = l.search;
				l.href = l.href.replace(new RegExp(t.util.regex_escape(src)), '') + '#' + src.substring(1);
			}

			$('#instance_domain').on('click', function () {
				t.reset();
				t.emojimojis.init();
			});

			$('#selected_shortname').on('click', function () {
				if (t.selected_idom) {
					window.open(t.selected_idom.src);
				}
			});

			$('#bt_search_clear').on('click', function () {
				$('#text_search').val("");
			});

			$('#bt_ret_copy').on('click', function () {
				$('#result').focus().select();
				document.execCommand('copy');
			});

			$('#bt_ret_share').on('click', function () {
				window.open('https://' + t.instance_domain + '/share?text=' + encodeURI($('#result').val()));
			});

			$('#bt_reset').on('click', function () {
				t.tiles_reset();
			});

			$('#bt_load').on('click', function () {
				t.tiles_load();
			});

			$('#btn_left').on('click', function () {
				t.tiles_move('left');
			});
			$('#btn_right').on('click', function () {
				t.tiles_move('right');
			});
			$('#btn_up').on('click', function () {
				t.tiles_move('up');
			});
			$('#btn_down').on('click', function () {
				t.tiles_move('down');
			});

			$('#btn_blank').on('click', function () {
				var sc2elm = t.util.shortcode2elm();
				t.emoji_palette_select(sc2elm['blank']);
			});

			t.emojifetch_active = false;
			$('#instance_info_submit').on('click', function () {
				if (!t.emojifetch_active) {
					t.emojifetch_start();
				}
			});

			// emojimoji
			t.emojimojis.set_apply_callback(function (kmb) {
				t.tiles_reset();
				for (var y = 0; y < t.height; y++) {
					var tiles = [];
					if (!kmb[y]) {
						continue;
					}
					for (var x = 0; x < t.width; x++) {
						tiles[x] = kmb[y][x] || 'blank';
					}
					t.tiles_sc[y] = tiles;
				}
				t.tiles_from_sc();
			});

			var instance_domain = window.location.hash.substring(1) || "";
			if (instance_domain) {
				$('#instance_info_domain').val(instance_domain);
				if (!t.emojifetch_active) {
					t.emojifetch_start();
				}
				return;
			}

			t.switch_show_container('intro');
		}
	}, {
		key: 'switch_show_container',
		value: function switch_show_container(container) {
			var t = this;
			var containers = ['main', 'loading', 'intro'];
			for (var c in containers) {
				var con = containers[c];
				if (con == container) {
					$('.container_' + con).show();
				} else {
					$('.container_' + con).hide();
				}
			}
		}
	}, {
		key: 'reset',
		value: function reset() {
			var t = this;
			t.switch_show_container('intro');
		}
	}, {
		key: 'emojifetch_start',
		value: function emojifetch_start() {
			var t = this;
			t.emojifetch_active = true;
			t.switch_show_container('loading');
			t.instance_domain = $("#instance_info_domain").val();
			$.ajax({
				type: 'GET',
				url: "https://" + t.instance_domain + "/api/v1/custom_emojis",
				success: function success(json) {
					t.emojifetch_active = false;
					t.emojifetch_success(json);
				},
				error: function error(jqXHR, textStatus, errorThrown) {
					t.emojifetch_active = false;
					t.switch_show_container('intro');
					alert("取得失敗");
				}
			});
		}
	}, {
		key: 'emojifetch_success',
		value: function emojifetch_success(json) {
			var t = this;
			window.location.hash = t.instance_domain;
			$('#instance_domain').text(t.instance_domain);
			t.emoji_palette(json);
			t.tiles();
			t.switch_show_container('main');
		}
	}, {
		key: 'search_update',
		value: function search_update() {
			var t = this;
			var keyword = $('#text_search').val();
			if (keyword != t.prev_keyword) {
				if (keyword == "") {
					$('#emoji_palette img').each(function (idx, elm) {
						$(elm).show();
					});
				} else {
					$('#emoji_palette img').each(function (idx, elm) {
						if (elm.dataset.shortcode.search(keyword) != -1) {
							$(elm).show();
						} else {
							$(elm).hide();
						}
					});
				}
				t.prev_keyword = keyword;
			}
		}
	}, {
		key: 'tiles_reset',
		value: function tiles_reset() {
			var t = this;
			var blank_src = t.blank_idom.src;
			$('#tiles img').each(function (idx, elm) {
				elm.src = blank_src;
				t.tiles_sc[elm.dataset.y][elm.dataset.x] = 'blank';
			});
			t.result();
		}
	}, {
		key: 'tiles_update',
		value: function tiles_update(tile_elms) {
			var t = this;
			t.tiles_reset();
			$('#tiles img').each(function (idx, elm) {
				var x = elm.dataset.x,
				    y = elm.dataset.y;
				if (!tile_elms[y]) {
					return;
				}
				if (!tile_elms[y][x]) {
					return;
				}
				var te = tile_elms[y][x];
				elm.src = te.src;
				elm.dataset.shortcode = te.dataset.shortcode;
				t.tiles_sc[elm.dataset.y][elm.dataset.x] = te.dataset.shortcode;
			});
			t.result();
		}
	}, {
		key: 'tiles_from_sc',
		value: function tiles_from_sc() {
			var t = this;
			var sc2elm = t.util.shortcode2elm();
			var te = [];
			for (var y = 0; y < t.height; y++) {
				var tex = [];
				for (var x = 0; x < t.width; x++) {
					tex[x] = sc2elm[t.tiles_sc[y][x]];
				}
				te.push(tex);
			}
			t.tiles_update(te);
		}
	}, {
		key: 'tiles_move',
		value: function tiles_move(dir) {
			var t = this;
			var sc = t.tiles_sc;
			if (dir == "left") {
				for (var y in sc) {
					sc[y].push(sc[y].shift());
				}
			}
			if (dir == "right") {
				for (var _y in sc) {
					sc[_y].unshift(sc[_y].pop());
				}
			}
			if (dir == "up") {
				sc.push(sc.shift());
			}
			if (dir == "down") {
				sc.unshift(sc.pop());
			}
			t.tiles_from_sc();
		}
	}, {
		key: 'tiles',
		value: function tiles() {
			var t = this;
			t.tiles_sc = [];
			$('#tiles').text('');

			for (var y = 0; y < t.height; y++) {
				var scr = [];
				for (var x = 0; x < t.width; x++) {
					var blank = $(t.blank_idom).clone();
					blank.css({
						'border': '2px solid #333333',
						'margin': '1px'
					});
					$(blank).attr({
						'data-x': x,
						'data-y': y
					});
					$('#tiles').append(blank);
					scr[x] = 'blank';
				}
				$('#tiles').append($('<br>'));
				t.tiles_sc[y] = scr;
			}
			$('#tiles img').on('click', function (e) {
				var tg = e.target;
				var x = tg.dataset.x,
				    y = tg.dataset.y;
				if (!t.selected_idom) {
					return;
				}
				if (tg.src == t.selected_idom.src) {
					$(tg).attr({ src: t.blank_idom.src });
					t.tiles_sc[y][x] = 'blank';
				} else {
					$(tg).attr({ src: t.selected_idom.src });
					t.tiles_sc[y][x] = t.selected_idom.dataset.shortcode;
				}
				t.result();
			});
			if (t.search_update_interval) {
				clearInterval(t.search_update_interval);
			}
			t.search_update_interval = setInterval(function () {
				t.search_update();
			}, 500);
		}
	}, {
		key: 'tiles_load',
		value: function tiles_load() {
			var t = this;
			var sc2elm = t.util.shortcode2elm();
			var ntile = [];
			var lines = $('#result').val().split(/\r\n|\r|\n/);
			for (var y = 0; y < (lines.length > t.height ? t.height : lines.length); y++) {
				var line = lines[y].split(/\u200B| /);
				var ntilex = [];
				for (var x = 0; x < (line.length > t.width ? t.width : line.length); x++) {
					var sc = line[x].replace(/^:/, '').replace(/:$/, '');
					var elm = sc2elm[line[x].replace(/^:/, '').replace(/:$/, '')];
					if (!elm) {
						continue;
					}
					ntilex[x] = elm;
				}
				ntile[y] = ntilex;
			}
			t.tiles_update(ntile);
		}
	}, {
		key: 'emoji_palette',
		value: function emoji_palette(emoji) {
			var t = this;
			$('#emoji_palette').text("");

			emoji.sort(function (a, b) {
				if (a.shortcode < b.shortcode) {
					return -1;
				} else if (a.shortcode > b.shortcode) {
					return 1;
				}
				return 0;
			});

			for (var i = 0; i < emoji.length; i++) {
				//	console.log(emoji[i]);
				var ijq = $('<img>', {
					src: emoji[i].url,
					'data-shortcode': emoji[i].shortcode,
					css: {
						'border': '2px solid rgb(57, 63, 79)',
						'object-fit': 'contain',
						'width': 32,
						'height': 32
					}
				});
				$('#emoji_palette').append(ijq);
				if (emoji[i].shortcode == 'blank') {
					t.blank_idom = ijq[0];
				}
			}
			if (!t.blank_idom) {
				alert("このインスタンスには :blank: がないため使用できません");
			}
			$('#emoji_palette img').on('click', function (e) {
				t.emoji_palette_select(e.target);
			});

			// emojimoji
			t.emojimojis.load($('#emoji_palette img'));
		}
	}, {
		key: 'emoji_palette_select',
		value: function emoji_palette_select(dom) {
			var t = this;
			if (dom == t.selected_idom) {
				return;
			}
			$('#selected_shortname').text(':' + dom.dataset.shortcode + ':');
			$(dom).css('border', '2px solid #FFFFFF');
			t.selected_idom = dom;
			if (t.prev_selected_idom) {
				$(t.prev_selected_idom).css('border', '2px solid rgb(57, 63, 79)');
			}
			t.prev_selected_idom = dom;
		}
	}, {
		key: 'result',
		value: function result() {
			var t = this;
			var nr = [];
			var seen_y = false;
			for (var y = t.height - 1; y >= 0; y--) {
				var nc = [];
				var seen_x = false;
				for (var x = t.width - 1; x >= 0; x--) {
					var ts = ':' + t.tiles_sc[y][x] + ':';
					if (ts != ':blank:') {
						seen_x = true;
					}
					if (seen_x) {
						nc.push(ts);
					}
				}
				if (nc.length > 0) {
					seen_y = true;
				} else {
					nc.push('\u200B');
				}

				if (seen_y) {
					nr.push(nc.reverse());
				}
			}
			var lines = [];
			for (var _y2 = nr.length - 1; _y2 >= 0; _y2--) {
				lines.push(nr[_y2].join('\u200B'));
			}
			var buf = lines.join("\n");
			var buflen = buf.length;
			var bgcolor = '#000000';
			if (buflen > 500) {
				bgcolor = '#FF0000';
			}
			$('.cont_result_count').css('background-color', bgcolor);
			$('#result_count').text(buflen);
			$('#result').val(buf);
		}
	}]);

	return EmojiOekaki;
}();

exports.default = EmojiOekaki;

},{"./emoji_mojis.es6":2,"./utility.es6":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// vim:ft=javascript

var Utility = function () {
	function Utility() {
		_classCallCheck(this, Utility);
	}

	_createClass(Utility, [{
		key: "regex_escape",
		value: function regex_escape(str) {
			return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
		}
	}, {
		key: "shortcode2elm",
		value: function shortcode2elm() {
			var sc2elm = {};
			$('#emoji_palette img').each(function (idx, elm) {
				sc2elm[elm.dataset.shortcode] = elm;
			});
			return sc2elm;
		}
	}]);

	return Utility;
}();

exports.default = Utility;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczYvYXBwLmVzNiIsImVzNi9lbW9qaV9tb2ppcy5lczYiLCJlczYvZW1vamlfb2VrYWtpLmVzNiIsImVzNi91dGlsaXR5LmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDRUE7Ozs7OztBQUNBLE9BQU8sd0JBQVAsMkIsQ0FIQTs7Ozs7Ozs7Ozs7OztBQ0FBOztJQUVxQixVO0FBQ3BCLHFCQUFZLEdBQVosRUFBaUI7QUFBQTs7QUFDaEIsTUFBTSxJQUFFLElBQVI7QUFDQSxJQUFFLGVBQUYsR0FBa0IsR0FBbEI7QUFDQSxJQUFFLEVBQUYsR0FBSyxZQUFVLENBQUUsQ0FBakI7QUFDQSxJQUFFLElBQUY7QUFDQTs7Ozt5QkFDTTtBQUNOLE9BQU0sSUFBRSxJQUFSO0FBQ0EsS0FBRSxTQUFGLEdBQVksRUFBRSxxQ0FBRixDQUFaO0FBQ0EsS0FBRSxTQUFGLENBQVksS0FBWjtBQUNBLEtBQUUsR0FBRixHQUFNLEVBQU47QUFDQSxRQUFJLElBQUksQ0FBUixJQUFhLEVBQUUsZUFBZixFQUFnQztBQUMvQixNQUFFLEdBQUYsQ0FBTSxDQUFOLElBQVMsSUFBSSxTQUFKLENBQWMsVUFBUyxDQUFULEVBQVc7QUFBRSxPQUFFLEVBQUYsQ0FBSyxDQUFMO0FBQVMsS0FBcEMsRUFBcUMsRUFBRSxlQUFGLENBQWtCLENBQWxCLENBQXJDLENBQVQ7QUFDQTtBQUNEOzs7cUNBQ2tCLEUsRUFBSTtBQUN0QixRQUFLLEVBQUwsR0FBUSxFQUFSO0FBQ0E7Ozt1QkFDSSxTLEVBQVc7QUFDZixPQUFNLElBQUUsSUFBUjtBQUNBLGFBQVUsSUFBVixDQUFlLFVBQVMsR0FBVCxFQUFhLEdBQWIsRUFBaUI7QUFDL0IsUUFBTSxLQUFHLElBQUksT0FBSixDQUFZLFNBQXJCO0FBQ0EsU0FBSSxJQUFJLENBQVIsSUFBYSxFQUFFLEdBQWYsRUFBb0I7QUFDbkIsU0FBTSxLQUFHLEVBQUUsR0FBRixD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bUIsSUFBbkIsQ0FBd0IsTUFBeEI7QUFDQSxLQUFFLFNBQUYsRUFBYSxHQUFiLENBQWlCLEdBQWpCO0FBQ0E7Ozs7OztrQkE3VW1CLFc7Ozs7Ozs7Ozs7Ozs7QUNKckI7O0lBRXFCLE87Ozs7Ozs7K0JBQ1AsRyxFQUFLO0FBQ2pCLFVBQU8sSUFBSSxPQUFKLENBQVksNEJBQVosRUFBMEMsTUFBMUMsQ0FBUDtBQUNBOzs7a0NBQ2U7QUFDZixPQUFJLFNBQU8sRUFBWDtBQUNBLEtBQUUsb0JBQUYsRUFBd0IsSUFBeEIsQ0FBNkIsVUFBUyxHQUFULEVBQWEsR0FBYixFQUFrQjtBQUM5QyxXQUFPLElBQUksT0FBSixDQUFZLFNBQW5CLElBQThCLEdBQTlCO0FBQ0EsSUFGRDtBQUdBLFVBQU8sTUFBUDtBQUNBOzs7Ozs7a0JBVm1CLE8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gdmltOmZ0PWphdmFzY3JpcHRcblxuaW1wb3J0IEVtb2ppT2VrYWtpIGZyb20gJy4vZW1vamlfb2VrYWtpLmVzNidcbndpbmRvd1snTXN0ZG5DdXN0b21FbW9qaU9la2FraSddPUVtb2ppT2VrYWtpO1xuXG4iLCIvLyB2aW06ZnQ9amF2YXNjcmlwdFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbW9qaU1vamlzIHtcblx0Y29uc3RydWN0b3IoY2ZnKSB7XG5cdFx0Y29uc3QgdD10aGlzO1xuXHRcdHQuc3RhcnR1cF9jb25maWdzPWNmZztcblx0XHR0LmNiPWZ1bmN0aW9uKCl7fVxuXHRcdHQuaW5pdCgpO1xuXHR9XG5cdGluaXQoKSB7XG5cdFx0Y29uc3QgdD10aGlzO1xuXHRcdHQuY29udGFpbmVyPSQoJy5jb250X3JldF9jdHJsIC5sZWZ0IC5lbW9qaW1vamlfYnRuJyk7XG5cdFx0dC5jb250YWluZXIuZW1wdHkoKTtcblx0XHR0LmVtcz1bXTtcblx0XHRmb3IobGV0IGkgaW4gdC5zdGFydHVwX2NvbmZpZ3MpIHtcblx0XHRcdHQuZW1zW2ldPW5ldyBFbW9qaU1vamkoZnVuY3Rpb24ocil7IHQuY2IocikgfSx0LnN0YXJ0dXBfY29uZmlnc1tpXSk7XG5cdFx0fVxuXHR9XG5cdHNldF9hcHBseV9jYWxsYmFjayhjYikge1xuXHRcdHRoaXMuY2I9Y2I7XG5cdH1cblx0bG9hZChlbW9qaXNfanEpIHtcblx0XHRjb25zdCB0PXRoaXM7XG5cdFx0ZW1vamlzX2pxLmVhY2goZnVuY3Rpb24oaWR4LGVsbSl7XG5cdFx0XHRjb25zdCBzYz1lbG0uZGF0YXNldC5zaG9ydGNvZGU7XG5cdFx0XHRmb3IobGV0IGkgaW4gdC5lbXMpIHtcblx0XHRcdFx0Y29uc3QgZW09dC5lbXNbaV07XG5cdFx0XHRcdGNvbnN0IG1hPXNjLm1hdGNoKGVtLnJlX3Nob3J0Y29kZSk7XG5cdFx0XHRcdGlmKG1hKSB7XG5cdFx0XHRcdFx0aWYoc2M9PWVtLmljb24uc2MpIHsgZW0uaWNvbi51cmw9ZWxtLnNyYyB9XG5cdFx0XHRcdFx0ZW0uZW1vamlzW3BhcnNlSW50KG1hWzFdLDE2KV09c2M7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0XHRmb3IobGV0IGkgaW4gdC5lbXMpIHtcblx0XHRcdGNvbnN0IGVtPXQuZW1zW2ldO1xuXHRcdFx0aWYoT2JqZWN0LmtleXMoZW0uZW1vamlzKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGVtLmljb24uanE9JCgnPGltZz4nLHtcblx0XHRcdFx0XHQnc3JjJzogZW0uaWNvbi51cmwsXG5cdFx0XHRcdFx0J2Nzcyc6IHtcblx0XHRcdFx0XHRcdCd2ZXJ0aWNhbC1hbGlnbic6ICdtaWRkbGUnLFxuXHRcdFx0XHRcdFx0J29iamVjdC1maXQnOiAnY29udGFpbicsXG5cdFx0XHRcdFx0XHQnd2lkdGgnOiAgMjQsXG5cdFx0XHRcdFx0XHQnaGVpZ2h0JzogMjQsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0KGZ1bmN0aW9uKG0pe1xuXHRcdFx0XHRcdG0uaWNvbi5qcS5vbignY2xpY2snLGZ1bmN0aW9uKGUpIHsgbS5jb252ZXJ0KCkgfSk7XG5cdFx0XHRcdH0pKGVtKTtcblx0XHRcdFx0dC5jb250YWluZXIuYXBwZW5kKGVtLmljb24uanEpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5jbGFzcyBFbW9qaU1vamkge1xuXHRjb25zdHJ1Y3RvcihjYixjZmcpIHtcblx0XHRjb25zdCB0PXRoaXM7XG5cdFx0dC5wcmVmaXggPSBjZmcucHJlZml4O1xuXHRcdHQuaDJrICAgID0gY2ZnLmgyayA/IHRydWUgOiBmYWxzZTtcblx0XHR0Lmljb24gICA9IHsgc2M6IGNmZy5pY29uLCBqcTogdW5kZWZpbmVkLCB1cmw6ICcnIH07XG5cdFx0dC5yZV9zaG9ydGNvZGUgPSBuZXcgUmVnRXhwKCdeJyt0LnByZWZpeCsnKFswLTlhLWZdezR9KSQnKTtcblx0XHR0LnJlX2Vtb2ppbW9qaSA9IG5ldyBSZWdFeHAoJzonK3QucHJlZml4KycoWzAtOWEtZl17NH0pOicsJ21nJyk7XG5cdFx0dC5qcV90ZXh0YXJlYSAgPSAkKCcjcmVzdWx0Jyk7XG5cdFx0dC5lbW9qaXMgICA9IHt9O1xuXHRcdHQuY2FsbGJhY2sgPSBjYjtcblx0XHR0LnRleHQ9XCJcIjtcblx0fVxuXHRjb252ZXJ0KCkge1xuXHRcdGNvbnN0IHQ9dGhpcztcblx0XHR0LnRleHQ9dC5qcV90ZXh0YXJlYS52YWwoKTtcblx0XHR0LnRleHQubWF0Y2godC5yZV9lbW9qaW1vamkpID8gdC5kZWNvZGUoKSA6IHQuZW5jb2RlKCk7XG5cdH1cblx0ZGVjb2RlKCl7XG5cdFx0Y29uc3QgdD10aGlzO1xuXHRcdHQuanFfdGV4dGFyZWEudmFsKCB0LnRleHQucmVwbGFjZSggdC5yZV9lbW9qaW1vamksKG0scDEpID0+IHtcblx0XHRcdHJldHVybiBTdHJpbmcuZnJvbUNvZGVQb2ludChwYXJzZUludChwMSwxNikpO1xuXHRcdH0pKTtcblx0fVxuXHRlbmNvZGUoKXtcblx0XHRjb25zdCB0PXRoaXM7XG5cdFx0Y29uc3QgbGluZXM9dC50ZXh0LnNwbGl0KC9cXHJcXG58XFxyfFxcbi8pO1xuXHRcdGNvbnN0IHA9ZnVuY3Rpb24oeCkgeyByZXR1cm4gcGFyc2VJbnQoeCwxNikgfTtcblx0XHRjb25zdCBrPWZ1bmN0aW9uKHgpIHsgcmV0dXJuIHQuZW1vamlzW3hdID8gdC5lbW9qaXNbeF0gOiAnYmxhbmsnIH07XG5cdFx0bGV0IG5sPVtdO1xuXHRcdGZvcihsZXQgeT0wOyB5PGxpbmVzLmxlbmd0aDsgeSsrKSB7XG5cdFx0XHRsZXQgZW1qPVtdO1xuXHRcdFx0Zm9yKGxldCBjaGkgaW4gbGluZXNbeV0pIHtcblx0XHRcdFx0dC5jYj1mdW5jdGlvbigpe31cblx0XHRcdFx0bGV0IGNocj1saW5lc1t5XS5jaGFyQ29kZUF0KGNoaSk7XG5cdFx0XHRcdC8vIOOCueODmuODvOOCuVxuXHRcdFx0XHRpZiAoY2hyID09IHAoJzAwMjAnKSB8fCBjaHIgPT0gcCgnMzAwMCcpKSB7XG5cdFx0XHRcdFx0ZW1qLnB1c2goJ2JsYW5rJyk7XG5cblx0XHRcdFx0Ly8g44Gy44KJ44GM44Gq44Gv44Kr44K/44Kr44OK44GrXG5cdFx0XHRcdH0gZWxzZSBpZiAoIHQuaDJrICYmICggY2hyPj1wKCczMDQxJykgJiYgY2hyPD1wKCczMDkzJykgKSApIHtcblx0XHRcdFx0XHRlbWoucHVzaChrKGNocis5NikpO1xuXG5cdFx0XHRcdC8vIOOBguOBhuOChOOBpOOCkuaLvuOBhlxuXHRcdFx0XHR9IGVsc2UgaWYoIHQuZW1vamlzW2Nocl0gKSB7XG5cdFx0XHRcdFx0ZW1qLnB1c2godC5lbW9qaXNbY2hyXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG5sW3ldPWVtajtcblx0XHR9XG5cdFx0dC5jYWxsYmFjayhubCk7XG5cdH1cbn1cblxuXG4iLCIvLyB2aW06ZnQ9amF2YXNjcmlwdFxuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi91dGlsaXR5LmVzNidcbmltcG9ydCBFbW9qaU1vamlzIGZyb20gJy4vZW1vamlfbW9qaXMuZXM2J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbW9qaU9la2FraSB7XG5cdGNvbnN0cnVjdG9yKGFyZ3Mpe1xuXHRcdHRoaXMud2lkdGggID0gMTE7XG5cdFx0dGhpcy5oZWlnaHQgPSAxMTtcblx0XHR0aGlzLnV0aWw9bmV3IFV0aWxpdHkoKTtcblx0XHR0aGlzLmVtb2ppbW9qaXM9bmV3IEVtb2ppTW9qaXMoW1xuXHRcdFx0eyBwcmVmaXg6ICdrbGcnLCBpY29uOiAna2xnMjY0MCcsIGgyazogdHJ1ZSB9LFxuXHRcdFx0eyBwcmVmaXg6ICducmsnLCBpY29uOiAnbnJrMzBjYScsIGgyazogdHJ1ZSB9LFxuXHRcdF0pO1xuXHR9XG5cblx0cnVuKGFyZ3Mpe1xuXHRcdGxldCB0PXRoaXM7XG5cblx0XHQvLyA/IOOCkiAjIOOBq+WkieabtFxuXHRcdGlmKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpIHtcblx0XHRcdGxldCBsPXdpbmRvdy5sb2NhdGlvbjtcblx0XHRcdGxldCBzcmM9bC5zZWFyY2g7XG5cdFx0XHRsLmhyZWY9bC5ocmVmLnJlcGxhY2UobmV3IFJlZ0V4cCh0LnV0aWwucmVnZXhfZXNjYXBlKHNyYykpLCcnKSsnIycrc3JjLnN1YnN0cmluZygxKTtcblx0XHR9XG5cblx0XHQkKCcjaW5zdGFuY2VfZG9tYWluJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcblx0XHRcdHQucmVzZXQoKTtcblx0XHRcdHQuZW1vamltb2ppcy5pbml0KCk7XG5cdFx0fSk7XG5cblx0XHQkKCcjc2VsZWN0ZWRfc2hvcnRuYW1lJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcblx0XHRcdGlmKHQuc2VsZWN0ZWRfaWRvbSkge1xuXHRcdFx0XHR3aW5kb3cub3Blbih0LnNlbGVjdGVkX2lkb20uc3JjKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdCQoJyNidF9zZWFyY2hfY2xlYXInKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnI3RleHRfc2VhcmNoJykudmFsKFwiXCIpO1xuXHRcdH0pO1xuXG5cdFx0JCgnI2J0X3JldF9jb3B5Jykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcblx0XHRcdCQoJyNyZXN1bHQnKS5mb2N1cygpLnNlbGVjdCgpO1xuXHRcdFx0ZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcblx0XHR9KTtcblxuXHRcdCQoJyNidF9yZXRfc2hhcmUnKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuXHRcdFx0d2luZG93Lm9wZW4oJ2h0dHBzOi8vJyt0Lmluc3RhbmNlX2RvbWFpbisnL3NoYXJlP3RleHQ9JytlbmNvZGVVUkkoJCgnI3Jlc3VsdCcpLnZhbCgpKSk7XG5cdFx0fSk7XG5cblx0XHQkKCcjYnRfcmVzZXQnKS5vbignY2xpY2snLGZ1bmN0aW9uKCkgeyB0LnRpbGVzX3Jlc2V0KCkgfSk7XG5cblx0XHQkKCcjYnRfbG9hZCcpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7IHQudGlsZXNfbG9hZCgpIH0pO1xuXG5cdFx0JCgnI2J0bl9sZWZ0Jykub24oICdjbGljaycsZnVuY3Rpb24oKSB7IHQudGlsZXNfbW92ZSgnbGVmdCcpICB9KTtcblx0XHQkKCcjYnRuX3JpZ2h0Jykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHsgdC50aWxlc19tb3ZlKCdyaWdodCcpIH0pO1xuXHRcdCQoJyNidG5fdXAnKS5vbiggICAnY2xpY2snLGZ1bmN0aW9uKCkgeyB0LnRpbGVzX21vdmUoJ3VwJykgICAgfSk7XG5cdFx0JCgnI2J0bl9kb3duJykub24oICdjbGljaycsZnVuY3Rpb24oKSB7IHQudGlsZXNfbW92ZSgnZG93bicpICB9KTtcblxuXHRcdCQoJyNidG5fYmxhbmsnKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuXHRcdFx0bGV0IHNjMmVsbT10LnV0aWwuc2hvcnRjb2RlMmVsbSgpO1xuXHRcdFx0dC5lbW9qaV9wYWxldHRlX3NlbGVjdChzYzJlbG1bJ2JsYW5rJ10pO1xuXHRcdH0pO1xuXG5cdFx0dC5lbW9qaWZldGNoX2FjdGl2ZT1mYWxzZTtcblx0XHQkKCcjaW5zdGFuY2VfaW5mb19zdWJtaXQnKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYoIXQuZW1vamlmZXRjaF9hY3RpdmUpIHsgdC5lbW9qaWZldGNoX3N0YXJ0KCkgfVxuXHRcdH0pO1xuXG5cdFx0Ly8gZW1vamltb2ppXG5cdFx0dC5lbW9qaW1vamlzLnNldF9hcHBseV9jYWxsYmFjayhmdW5jdGlvbihrbWIpe1xuXHRcdFx0dC50aWxlc19yZXNldCgpO1xuXHRcdFx0Zm9yKGxldCB5PTA7IHk8dC5oZWlnaHQ7IHkrKykge1xuXHRcdFx0XHRsZXQgdGlsZXM9W107XG5cdFx0XHRcdGlmKCFrbWJbeV0pIHsgY29udGludWUgfVxuXHRcdFx0XHRmb3IobGV0IHg9MDsgeDx0LndpZHRoOyB4KyspIHtcblx0XHRcdFx0XHR0aWxlc1t4XT1rbWJbeV1beF0gfHwgJ2JsYW5rJztcblx0XHRcdFx0fVxuXHRcdFx0XHR0LnRpbGVzX3NjW3ldPXRpbGVzO1xuXHRcdFx0fVxuXHRcdFx0dC50aWxlc19mcm9tX3NjKCk7XG5cdFx0fSk7XG5cblx0XHRsZXQgaW5zdGFuY2VfZG9tYWluPXdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSB8fCBcIlwiO1xuXHRcdGlmKCBpbnN0YW5jZV9kb21haW4gKSB7XG5cdFx0XHQkKCcjaW5zdGFuY2VfaW5mb19kb21haW4nKS52YWwoaW5zdGFuY2VfZG9tYWluKTtcblx0XHRcdGlmKCF0LmVtb2ppZmV0Y2hfYWN0aXZlKSB7IHQuZW1vamlmZXRjaF9zdGFydCgpIH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0LnN3aXRjaF9zaG93X2NvbnRhaW5lcignaW50cm8nKTtcblx0fVxuXHRzd2l0Y2hfc2hvd19jb250YWluZXIoY29udGFpbmVyKSB7XG5cdFx0bGV0IHQ9dGhpcztcblx0XHRsZXQgY29udGFpbmVycz1bJ21haW4nLCdsb2FkaW5nJywnaW50cm8nXTtcblx0XHRmb3IoIGxldCBjIGluIGNvbnRhaW5lcnMpIHtcblx0XHRcdGxldCBjb249Y29udGFpbmVyc1tjXTtcblx0XHRcdGlmKGNvbj09Y29udGFpbmVyKSB7XG5cdFx0XHRcdCQoJy5jb250YWluZXJfJytjb24pLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJy5jb250YWluZXJfJytjb24pLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmVzZXQoKSB7XG5cdFx0bGV0IHQ9dGhpcztcblx0XHR0LnN3aXRjaF9zaG93X2NvbnRhaW5lcignaW50cm8nKTtcblx0fVxuXHRlbW9qaWZldGNoX3N0YXJ0KCkge1xuXHRcdGxldCB0PXRoaXM7XG5cdFx0dC5lbW9qaWZldGNoX2FjdGl2ZT10cnVlO1xuXHRcdHQuc3dpdGNoX3Nob3dfY29udGFpbmVyKCdsb2FkaW5nJyk7XG5cdFx0dC5pbnN0YW5jZV9kb21haW49JChcIiNpbnN0YW5jZV9pbmZvX2RvbWFpblwiKS52YWwoKTtcblx0XHQkLmFqYXgoe1xuXHRcdFx0dHlwZTogJ0dFVCcsXG5cdFx0XHR1cmw6IFwiaHR0cHM6Ly9cIit0Lmluc3RhbmNlX2RvbWFpbitcIi9hcGkvdjEvY3VzdG9tX2Vtb2ppc1wiLFxuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24oanNvbikge1xuXHRcdFx0XHR0LmVtb2ppZmV0Y2hfYWN0aXZlPWZhbHNlO1xuXHRcdFx0XHR0LmVtb2ppZmV0Y2hfc3VjY2Vzcyhqc29uKTtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKXtcblx0XHRcdFx0dC5lbW9qaWZldGNoX2FjdGl2ZT1mYWxzZTtcblx0XHRcdFx0dC5zd2l0Y2hfc2hvd19jb250YWluZXIoJ2ludHJvJyk7XG5cdFx0XHRcdGFsZXJ0KFwi5Y+W5b6X5aSx5pWXXCIpO1xuXG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0ZW1vamlmZXRjaF9zdWNjZXNzKGpzb24pIHtcblx0XHRsZXQgdD10aGlzO1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoPXQuaW5zdGFuY2VfZG9tYWluO1xuXHRcdCQoJyNpbnN0YW5jZV9kb21haW4nKS50ZXh0KHQuaW5zdGFuY2VfZG9tYWluKTtcblx0XHR0LmVtb2ppX3BhbGV0dGUoanNvbik7XG5cdFx0dC50aWxlcygpO1xuXHRcdHQuc3dpdGNoX3Nob3dfY29udGFpbmVyKCdtYWluJyk7XG5cdH1cblx0c2VhcmNoX3VwZGF0ZSgpIHtcblx0XHRsZXQgdD10aGlzO1xuXHRcdGxldCBrZXl3b3JkPSQoJyN0ZXh0X3NlYXJjaCcpLnZhbCgpO1xuXHRcdGlmKGtleXdvcmQgIT0gdC5wcmV2X2tleXdvcmQpIHtcblx0XHRcdGlmKGtleXdvcmQgPT0gXCJcIikge1xuXHRcdFx0XHQkKCcjZW1vamlfcGFsZXR0ZSBpbWcnKS5lYWNoKGZ1bmN0aW9uKGlkeCxlbG0pIHsgJChlbG0pLnNob3coKSB9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNlbW9qaV9wYWxldHRlIGltZycpLmVhY2goZnVuY3Rpb24oaWR4LGVsbSkge1xuXHRcdFx0XHRcdGlmKGVsbS5kYXRhc2V0LnNob3J0Y29kZS5zZWFyY2goa2V5d29yZCkhPS0xKSB7XG5cdFx0XHRcdFx0XHQkKGVsbSkuc2hvdygpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkKGVsbSkuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHR0LnByZXZfa2V5d29yZD1rZXl3b3JkO1xuXHRcdH1cblx0fVxuXHR0aWxlc19yZXNldCgpIHtcblx0XHRsZXQgdD10aGlzO1xuXHRcdGxldCBibGFua19zcmM9dC5ibGFua19pZG9tLnNyYztcblx0XHQkKCcjdGlsZXMgaW1nJykuZWFjaChmdW5jdGlvbihpZHgsZWxtKSB7XG5cdFx0XHRlbG0uc3JjPWJsYW5rX3NyYztcblx0XHRcdHQudGlsZXNfc2NbZWxtLmRhdGFzZXQueV1bZWxtLmRhdGFzZXQueF09J2JsYW5rJztcblx0XHR9KTtcblx0XHR0LnJlc3VsdCgpO1xuXHR9XG5cdHRpbGVzX3VwZGF0ZSh0aWxlX2VsbXMpIHtcblx0XHRsZXQgdD10aGlzO1xuXHRcdHQudGlsZXNfcmVzZXQoKTtcblx0XHQkKCcjdGlsZXMgaW1nJykuZWFjaChmdW5jdGlvbihpZHgsZWxtKSB7XG5cdFx0XHRsZXQgeD1lbG0uZGF0YXNldC54LCB5PWVsbS5kYXRhc2V0Lnk7XG5cdFx0XHRpZighdGlsZV9lbG1zW3ldKSB7IHJldHVybiB9XG5cdFx0XHRpZighdGlsZV9lbG1zW3ldW3hdKSB7IHJldHVybiB9XG5cdFx0XHRsZXQgdGU9dGlsZV9lbG1zW3ldW3hdO1xuXHRcdFx0ZWxtLnNyYz10ZS5zcmM7XG5cdFx0XHRlbG0uZGF0YXNldC5zaG9ydGNvZGU9dGUuZGF0YXNldC5zaG9ydGNvZGU7XG5cdFx0XHR0LnRpbGVzX3NjW2VsbS5kYXRhc2V0LnldW2VsbS5kYXRhc2V0LnhdPXRlLmRhdGFzZXQuc2hvcnRjb2RlO1xuXHRcdH0pO1xuXHRcdHQucmVzdWx0KCk7XG5cdH1cblx0dGlsZXNfZnJvbV9zYygpe1xuXHRcdGxldCB0PXRoaXM7XG5cdFx0bGV0IHNjMmVsbT10LnV0aWwuc2hvcnRjb2RlMmVsbSgpO1xuXHRcdGxldCB0ZT1bXTtcblx0XHRmb3IobGV0IHk9MDsgeTx0LmhlaWdodDsgeSsrKSB7XG5cdFx0XHRsZXQgdGV4PVtdO1xuXHRcdFx0Zm9yKGxldCB4PTA7IHg8dC53aWR0aDsgeCsrKSB7IHRleFt4XT1zYzJlbG1bdC50aWxlc19zY1t5XVt4XV0gfVxuXHRcdFx0dGUucHVzaCh0ZXgpO1xuXHRcdH1cblx0XHR0LnRpbGVzX3VwZGF0ZSh0ZSk7XG5cdH1cblx0dGlsZXNfbW92ZShkaXIpe1xuXHRcdGxldCB0PXRoaXM7XG5cdFx0bGV0IHNjPXQudGlsZXNfc2M7XG5cdFx0aWYoZGlyPT1cImxlZnRcIikgeyBmb3IobGV0IHkgaW4gc2MpIHsgc2NbeV0ucHVzaChzY1t5XS5zaGlmdCgpKSB9fVxuXHRcdGlmKGRpcj09XCJyaWdodFwiKXsgZm9yKGxldCB5IGluIHNjKSB7IHNjW3ldLnVuc2hpZnQoc2NbeV0ucG9wKCkpIH19XG5cdFx0aWYoZGlyPT1cInVwXCIpICAgeyBzYy5wdXNoKHNjLnNoaWZ0KCkpIH1cblx0XHRpZihkaXI9PVwiZG93blwiKSB7IHNjLnVuc2hpZnQoc2MucG9wKCkpIH1cblx0XHR0LnRpbGVzX2Zyb21fc2MoKTtcblx0fVxuXHR0aWxlcygpe1xuXHRcdGxldCB0PXRoaXM7XG5cdFx0dC50aWxlc19zYz1bXTtcblx0XHQkKCcjdGlsZXMnKS50ZXh0KCcnKTtcblxuXHRcdGZvcihsZXQgeT0wOyB5PHQuaGVpZ2h0OyB5KyspIHtcblx0XHRcdGxldCBzY3I9W107XG5cdFx0XHRmb3IobGV0IHg9MDsgeDx0LndpZHRoOyB4KyspIHtcblx0XHRcdFx0bGV0IGJsYW5rPSQodC5ibGFua19pZG9tKS5jbG9uZSgpO1xuXHRcdFx0XHRibGFuay5jc3Moe1xuXHRcdFx0XHRcdCdib3JkZXInOicycHggc29saWQgIzMzMzMzMycsXG5cdFx0XHRcdFx0J21hcmdpbic6JzFweCcsXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKGJsYW5rKS5hdHRyKHtcblx0XHRcdFx0XHQnZGF0YS14Jzp4LFxuXHRcdFx0XHRcdCdkYXRhLXknOnksXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCcjdGlsZXMnKS5hcHBlbmQoIGJsYW5rICk7XG5cdFx0XHRcdHNjclt4XT0nYmxhbmsnO1xuXHRcdFx0fVxuXHRcdFx0JCgnI3RpbGVzJykuYXBwZW5kKCAkKCc8YnI+JykgKTtcblx0XHRcdHQudGlsZXNfc2NbeV09c2NyO1xuXHRcdH1cblx0XHQkKCcjdGlsZXMgaW1nJykub24oJ2NsaWNrJyxmdW5jdGlvbihlKSB7XG5cdFx0XHRsZXQgdGc9ZS50YXJnZXQ7XG5cdFx0XHRsZXQgeD10Zy5kYXRhc2V0LngsIHk9dGcuZGF0YXNldC55O1xuXHRcdFx0aWYoIXQuc2VsZWN0ZWRfaWRvbSkgeyByZXR1cm4gfVxuXHRcdFx0aWYgKCB0Zy5zcmMgPT0gdC5zZWxlY3RlZF9pZG9tLnNyYyApIHtcblx0XHRcdFx0JCh0ZykuYXR0cih7IHNyYzogdC5ibGFua19pZG9tLnNyYyB9KTtcblx0XHRcdFx0dC50aWxlc19zY1t5XVt4XT0nYmxhbmsnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCh0ZykuYXR0cih7IHNyYzogdC5zZWxlY3RlZF9pZG9tLnNyYyB9KTtcblx0XHRcdFx0dC50aWxlc19zY1t5XVt4XT10LnNlbGVjdGVkX2lkb20uZGF0YXNldC5zaG9ydGNvZGU7XG5cdFx0XHR9XG5cdFx0XHR0LnJlc3VsdCgpO1xuXHRcdH0pO1xuXHRcdGlmKHQuc2VhcmNoX3VwZGF0ZV9pbnRlcnZhbCkgeyBjbGVhckludGVydmFsKHQuc2VhcmNoX3VwZGF0ZV9pbnRlcnZhbCk7IH1cblx0XHR0LnNlYXJjaF91cGRhdGVfaW50ZXJ2YWw9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7IHQuc2VhcmNoX3VwZGF0ZSgpIH0sNTAwKTtcblx0fVxuXHR0aWxlc19sb2FkKCkge1xuXHRcdGxldCB0PXRoaXM7XG5cdFx0bGV0IHNjMmVsbT10LnV0aWwuc2hvcnRjb2RlMmVsbSgpO1xuXHRcdGxldCBudGlsZT1bXTtcblx0XHRsZXQgbGluZXM9JCgnI3Jlc3VsdCcpLnZhbCgpLnNwbGl0KC9cXHJcXG58XFxyfFxcbi8pO1xuXHRcdGZvcihsZXQgeT0wO3kgPCAoKGxpbmVzLmxlbmd0aCA+IHQuaGVpZ2h0KSA/IHQuaGVpZ2h0IDogbGluZXMubGVuZ3RoKTsgeSsrKSB7XG5cdFx0XHRsZXQgbGluZT1saW5lc1t5XS5zcGxpdCgvXFx1MjAwQnwgLyk7XG5cdFx0XHRsZXQgbnRpbGV4PVtdO1xuXHRcdFx0Zm9yKGxldCB4PTA7eDwgKChsaW5lLmxlbmd0aCA+IHQud2lkdGgpID8gdC53aWR0aCA6IGxpbmUubGVuZ3RoKTsgeCsrKSB7XG5cdFx0XHRcdGxldCBzYz1saW5lW3hdLnJlcGxhY2UoL146LywnJykucmVwbGFjZSgvOiQvLCcnKTtcblx0XHRcdFx0bGV0IGVsbT1zYzJlbG1bbGluZVt4XS5yZXBsYWNlKC9eOi8sJycpLnJlcGxhY2UoLzokLywnJyldO1xuXHRcdFx0XHRpZighZWxtKSB7IGNvbnRpbnVlIH1cblx0XHRcdFx0bnRpbGV4W3hdPWVsbTtcblx0XHRcdH1cblx0XHRcdG50aWxlW3ldPW50aWxleDtcblx0XHR9XG5cdFx0dC50aWxlc191cGRhdGUobnRpbGUpO1xuXHR9XG5cdGVtb2ppX3BhbGV0dGUoZW1vamkpIHtcblx0XHRsZXQgdD10aGlzO1xuXHRcdCQoJyNlbW9qaV9wYWxldHRlJykudGV4dChcIlwiKTtcblxuXHRcdGVtb2ppLnNvcnQoZnVuY3Rpb24oYSxiKSB7XG5cdFx0XHRpZihhLnNob3J0Y29kZSA8IGIuc2hvcnRjb2RlKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH0gZWxzZSBpZiAoYS5zaG9ydGNvZGUgPiBiLnNob3J0Y29kZSkge1xuXHRcdFx0XHRyZXR1cm4gMVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fSk7XG5cblx0XHRmb3IobGV0IGk9MDtpPGVtb2ppLmxlbmd0aDtpKyspIHtcblx0XHQvL1x0Y29uc29sZS5sb2coZW1vamlbaV0pO1xuXHRcdFx0bGV0IGlqcT0kKCc8aW1nPicse1xuXHRcdFx0XHRzcmM6IGVtb2ppW2ldLnVybCxcblx0XHRcdFx0J2RhdGEtc2hvcnRjb2RlJzogZW1vamlbaV0uc2hvcnRjb2RlLFxuXHRcdFx0XHRjc3M6IHtcblx0XHRcdFx0XHQnYm9yZGVyJzogJzJweCBzb2xpZCByZ2IoNTcsIDYzLCA3OSknLFxuXHRcdFx0XHRcdCdvYmplY3QtZml0JzogJ2NvbnRhaW4nLFxuXHRcdFx0XHRcdCd3aWR0aCc6ICAzMixcblx0XHRcdFx0XHQnaGVpZ2h0JzogMzIsXG5cdFx0XHRcdH0sXG5cdFx0XHR9KTtcblx0XHRcdCQoJyNlbW9qaV9wYWxldHRlJykuYXBwZW5kKGlqcSk7XG5cdFx0XHRpZiggZW1vamlbaV0uc2hvcnRjb2RlID09ICdibGFuaycgKSB7XG5cdFx0XHRcdHQuYmxhbmtfaWRvbT1panFbMF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKCF0LmJsYW5rX2lkb20pIHtcblx0XHRcdGFsZXJ0KFwi44GT44Gu44Kk44Oz44K544K/44Oz44K544Gr44GvIDpibGFuazog44GM44Gq44GE44Gf44KB5L2/55So44Gn44GN44G+44Gb44KTXCIpO1xuXHRcdH1cblx0XHQkKCcjZW1vamlfcGFsZXR0ZSBpbWcnKS5vbignY2xpY2snLGZ1bmN0aW9uKGUpIHtcblx0XHRcdHQuZW1vamlfcGFsZXR0ZV9zZWxlY3QoZS50YXJnZXQpXG5cdFx0fSk7XG5cblx0XHQvLyBlbW9qaW1vamlcblx0XHR0LmVtb2ppbW9qaXMubG9hZCgkKCcjZW1vamlfcGFsZXR0ZSBpbWcnKSk7XG5cdH1cblx0ZW1vamlfcGFsZXR0ZV9zZWxlY3QoZG9tKSB7XG5cdFx0bGV0IHQ9dGhpcztcblx0XHRpZiAoZG9tID09IHQuc2VsZWN0ZWRfaWRvbSApIHsgcmV0dXJuOyB9XG5cdFx0JCgnI3NlbGVjdGVkX3Nob3J0bmFtZScpLnRleHQoJzonK2RvbS5kYXRhc2V0LnNob3J0Y29kZSsnOicpO1xuXHRcdCQoZG9tKS5jc3MoJ2JvcmRlcicsJzJweCBzb2xpZCAjRkZGRkZGJyk7XG5cdFx0dC5zZWxlY3RlZF9pZG9tPWRvbTtcblx0XHRpZih0LnByZXZfc2VsZWN0ZWRfaWRvbSkge1xuXHRcdFx0JCh0LnByZXZfc2VsZWN0ZWRfaWRvbSkuY3NzKCdib3JkZXInLCcycHggc29saWQgcmdiKDU3LCA2MywgNzkpJyk7XG5cdFx0fVxuXHRcdHQucHJldl9zZWxlY3RlZF9pZG9tPWRvbTtcblx0fVxuXHRyZXN1bHQoKSB7XG5cdFx0bGV0IHQ9dGhpcztcblx0XHRsZXQgbnI9W107XG5cdFx0bGV0IHNlZW5feT1mYWxzZTtcblx0XHRmb3IobGV0IHk9dC5oZWlnaHQtMTt5Pj0wO3ktLSkge1xuXHRcdFx0bGV0IG5jPVtdO1xuXHRcdFx0bGV0IHNlZW5feD1mYWxzZTtcblx0XHRcdGZvcihsZXQgeD10LndpZHRoLTE7eD49MDt4LS0pIHtcblx0XHRcdFx0bGV0IHRzPSc6Jyt0LnRpbGVzX3NjW3ldW3hdKyc6Jztcblx0XHRcdFx0aWYodHMgIT0gJzpibGFuazonKSB7IHNlZW5feD10cnVlIH1cblx0XHRcdFx0aWYoc2Vlbl94KSB7IG5jLnB1c2godHMpIH1cblx0XHRcdH1cblx0XHRcdGlmKG5jLmxlbmd0aD4wKSB7XG5cdFx0XHRcdHNlZW5feT10cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmMucHVzaChcIlxcdTIwMEJcIik7XG5cdFx0XHR9XG5cblx0XHRcdGlmKHNlZW5feSkge1xuXHRcdFx0XHRuci5wdXNoKG5jLnJldmVyc2UoKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCBsaW5lcz1bXTtcblx0XHRmb3IobGV0IHk9bnIubGVuZ3RoLTE7eT49MDt5LS0pIHtcblx0XHRcdGxpbmVzLnB1c2gobnJbeV0uam9pbihcIlxcdTIwMEJcIikpO1xuXHRcdH1cblx0XHRsZXQgYnVmPWxpbmVzLmpvaW4oXCJcXG5cIik7XG5cdFx0bGV0IGJ1Zmxlbj1idWYubGVuZ3RoO1xuXHRcdGxldCBiZ2NvbG9yPScjMDAwMDAwJztcblx0XHRpZihidWZsZW4gPiA1MDApIHsgYmdjb2xvcj0nI0ZGMDAwMCc7IH1cblx0XHQkKCcuY29udF9yZXN1bHRfY291bnQnKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLGJnY29sb3IpO1xuXHRcdCQoJyNyZXN1bHRfY291bnQnKS50ZXh0KGJ1Zmxlbik7XG5cdFx0JCgnI3Jlc3VsdCcpLnZhbChidWYpO1xuXHR9XG59XG4iLCIvLyB2aW06ZnQ9amF2YXNjcmlwdFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVdGlsaXR5IHtcblx0cmVnZXhfZXNjYXBlKHN0cikge1xuXHRcdHJldHVybiBzdHIucmVwbGFjZSgvKFsuKis/Xj0hOiR7fSgpfFtcXF1cXC9cXFxcXSkvZywgXCJcXFxcJDFcIik7XG5cdH1cblx0c2hvcnRjb2RlMmVsbSgpIHtcblx0XHRsZXQgc2MyZWxtPXt9O1xuXHRcdCQoJyNlbW9qaV9wYWxldHRlIGltZycpLmVhY2goZnVuY3Rpb24oaWR4LGVsbSkge1xuXHRcdFx0c2MyZWxtW2VsbS5kYXRhc2V0LnNob3J0Y29kZV09ZWxtO1xuXHRcdH0pO1xuXHRcdHJldHVybiBzYzJlbG07XG5cdH1cbn1cbiJdfQ==
