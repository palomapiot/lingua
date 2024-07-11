<template>

    <div v-if="showSuccessAlert" class="alert alert-dismissible alert-success">
        <button type="button" class="btn-close" @click="dismissAlert">X</button>
        <strong>Annotation saved!</strong> The record was <a class="alert-link">successfully annotated</a>.
    </div>

    <div class="row" v-if="isLoaded">
        <div class="col-md-9">
            <h3 v-if="dataset">
            {{ dataset.name }}
            <small class="text-body-secondary">{{ dataset.authors }}</small>
            </h3>
        </div>
        <div class="col-md-3" style="float: right;">
            <div>
                <div>
                    <button type="button" class="btn btn-success" v-on:click="saveAnnotation" style="float: right; margin-left: 1em" v-text="t$('dataset.save')"></button>   
                </div>
                <div>
                    <a type="button" class="btn btn-outline-info" @click="inspectMode" v-text="t$('dataset.inspect-mode')" style="float: right;"></a> 
                </div>
            </div>
        </div>

        <div class="col-md-12" style="margin-top: 1em;">
            <div v-for="k in dataset.header">
                <div class="card mb-3">
                    <div class="card-body">
                        <!--<h5 class="card-title">{{ Object.keys(k)[0] }}</h5>-->
                        <h5 class="card-title">{{ k }}</h5>
                        <h6 class="card-subtitle text-muted">{{ getLabelById(dataset.content[0], k) }}</h6>
                    </div>
                </div>
            </div>
            <div class="card mb-3"  v-for="k in dataset.annotation_header">
                <div class="card-body">
                    <h5 class="card-title">{{ k.name }}</h5>
                    <div v-if="k.options == 'freetext'">
                        <textarea ref="textareaRef" class="form-control" id="annotationFreetext" rows="4" v-model="annotationFreetext"></textarea>
                    </div>
                    <div class="bs-component mb-6" v-if="k.options !== 'freetext'">
                        <div class="btn-group" role="group" id="annotationLabel" aria-label="">
                            <div v-for="ah_value in k.options">
                            <input 
                                type="radio"
                                class="btn-check"
                                name="annotationLabel"
                                :value="ah_value"
                                :id="ah_value"
                                autocomplete="off"
                                v-model="annotationLabel">
                            </input>
                            <label class="btn btn-outline-primary" :for="ah_value">{{ ah_value }}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <nav aria-label="Dataset navigation" v-if="dataset">
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ 'disabled': currentRow === 1 }">
                        <a class="page-link" href="#" @click="prevRow" v-text="t$('dataset.previous')"></a>
                    </li>
                    <li class="page-item" :class="{ 'disabled' : currentRow === dataset.total_items }">
                        <a class="page-link" href="#" @click="nextRow" v-text="t$('dataset.next')"></a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>

</template>

<script lang="ts" src="./annotation.component.ts"></script>
<style>
.btn-group, .btn-group-vertical {
    position: relative;
    display: inline-flex;
    vertical-align: middle;
}
.btn-check {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    pointer-events: none;
} 
input[type="radio" i] {
    background-color: initial;
    cursor: default;
    appearance: auto;
    box-sizing: border-box;
    margin: 3px 3px 0px 5px;
    padding: initial;
    border: initial;
}
.btn-check:checked + .btn, :not(.btn-check) + .btn:active, .btn:first-child:active, .btn.active, .btn.show {
    color: #fff;
    background-color: #1a1a1a;
    border-color: #1a1a1a;
}
.btn-close {
    --bs-btn-close-color: #000;
    --bs-btn-close-opacity: 0.5;
    --bs-btn-close-hover-opacity: 0.75;
    --bs-btn-close-focus-shadow: 0 0 0 0.25rem rgba(26, 26, 26, 0.25);
    --bs-btn-close-focus-opacity: 1;
    --bs-btn-close-disabled-opacity: 0.25;
    --bs-btn-close-white-filter: invert(1) grayscale(100%) brightness(200%);
    box-sizing: content-box;
    width: 1em;
    height: 1em;
    padding: 0.25em 0.25em;
    color: var(--bs-btn-close-color);
    background: transparent var(--bs-btn-close-bg) center / 1em auto no-repeat;
    border: 0;
    opacity: var(--bs-btn-close-opacity);
}
.alert-dismissible .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    padding: 0.75rem 0.75rem;
}
strong {
    font-weight: bolder;
}
.alert-link {
    font-weight: 600;
    color: var(--bs-alert-link-color);
    text-decoration: underline;
    pointer-events: none;
}
</style>
  