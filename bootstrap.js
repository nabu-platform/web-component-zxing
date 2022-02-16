window.addEventListener("load", function() {
	if (application && nabu && nabu.page) {
		Vue.component("page-form-input-zxing-configure", {
			template: "<n-form-section>"
				+ "	<n-form-switch v-model='field.allowManualEntry' label='Allow manual entry' />"
				+ "	<n-form-text type='number' v-model='field.canvasWidth' label='Width (in pixels)' />"
				+ "	<n-form-text type='number' v-model='field.canvasHeight' label='Height (in pixels)' />"
				+ "	<n-form-text v-model='field.icon' label='Icon' />"
				+ "	<n-form-text v-model='field.buttonLabel' label='Buton Label' />"
				+ "	<n-form-text v-if='field.allowManualEntry' v-model='field.manualLabel' label='Manual Label' />"
				+ "	<n-form-switch v-model='field.zoom' label='Zoom' info='Whether or not we should allow zooming in if the device supports it' />"
				+ "	<n-form-switch v-if='hasRenderer' v-model='field.showScannedCode' label='When scanned, display the code' />"
				+ "	<p v-else>If you plug in the service nabu.libs.misc.okapiBarcode.web.render, you can choose to render the code you just scanned.</p>"
				+ "	<n-page-mapper v-model='field.bindings' :from='availableParameters' :to='[\"validator\"]'/>"
				+ "</n-form-section>",
			props: {
				cell: {
					type: Object,
					required: true
				},
				page: {
					type: Object,
					required: true
				},
				// the fragment this image is in
				field: {
					type: Object,
					required: true
				}
			},
			created: function() {
				if (!this.field.bindings) {
					Vue.set(this.field, "bindings", {});
				}
			},
			computed: {
				availableParameters: function() {
					return this.$services.page.getAvailableParameters(this.page, this.cell, true);
				},
				hasRenderer: function() {
					return this.$services.swagger.operations["nabu.libs.misc.okapiBarcode.web.render"] != null;
				}
			}
		});

		Vue.component("page-form-input-zxing", {
			template: "<n-form-zxing :manual-entry='field.allowManualEntry' ref='form'"
				+ "	:schema='schema'"
				+ "	@input=\"function(newValue) { $emit('input', newValue) }\""
				+ "	:label='label'"
				+ "	:value='value'"
				+ "	:name='field.name'"
				+ "	:timeout='timeout'"
				+ "	:validator='getValidator()'"
				+ "	:width='field.canvasWidth'"
				+ "	:height='field.canvasHeight'"
				+ "	:button-label='$services.page.translate($services.page.interpret(field.buttonLabel, $self))'"
				+ "	:manual-label='$services.page.translate($services.page.interpret(field.manualLabel, $self))'"
				+ "	:placeholder='placeholder ? $services.page.translate($services.page.interpret(placeholder, $self)) : null'"
				+ "	:switch-code='field.showScannedCode'"
				+ "	:icon='field.icon'"
				+ "	:zoom='field.zoom'"
				+ "	:disabled='disabled'/>",
			props: {
				cell: {
					type: Object,
					required: true
				},
				page: {
					type: Object,
					required: true
				},
				field: {
					type: Object,
					required: true
				},
				value: {
					required: true
				},
				label: {
					type: String,
					required: false
				},
				timeout: {
					required: false
				},
				disabled: {
					type: Boolean,
					required: false
				},
				schema: {
					type: Object,
					required: false
				},
				readOnly: {
					type: Boolean,
					required: false
				},
				placeholder: {
					type: String,
					required: false
				}
			},
			computed: {
				textType: function() {
					return this.field.textType ? this.field.textType : 'text';
				}
			},
			methods: {
				validate: function(soft) {
					return this.$refs.form.validate(soft);
				},
				getValidator: function() {
					if (this.field.bindings && this.field.bindings.validator) {
						var pageInstance = this.$services.page.getPageInstance(this.page, this);
						return this.$services.page.getBindingValue(pageInstance, this.field.bindings.validator, this);
					}
				}
			}
		});
		application.bootstrap(function($services) {
			nabu.page.provide("page-form-input", { 
				component: "page-form-input-zxing", 
				configure: "page-form-input-zxing-configure", 
				name: "zxing",
				namespace: "nabu.page"
			});
		});
	}
});    