class Color {
    constructor(dirty_input) {


        if (typeof dirty_input == "string") {
            let input = dirty_input.trim();
            if (input.charAt(0) == "#") { // Hex
                this.rgb = this.hexToRgb(input);
                this.hsv = this.rgb2hsv(this.rgb.r, this.rgb.g, this.rgb.b);
            }
            else if (input.indexOf("rgb(") == 0 || input.indexOf("rgba(") == 0) {
                this.rgb = this.stringToRgb(input);
                this.alpha = (this.rgb.a || 1) * 100;
                this.hsv = this.rgb2hsv(this.rgb.r, this.rgb.g, this.rgb.b);
            }
            else if (
                input.indexOf("hsv(") == 0 ||
                input.indexOf("hsva(") == 0 ||
                input.indexOf("hsl(") == 0 ||
                input.indexOf("hsla(") == 0
            ) {
                this.hsv = this.stringToHsv(input);
                this.alpha = (this.hsv.a || 1) * 100;
                this.rgb = this.hsv2rgb(this.hsv.h/360, this.hsv.s/100, this.hsv.v/100);
            }


        }
        else if (typeof dirty_input == "object") {
            let input = dirty_input;
            this.hsv = input.hsv;
            this.rgb = input.rgb;
            this.alpha = input.alpha;
        }

    }
    updateAlpha(alpha) {
        this.alpha = parseInt(Math.min(Math.max(0, parseInt(alpha)), 100));
    }
    updateHue(h) {
        this.hsv.h = parseInt(Math.min(Math.max(0, parseInt(h)), 360));
        this.rgb = this.hsv2rgb(this.hsv.h/360, this.hsv.s/100, this.hsv.v/100);
    }
    updateSaturation(s) {
        this.hsv.s = parseInt(Math.min(Math.max(0, parseInt(s)), 100));
        this.rgb = this.hsv2rgb(this.hsv.h/360, this.hsv.s/100, this.hsv.v/100);
    }
    updateLightness(l) {
        this.hsv.v = parseInt(Math.min(Math.max(0, parseInt(l)), 100));
        this.rgb = this.hsv2rgb(this.hsv.h/360, this.hsv.s/100, this.hsv.v/100);
    }
    torgbstring() {
        return `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${(this.alpha || 100)/100})`;
    }
    tohsvstring() {
        return `hsl(${this.hsv.h}, ${this.hsv.s}, ${this.hsv.v}, ${(this.alpha || 100)/100})`;
    }
    tohexstring() {
        return this.rgbToHex(this.rgb.r, this.rgb.g, this.rgb.b);
    }
    toString() {
        return this.torgbstring();
    }
    stringToHsv(string) {
        var result = /^hsv[a|l]?\((\d{0,3})\,(\d{0,3})\,(\d{0,3})\,?(\d{0,3})?\)$/gmi.exec(string.replaceAll(" ", ""));
          return result ? {
            h: parseInt(result[1]),
            s: parseInt(result[2]),
            v: parseInt(result[3]),
            a: parseInt(result[4]) || 1
          } : null;
    }
    stringToRgb(string) {
        var result = /^rgba?\((\d{0,3})\,(\d{0,3})\,(\d{0,3})\,?([\d\.]{0,5})?\)$/gmi.exec(string.replaceAll(" ", ""));
        console.log(result, string)
          return result ? {
            r: parseInt(result[1]),
            g: parseInt(result[2]),
            b: parseInt(result[3]),
            a: parseFloat(result[4]) || 1
          } : null;
    }
    hexToRgb(hex) {
          var result = /^#?([a-f\d]{2})?([a-f\d]{2})?([a-f\d]{2})?([a-f\d]{2})?$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16) || 0,
            g: parseInt(result[2], 16) || 0,
            b: parseInt(result[3], 16) || 0,
            a: (parseFloat(result[4], 16) || 255)/255
          } : null;
    }
    componentToHex(c) {
          var hex = parseInt(c).toString(16);
          return hex.length == 1 ? "0" + hex : hex;
    }

    rgbToHex(r, g, b) {
          return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b)+this.componentToHex(255*(this.alpha || 100)/100);
    }

    rgb2hsv (r, g, b) {
        let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
        rabs = r / 255;
        gabs = g / 255;
        babs = b / 255;
        v = Math.max(rabs, gabs, babs),
        diff = v - Math.min(rabs, gabs, babs);
        diffc = c => (v - c) / 6 / diff + 1 / 2;
        percentRoundFn = num => Math.round(num * 100) / 100;
        if (diff == 0) {
            h = s = 0;
        } else {
            s = diff / v;
            rr = diffc(rabs);
            gg = diffc(gabs);
            bb = diffc(babs);

            if (rabs === v) {
                h = bb - gg;
            } else if (gabs === v) {
                h = (1 / 3) + rr - bb;
            } else if (babs === v) {
                h = (2 / 3) + gg - rr;
            }
            if (h < 0) {
                h += 1;
            }else if (h > 1) {
                h -= 1;
            }
        }
        return {
            h: Math.round(h * 360),
            s: percentRoundFn(s * 100),
            v: percentRoundFn(v * 100)
        };
    }
    /* accepts parameters
     * h  Object = {h:x, s:y, v:z}
     * OR
     * h, s, v
    */
    hsv2rgb(h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
}
module.exports = Color;
