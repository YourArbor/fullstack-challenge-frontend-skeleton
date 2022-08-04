<template>
    <div class="arbor-dropdown" :class="dropdown_class">
        <div class="arbor-dropdown-label" @click="open = !open">
            {{label}}
            <span v-if="label == null || label.length == 0">
                {{placeholder == null ? "Select.." : placeholder}}
            </span>
        </div>
        <div class="arbor-dropdown-background" @click="open = false"></div>
        <div class="arbor-dropdown-options">
            <div v-for="option in options" class="arbor-dropdown-option" :class="isActive(option) ? 'arbor-dropdown-option-active' : ''" @click="$emit('input', valueForOption(option)); open = false;">
                <div v-if="typeof option == 'string'">{{option}}</div>
                <div v-else-if="typeof option == 'object'">{{option[option_label || 'label']}}</div>
            </div>
        </div>
    </div>

</template>
<script>
module.exports = {
    props: ["value", "options", "option_key","option_label", "disabled", "placeholder"],
    watch: {
        value: {
            immediate: true,
            handler: function(newVal, oldVal) {

            }
        }
    },
    data: function () {
        return {
            open: false
        }
    },
    computed: {
        dropdown_class() {
            return (this.open ? 'arbor-dropdown-open' : '')+(this.disabled ? "disabled" : "");
        },
        active() {
            let self = this;
            if (this.options == null) {
                return;
            }
            return this.options.filter(function(el) {
                if (typeof el == "string" && el == self.value) {
                    return true;
                }
                let k = self.option_key || "value";
                console.log("KEY", k);
                if (typeof el == "object" && el[k] == self.value) {
                    return true;
                }
                return false;
            })[0];

        },
        label() {
            let selected = this.active;
            console.log("ACTIVESELECTED", selected, this.value);
            if (typeof selected == "string") {
                return selected
            }
            if (typeof selected == "object") {
                return selected[this.option_label || 'label'];
            }
        }
    },

    mounted: function () {
    },

    methods: {
        valueForOption(option) {
            if (typeof option == "string") {
                return option;
            }
            if (typeof option == "object") {
                return option[this.option_key || value];
            }
        },
        isActive(option) {
            return this.valueForOption(option) == this.value;
        }
    }
};
</script>
