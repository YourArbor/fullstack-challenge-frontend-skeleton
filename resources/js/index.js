const Vue = window.Vue = require("vue").default;
Vue.component(`arbor-color-picker`, require(`./color-picker.vue`).default);
Vue.component(`arbor-dropdown`, require(`./dropdown.vue`).default);
Vue.component(`arbor-input`, require(`./input.vue`).default);
const ajax = require("./ajax");
var app = new Vue({
	el: '#app',
	data: {
        test_color: "#decaf0",
        test_name: "",
        test_message: "A blank message"
	},
	computed: {

	},
	watch: {


	},

	mounted: function() {
	},
	methods: {
        testGet() {
            let self = this;
            ajax.get("http://localhost:8000/api/test-get", {
                name: this.test_name
            }).then(function(response) {
                self.test_message = response.message;
            }).catch(function(response) {
                self.test_message = "ERROR: "+response.error;
            });
        },
        testPost() {
            let self = this;
            ajax.post("http://localhost:8000/api/test-post", {
                name: this.test_name
            }).then(function(response) {
                self.test_message = response.message;
            }).catch(function(response) {
                self.test_message = "ERROR: "+response.error;
            });
        }
	}
});
