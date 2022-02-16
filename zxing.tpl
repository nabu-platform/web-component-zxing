<template id="n-form-zxing">
	<div class="n-form-zxing n-form-component" :class="{'n-form-zxing-scanned': scanned, 'n-form-scanned': scanned}">
		<label v-if="label">{{label}}</label>
		<div class="n-form-zxing-container n-form-scan-container" v-show="!switchCode || !code">
			<video v-show="scanning" ref="video" id="video" :width="width" :height="height"></video>
			<div ref="overlay" class="overlay" v-show="!scanning" :style="{'width':width + 'px', 'height': height + 'px'}"><button class="n-form-zxing-retry n-form-scan-retry" @click="rescan"><span class="icon" :class="icon" v-if="icon"></span><span class="label">{{ buttonLabel ? buttonLabel : "%{Scan Code}" }}</span></button></div>
		</div>
		<div v-if="switchCode && code" class="n-form-barcode" :style="{'width':width + 'px', 'height': height + 'px'}">
			<img :src="$services.swagger.parameters('nabu.libs.misc.okapiBarcode.web.render', { type: 'svg', code: 'dataMatrix', content: code, name: 'barcode.svg' }).url" :height="height"/>
			<div v-show="!scanning" class="actions"><button class="n-form-barcode-retry" @click="rescan"><span class="icon" :class="icon" v-if="icon"></span><span class="label">{{ buttonLabel ? buttonLabel : "%{Scan Code}" }}</span></button></div>
		</div>
		<n-form-text v-if="manualEntry" ref='text' v-model="code" :label="manualLabel" @input='checkEmpty' :required='required' :schema='schema'
			:placeholder='placeholder'
			:validator='validator'
			:edit='edit'
			:timeout="600"/>
		<n-form-text v-if="zoomable && scanning" type="range" v-model="zoomLevel" label="Zoom" :min="zoomMin" :max="zoomMax" :step="zoomStep"/>
	</div>
</template>