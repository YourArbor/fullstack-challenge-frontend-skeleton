<template>
	<div class="arbor-color-picker">
		<div class="arbor-color-picker-block" :style="block_style" @click="open = true"></div>
		<div v-if="open" class="arbor-color-picker-popup">
			<div class="arbor-color-picker-popup-background" @click="open = false"></div>

			<div class="arbor-color-picker-popup-body" :style="popup_position">
				<arbor-dropdown v-model="color_type" :options="['Solid', 'Linear Gradient']"></arbor-dropdown>
				<div v-if="color_type == 'Linear Gradient'" class="linear-gradient-slider" :style="linear_gradient_style">
					<div v-for="color, ind in colors" @click="selectLinearGradientColor(ind)" :style="styleForGradientColor(color)" class="linear-gradient-slider-thumb" :name="'color-'+ind"></div>
				</div>
				<div class="color-hsl-picker">
					<div class="color-hsl-picker-under" :style="gradient_under_style"></div>
					<div class="color-hsl-picker-over"></div>
					<div class="color-hsl-picker-thumb" :style="hsl_thumb_style"></div>
				</div>
				<div class="color-gradient-slider">
					<div class="color-gradient-thumb" :style="gradient_thumb_style"></div>
				</div>

				<div class="color-alpha-slider">
					<div class="color-alpha-thumb" :style="alpha_thumb_style"></div>
				</div>
				<div v-if="color_type == 'Linear Gradient'">
					<arbor-input :value="output" @input="updateColor" type="string">
						<template v-slot:label>Gradient</template>
					</arbor-input>
				</div>
				<div v-else>
					<arbor-input :value="color.tohexstring()" @input="updateColor" type="string">
						<template v-slot:label>Hex</template>
					</arbor-input>
					<arbor-input :value="color.torgbstring()" @input="updateColor" type="string">
						<template v-slot:label>Rgba</template>
					</arbor-input>
				</div>
			</div>
		</div>
	</div>

