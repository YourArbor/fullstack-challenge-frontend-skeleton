<template>
    <div class="arbor-input" :class="input_class">
        <label class="arbor-input-label"><slot name="label"></slot></label>
        <div class="arbor-input-field" :class="'arbor-input-field-'+type">
            <span v-if="type == 'search'" class="icon-Search"></span>
            <span v-if="prefix != null && prefix.length > 0" class="arbor-input-field-prefix">
                <div>
                    {{prefix}}
                </div>
            </span>
            <div class="arbor-input-field-input" :class="prefix != null && prefix.length > 0 ? 'arbor-input-field-input-has-prefix' : ''">
                <div class="arbor-input-field-postfix" v-if="type != 'password'">
                    {{temp_val}}{{postfix}}
                </div>
                <input :value="temp_val" @input="newInput" @focus="focus = true" @blur="focus = false" :type="type == 'password' ? 'password' : ''" :name="name">
                <div class="arbor-input-placeholder">{{placeholder}}</div>
            </div>
        </div>
    </div>

</template>
<script>
/*

This is a component that should take an object of type DataSourcePaginator (look at portal code for example), and automatically iterate through and provide a way to jump to page

*/
module.exports = {

    props: {
        name: {
            default: null,
            type: String
        },
        disabled: {
            default: false,
            type: Boolean
        },
        min: {
            default: null,
            type: Number
        },
        max: {
            default: null,
            type: Number
        },
        placeholder: {
            default: "",
            type: String
        },
        value: {
            default: ""
        },
        type: {
            type: String,
            default: "string" // number, int, string, decimal
        },
        postfix: {
            type: String,
            default: ""
        },
        prefix: {
            type: String,
            default: ""
        },
    },
    data: function () {
        return {
            temp_val: "",
            focus: false,
            error: null
        }
    },

    watch: {
        value: {
            immediate: true,
            handler: function(newVal, oldVal) {
                this.temp_val = newVal;
                this.$forceUpdate();
            }
        },
        focus(newVal, oldVal) {
            this.$emit("focus", this.focus);
        },

        // temp_val: {
        // 	immediate: true,
        // 	handler: function(newVal, oldVal) {
        // 		if (newVal == oldVal) {
        // 			return;
        // 		}
        // 		this.validate();
        // 	}
        // },
    },
    computed: {
        input_class() {
            let focus = this.focus || (this.temp_val != null && (this.temp_val || "").toString().length > 0) ? 'arbor-input-focus' : '';
            let disabled = this.disabled ? "disabled" : "";
            return [focus, disabled].join(" ");
        }
    },
    mounted: function () {

    },

    methods: {
        newInput(ev) {
            if (this.disabled) {
                return;
            }
            this.validate(ev.target.value);

        },
        validate(newVal) {
            let regMatch = /.*/gmi
            if (this.type.toLowerCase() == "number") {
                newVal = this.stringToNumber(newVal);
                this.error = null;
                if (this.max != null) {
                    newVal = Math.min(this.max, newVal);
                }
                if (this.min != null) {
                    newVal = Math.max(this.min, newVal);
                }
            }
            if (this.type.toLowerCase() == "httporigin") {
                newVal = this.stringToHttpOrigin(newVal);
            }



            this.temp_val = newVal//+this.postfix;
            this.$forceUpdate();
            this.$emit("input", this.temp_val);
        },
        stringToHttpOrigin(val) {
            let url = val.replace(/^https?:\/\//i, "");
            return url.split("/")[0];
        },
        stringToNumber(val) {
            // TODO: max, min, precision
            var valid = /^\d{0,9}(\.\d{0,2})?$/.test(val);

            if (!valid) {
                var dotCheck = val.indexOf("..");
                if (dotCheck >= 0) {
                    val = val.replace("..", ".");
                }

                val = val.replace(/(\.)(.)(\.)/g, ".$2");

                //strip out commas
                val = val.replace(/,/g, "");

                //strip out all non-numeric characters (leaving decimal)
                val = val.replace(/[^0-9.]/g, "");

                //enforce 2 decimal places (max)
                var totalLength = val.length;
                var only2DecimalsCount = val.indexOf(".");

                if (only2DecimalsCount >= 0 && totalLength > (only2DecimalsCount + 2)) {
                    val = val.substring(0, (only2DecimalsCount + 3));
                }

                //output to field

            }
            return val;
        }
    }
};
</script>
