<template id="n-form-zxing">
	<div class="is-form-zxing n-form-component" :class="{'is-zxing-scanned': scanned, 'is-scanned': scanned}">
		<div class="is-label-wrapper" v-if="label || info">
			<label class="is-label" v-if="label"><span class="is-label-content" v-html="label"></span><n-info :icon="infoIcon" v-if="info"><span v-html="info"></span></n-info></label>
		</div>
		<div class="is-content-before" v-if="before" v-html="before"></div>
		<div class="n-form-zxing-container n-form-scan-container" v-show="!switchCode || !code">
			<video v-show="scanning" ref="video" id="video"></video>
			<div ref="overlay" class="overlay" v-show="!scanning"><button type="button" :class="buttonClass" class="is-button n-form-zxing-retry n-form-scan-retry" @click="rescan"><span class="icon" :class="icon" v-if="icon"></span><span class="label">{{ buttonLabel ? buttonLabel : "%{Scan Code}" }}</span></button></div>
		</div>
		<div v-if="switchCode && code" class="n-form-barcode" :style="{'width':width + 'px', 'height': height + 'px'}">
			<img :src="$services.swagger.parameters('nabu.libs.misc.okapiBarcode.web.render', { type: 'svg', code: 'dataMatrix', content: code, name: 'barcode.svg' }).url" :height="height"/>
			<div v-show="!scanning" class="actions"><button type="button" :class="buttonClass" class="is-button n-form-barcode-retry" @click="rescan"><span class="icon" :class="icon" v-if="icon"></span><span class="label">{{ buttonLabel ? buttonLabel : "%{Scan Code}" }}</span></button></div>
		</div>
		<n-form-text v-if="manualEntry" ref='text' v-model="code" :label="manualLabel" @input='checkEmpty' :required='required' :schema='schema'
			:placeholder='placeholder'
			:validator='validator'
			:edit='edit'
			:timeout="600"/>
		<n-form-text v-if="zoomable && scanning" type="range" v-model="zoomLevel" label="Zoom" :min="zoomMin" :max="zoomMax" :step="zoomStep"/>
		<n-messages :messages="messages" v-if="messages && messages.length"/>
		<div class="is-content-after" v-if="after" v-html="after"></div>
	</div>
</template>