</template>
<script>
const Color = require("./Color");
module.exports = {
	props: ["value"],
	watch: {
		color_type: {
			immediate: true,
			handler: function(newVal, oldVal) {
				if (newVal == "Solid") {
					this.colors = [];
					this.current_gradient_index = 0;
					this.gradient_direction = 0;
				}
				else {
					if (this.colors == null || this.colors.length == 0) {
						this.colors = [
							{color: this.color.torgbstring(), percent: 0},
							{color: this.color.torgbstring(), percent: 100}
						];
					}
					this.current_gradient_index = 0;
					this.gradient_direction = this.gradient_direction || "to right";
				}
			}
		},
		value: {
			immediate: true,
			handler: function(newVal, oldVal) {
				if (newVal == null) {
					return;
				}
				console.log("NEWVAL", newVal);
				if (typeof newVal == "string" && newVal.indexOf("linear-gradient(") == 0) {
					//linear-gradient\((\w\s)+\,(((rgba?|hsla?)\((\d{1,3})\,(\d{1,3})\,(\d{1,3})\,?(\d{0,3})?\))|(#\w{6,8)\,?)+\)

					//linear-gradient\(([\w|\.|\s]+)\,((((rgba?|hsla?)\(\d{1,3}\,\s?\d{1,3}\,\s?\d{1,3}\,?\s?\d{0,3}?\))|(#\w{6,8}))[\s|\w|\.|\%]*[\,|\s]*)+\)
					let parsed = /^linear-gradient\(([\.\w\s]+)\,\s?((((rgba?|hsla?)\(\d{1,3}\,\s?\d{1,3}\,\s?\d{1,3}\,?\s?[\d\.]{0,5}?\)|(#\w{6,8}))(\s[\d\.]+%)?[\,\s]*)+)\)$/gmi.exec(newVal);
					// let color_matches = [
					// 	`linear-gradient\\(([\\.\\w\\s]+)\\,\\s?((((rgba?|hsla?)\\(\\d{1,3}\\,\\s?\\d{1,3}\\,\\s?\\d{1,3}\\,?\\s?[\\d\\.]{0,5}?\\)|(#\\w{6,8}))(\\s[\\d\\.]+%)?[\\,\\s]*)+)\\)`,
					// 	`((rgba?|hsla?)\\(\\d{1,3}\\,\\s?\\d{1,3}\\,\\s?\\d{1,3}\\,?\\s?[\\d\\.]{0,5}?\\)|(#\\w{6,8}))`
					// ];
					//
					// let split = `(${color_matches.join("|")}|\\,)+`;
					// let re = new RegExp(split, "gmi");
					// let matches = [...newVal.matchAll(re)]

					let direction = parsed[1];
					this.gradient_direction = direction;
					let colors = parsed[2];
					let all_colors = [...colors.matchAll(/(((rgba?|hsla?)\(\d{1,3}\,\s?\d{1,3}\,\s?\d{1,3}\,?\s?\d{0,3}?\)|(#\w{6,8}))\,?\s?)(\s?[\d\.]+%)?/gmi)].map(function(el) {
						return {
							color: el[1],
							percent: parseFloat(el[5].replace("%", ""))
						};
					});
					let ind = 0;
					all_colors.forEach(function(el) {
						if (el.percent == null) {
							el.percent = 100 * ind * (1/(all_colors.length-1))
						}
						ind += 1;
					});
					this.color = new Color(all_colors[window.lastClickedIndex || 0].color);
					this.colors = all_colors;
					this.color_type = "Linear Gradient";
					this.$forceUpdate();

				}
				else {
					this.color = new Color(newVal)
				}


			}
		}
	},
	data: function () {
		return {
			color_type: "Solid",
			colors: [],
			current_gradient_index: 0,
			gradient_direction: null,
			color: null,
			open: false,
			mouse: null
		}
	},
	computed: {
		popup_position() {
			var rect = this.$el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;

			let top = rect.top + scrollTop;
			let left = rect.left + scrollLeft;
			let transform = [];

			let colorPickerHeight = 400;

			if (top + colorPickerHeight > window.innerHeight) {
				transform.push(`translateY(-100%)`)
			}
			else if (top < colorPickerHeight) {
				transform.push(`translateY(50px)`);
			}
			else {
				transform.push(`translateY(-50%)`);
			}
			if (left + colorPickerHeight > window.innerWidth) {
				transform.push(`translateX(-100%)`)
			}
			else if (left < colorPickerHeight) {
				transform.push(`translateX(50px)`)
			}
			else {
				transform.push(`translateX(50px)`)
			}


			return {
				top: top+"px",
				left: left+"px",
				transform: transform.join(" ")
			};
		},
		block_style() {
			if (this.color == null) {
				return;
			}
			return {
				background: this.output,//this.color.torgbstring()
			}
		},
		gradient_thumb_style() {

			let currentHue = new Color(`hsv(${this.color.hsv.h},100,100)`);
			return {
				left: `${100*this.color.hsv.h/360}%`,
				background: currentHue.torgbstring()
			}
		},
		alpha_thumb_style() {
			let bg = new Color("#444444");
			bg.updateAlpha(this.color.alpha);
			return {
				left: `${this.color.alpha || 100}%`,
				background: bg.torgbstring()
			}
		},
		gradient_under_style() {
			let maxHue = new Color(`hsv(${this.color.hsv.h},100,100)`);
			return {
				background: `linear-gradient(to right, white, ${maxHue.torgbstring()})`
			}
		},
		hsl_thumb_style() {
			if (this.color == null) {
				return;
			}
			return {
				left: `${this.color.hsv.s}%`,
				top: `${(100-this.color.hsv.v)}%`,
				'background-color': this.color.torgbstring()
			}
		},
		linear_gradient_style() {
			return {
				background: `linear-gradient(to right, ${this.colors.map(function(el) {return el.color+" "+el.percent+"%"}).join(", ")})`
			}
		},
		output() {
			if (this.colors == null || this.colors.length == 0) {
				return this.color;
			}
			return `linear-gradient(${this.gradient_direction}, ${this.colors.map(function(el) {return el.color.trim()+" "+el.percent+"%"}).join(", ")})`;
		}
	},

	mounted: function () {
		this.setupListeners();
	},

	methods: {
		updateLinearGradient() {
			if (this.colors == null || this.colors.length == 0) {
				return;
			}
			this.colors[this.current_gradient_index].color = this.color.torgbstring();
			this.$forceUpdate();
		},
		selectLinearGradientColor(ind) {
			window.lastClickedIndex = ind;
			this.current_gradient_index = ind;
			this.color = new Color(this.colors[ind].color);
			this.$emit("input", this.output);
		},
		styleForGradientColor(color) {
			return {
				left: color.percent+"%",
				background: color.color
			}
		},
		updateColor(string) {
			this.color = new Color(string);
			this.$emit("input", this.output);
		},
		setupListeners() {
			let self = this;
			this.$el.addEventListener("mousedown", function(ev) {
				if (ev.target.classList.contains("color-gradient-thumb") || ev.target.classList.contains("color-gradient-slider")) {
					self.mouse = {
						target: ev.target,
						event: "gradient",
					}
				}
				if (ev.target.classList.contains("color-hsl-picker-thumb") || ev.target.classList.contains("color-hsl-picker")) {
					self.mouse = {
						target: ev.target,
						event: "hsv",
					}
				}
				if (ev.target.classList.contains("color-alpha-thumb") || ev.target.classList.contains("color-alpha-picker")) {
					self.mouse = {
						target: ev.target,
						event: "alpha",
					}
				}
				if (ev.target.classList.contains("linear-gradient-slider-thumb")) {
					self.mouse = {
						target: ev.target,
						event: "linear-gradient",
						color_ind: ev.target.getAttribute("name").replace("color-", "")
					}
				}
			});
			this.$el.addEventListener("mousemove", function(ev) {
				if (self.mouse == null) {
					return;
				}
				if (self.mouse.event == "gradient") {
					self.mouseGradientMove(ev);
				}
				if (self.mouse.event == "hsv") {
					self.mouseHsvMove(ev);
				}
				if (self.mouse.event == "alpha") {
					self.mouseAlphaMove(ev);
				}
				if (self.mouse.event == "linear-gradient") {
					self.mouseLinearGradientMove(ev);
				}
			});
			this.$el.addEventListener("mouseup", function(ev) {
				self.mouse = null;
			});
		},
		mouseLinearGradientMove(ev) {
			let target = this.$el.querySelector(".linear-gradient-slider");
			var rect = target.getBoundingClientRect();
			var x = ev.clientX - rect.left; //x position within the element.
			var y = ev.clientY - rect.top;  //y position within the element.

			let cur_ind = parseInt(this.mouse.color_ind);
			let previous_color_percent = (this.colors[cur_ind-1] || {percent: 0}).percent;
			let next_color_percent = (this.colors[cur_ind+1] || {percent: 100}).percent;
			this.colors[cur_ind].percent = Math.min(next_color_percent, Math.max(previous_color_percent, 100*x/target.offsetWidth)).toFixed(2);
			this.$forceUpdate();
			this.$emit("input", this.output);
		},
		mouseHsvMove(ev) {
			let target = this.$el.querySelector(".color-hsl-picker");
			var rect = target.getBoundingClientRect();
			var x = ev.clientX - rect.left; //x position within the element.
			var y = ev.clientY - rect.top;  //y position within the element.
			this.color.updateLightness(100 - (100*y/target.offsetHeight));
			this.color.updateSaturation(100*x/target.offsetWidth);

			this.updateLinearGradient();

			this.$forceUpdate();
			this.$emit("input", this.output);
		},
		mouseAlphaMove(ev) {
			let target = this.$el.querySelector(".color-alpha-slider");
			var rect = target.getBoundingClientRect();
			var x = ev.clientX - rect.left; //x position within the element.
			var y = ev.clientY - rect.top;  //y position within the element.
			this.color.updateAlpha(100*x/target.offsetWidth);
			this.updateLinearGradient();
			this.$forceUpdate();
			this.$emit("input", this.output);
		},
		mouseGradientMove(ev) {
			let target = this.$el.querySelector(".color-gradient-slider");
			var rect = target.getBoundingClientRect();
			var x = ev.clientX - rect.left; //x position within the element.
			var y = ev.clientY - rect.top;  //y position within the element.
			this.color.updateHue(360*x/target.offsetWidth);
			this.updateLinearGradient();
			this.$forceUpdate();
			this.$emit("input", this.output);
		},
	}
};
</script>
