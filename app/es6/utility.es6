// vim:ft=javascript

export default class Utility {
	regex_escape(str) {
		return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
	}
	shortcode2elm() {
		let sc2elm={};
		$('#emoji_palette img').each(function(idx,elm) {
			sc2elm[elm.dataset.shortcode]=elm;
		});
		return sc2elm;
	}
}
