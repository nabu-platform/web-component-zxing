Vue.component("n-form-zxing", {
	template: "#n-form-zxing",
	props: {
		value: {
			required: true
		},
		label: {
			type: String,
			required: false
		},
		// whether or not you are in edit mode
		edit: {
			type: Boolean,
			required: false,
			default: true
		},
		required: {
			type: Boolean,
			required: false,
			// explicitly set default value to null, otherwise vue will make it false which we can't distinguish from "not set"
			default: null
		},
		name: {
			type: String,
			required: false
		},
		placeholder: {
			type: String,
			required: false
		},
		// a json schema component stating the definition
		schema: {
			type: Object,
			required: false
		},
		width: {
			type: Number,
			required: false,
			default: 640
		},
		height: {
			type: Number,
			required: false,
			default: 480
		},
		buttonLabel: {
			type: String,
			required: false
		},
		manualLabel: {
			type: String,
			required: false
		},
		icon: {
			type: String,
			required: false
		},
		validator: {
			type: Function,
			required: false
		},
		// whether or not manual entry is allowed
		manualEntry: {
			type: Boolean,
			required: false
		},
		zoom: {
			type: Boolean,
			default: false
		},
		// whether or not you want to switch to viewing the actual code rather than the last still
		switchCode: {
			type: Boolean,
			default: false
		},
		buttonClass: {
			required: false
		}
	},
	data: function() {
		return {
			codeReader: null,
			switchQrCode: false,
			scanning: false,
			code: null,
			messages: [],
			valid: null
		}
	},
	created: function() {
		if (this.value) {
			this.code = this.value;
		}
	},
	ready: function() {
		var self = this;
		//this.codeReader = new ZXing.BrowserQRCodeReader();
		//this.decodeContinuously();
	},
	beforeDestroy: function() {
		this.stop();
	},
	computed: {
		definition: function() {
			var definition = nabu.utils.vue.form.definition(this);
			if (this.type == "number") {
				definition.type = "number";
			}
			return definition;
		},
		mandatory: function() {
			return nabu.utils.vue.form.mandatory(this);
		},
		zoomable: function() {
			return this.zoom && this.zoomCapable;
		},
		hasRenderer: function() {
			return this.$services.swagger.operations["nabu.libs.misc.okapiBarcode.web.render"] != null;
		}
	},
	ready: function() {
		this.resize();
	},
	methods: {
		resize: function() {
			var width = this.$el.offsetWidth;
			var height = (width * 2) / 3;
			this.$refs.video.style.width = width + "px";
			this.$refs.video.style.height = height + "px";
			this.$refs.overlay.style.width = width + "px";
			this.$refs.overlay.style.height = height + "px";
			this.$refs.video.setAttribute("width", width);
			this.$refs.video.setAttribute("height", height);
		},
		stop: function() {
			if (this.codeReader) {
				this.codeReader.stopStreams();
				this.codeReader.stopContinuousDecode();
				this.codeReader = null;
			}
			this.scanning = false;
		},
		validate: function(soft) {
			var self = this;
			this.messages.splice(0);
			// this performs all basic validation and enriches the messages array to support asynchronous
			var messages = nabu.utils.schema.json.validate(this.definition, this.value, this.mandatory);
			self.messages.splice(0);
			var hardMessages = messages.filter(function(x) { return !x.soft });
			// if we are doing a soft validation and all messages were soft, set valid to unknown
			if (soft && hardMessages.length == 0 && (messages.length > 0 || !this.value) && self.valid == null) {
				self.valid = null;
			}
			else {
				self.valid = messages.length == 0;
				nabu.utils.arrays.merge(self.messages, nabu.utils.vue.form.localMessages(self, messages));
			}
			return messages;
		},
		decodeContinuously: function(selectedDeviceId) {
			var self = this;
			this.codeReader = new ZXing.BrowserDatamatrixCodeReader();
			console.log("code reader", this.codeReader);
			this.scanning = true;
			this.codeReader.getVideoInputDevices().then(function(videoInputDevices) {
				var selectedId = videoInputDevices[0].deviceId;
				// if we have multiple we do a best effort attempt to get the "back" facing one
				if (videoInputDevices.length > 1) {
					videoInputDevices.forEach(function(x) {
						if (x.label && x.label.toLowerCase().indexOf("back") >= 0) {
							selectedId = x.deviceId;
						}
					})
				}
				// if there are multiple video input devices, we can offer a selection, for example:
				// https://github.com/zxing-js/library/blob/master/docs/examples/qr-camera/index.html
				self.codeReader.decodeFromInputVideoDeviceContinuously(selectedId, self.$refs.video, function(result, err) {
					if (result) {
						self.code = result;
						self.stop();
					}
	
					if (err) {
						// As long as this error belongs into one of the following categories
						// the code reader is going to continue as excepted. Any other error
						// will stop the decoding loop.
						//
						// Excepted Exceptions:
						//
						//  - NotFoundException
						//  - ChecksumException
						//  - FormatException
	
						if (err instanceof ZXing.NotFoundException) {
							// console.log('No code found.')
						}
						if (err instanceof ZXing.ChecksumException) {
							// console.log('A code was found, but it\'s read value was not valid.')
						}
						if (err instanceof ZXing.FormatException) {
							// console.log('A code was found, but it was in a invalid format.')
						}
					}
				})
			});
		},
		rescan: function() {
			if (!this.scanning) {
				this.code = null;
				this.decodeContinuously();
			}
		}
	},
	watch: {
		code: function(newValue) {
			if (this.value != newValue) {
				this.$emit("input", newValue);
			}
		}
	}
})