<template>

    <div v-if="showDangerAlert" class="alert alert-dismissible alert-danger">
        <button type="button" class="btn-close" @click="dismissAlert">X</button>
        <strong>Error!</strong> No rows selected for export. Please <a class="alert-link">select rows</a> to proceed.
    </div>

    <div class="row">
        <div class="col-md-9">
            <h3 v-if="dataset">
            {{ dataset.name }}
            <small class="text-body-secondary">{{ dataset.authors }}</small>
            </h3>
        </div>

        <div class="col-md-3" style="float: right;">
            <div>
                <div>
                    <button type="button" class="btn btn-outline-primary" v-on:click="exportDataset()" style="float: right; margin-left: 1em;" v-text="t$('dataset.export-dataset')"></button>
                </div>
                <div>
                    <button type="button" class="btn btn-outline-info" @click="openModal" style="float: right;" v-text="t$('dataset.annotation-mode')"></button>
                </div>
            </div>
        </div>


        <div class="col-md-12" style="margin-top: 1em;">
            <form class="d-flex">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" v-bind:placeholder="t$('dataset.filter')" aria-label="Filter" aria-describedby="button-filter">
                    <button class="btn btn-primary" type="button" id="button-filter" style="height: 46.8px;" v-text="t$('dataset.filter')"></button>
                </div>
            </form>
        </div>

        <div class="col-md-12">
            <table class="table table-hover" v-if="dataset">
                <thead>
                    <tr>
                        <th><input type="checkbox" style="accent-color: #1a1a1a;" v-model="isCheckboxSelected" @change="selectAllRows" id="selectAllRowsCheckbox"></th>
                        <th scope="col" v-for="h in dataset.header">{{ h }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in dataset.content" :key="index">
                        <td>
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    :id="'rowSelected_' + row.line_number"
                                    :name="'rowSelected_' + row.line_number"
                                    style="accent-color: #1a1a1a;"
                                    v-model="selectedRows[row.line_number]"
                                />
                                <label class="form-check-label" for="rowSelected"></label>
                            </div>
                        </td>
                        <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                            <div v-if="isArrayOfObjects(cell)[0]">
                                <ol>
                                    <li v-for="(item, index) in isArrayOfObjects(cell)[1]" :key="index">
                                        <p><p class="text-info">{{ item.input }}:</p> {{ item.explanation }}</p>
                                    </li>
                                </ol>
                            </div>
                            <p v-else>{{ cell }}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                        <a class="page-link" href="#" @click="prevPage" v-text="t$('dataset.previous')"></a>
                    </li>
                    <li class="page-item" v-for="pageNumber in pagesToDisplay" :key="pageNumber" :class="{ 'active': pageNumber === currentPage, 'disabled': pageNumber === '...' }">
                        <a class="page-link" href="#" @click="gotoPage(pageNumber)">{{ pageNumber }}</a>
                    </li>
                    <li class="page-item" :class="{ 'disabled' : currentPage === totalPages }">
                        <a class="page-link" href="#" @click="nextPage" v-text="t$('dataset.next')"></a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>

    <div class="modal" v-bind:style="isModalOpen ? 'display: block;' : 'display: none;'">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" v-text="t$('home.new-annotation')"></h5>
                <button type="button" class="btn-close" @click="closeModal" aria-label="Close">
                <span aria-hidden="true">X</span>
                </button>
            </div>
            <div class="modal-body">
                <form>
                <fieldset>
                    <div>
                        <label for="fieldName1" class="form-label mt-4" v-text="t$('home.field-name')"></label>
                        <input type="text" class="form-control" id="fieldName1" aria-describedby="fieldName1" v-model="fieldName1" v-bind:placeholder="t$('home.field-name')" required>
                        <div class="d-flex" style="margin-top: 1em;">
                            <p v-text="t$('home.type')"></p>
                            <div class="form-check" style="margin-left: 1em;">
                                <input
                                    v-model="isFreetext1"
                                    class="form-check-input"
                                    type="checkbox"
                                    id="checkboxFreetext1"
                                    name="checkboxFreetext1"
                                    style="accent-color: #1a1a1a;"/>
                                <label class="form-check-label" for="checkboxFreetext1" v-text="t$('home.text')"></label>
                            </div>
                            <div class="form-check" style="margin-left: 1em;">
                                <input
                                    v-model="isLabel1"
                                    class="form-check-input"
                                    type="checkbox"
                                    id="checkboxLabel1"
                                    name="checkboxLabel1"
                                    style="accent-color: #1a1a1a;"/>
                                <label class="form-check-label" for="checkboxLabel1" v-text="t$('home.label')"></label>
                            </div>
                        </div>
                        <label v-show="isLabel1" for="labelsList1" class="form-label mt-4" v-text="t$('home.labels')"></label>
                        <input v-show="isLabel1" type="text" class="form-control" id="labelsList1" aria-describedby="labelsList1" v-model="labelsList1" v-bind:placeholder="t$('home.labels')" required>
                    </div>
                    <div>
                        <label for="fieldName2" class="form-label mt-4" v-text="t$('home.field-name')"></label>
                        <input type="text" class="form-control" id="fieldName2" aria-describedby="fieldName2" v-model="fieldName2" v-bind:placeholder="t$('home.field-name')" required>
                        <div class="d-flex" style="margin-top: 1em;">
                            <p v-text="t$('home.type')"></p>
                            <div class="form-check" style="margin-left: 1em;">
                                <input
                                    v-model="isFreetext2"
                                    class="form-check-input"
                                    type="checkbox"
                                    id="checkboxFreetext2"
                                    name="checkboxFreetext2"
                                    style="accent-color: #1a1a1a;"/>
                                <label class="form-check-label" for="checkboxFreetext2" v-text="t$('home.text')"></label>
                            </div>
                            <div class="form-check" style="margin-left: 1em;">
                                <input
                                    v-model="isLabel2"
                                    class="form-check-input"
                                    type="checkbox"
                                    id="checkboxLabel2"
                                    name="checkboxLabel2"
                                    style="accent-color: #1a1a1a;"/>
                                <label class="form-check-label" for="checkboxLabel2" v-text="t$('home.label')"></label>
                            </div>
                        </div>
                        <label v-show="isLabel2" for="labelsList2" class="form-label mt-4" v-text="t$('home.labels')"></label>
                        <input v-show="isLabel2" type="text" class="form-control" id="labelsList2" aria-describedby="labelsList2" v-model="labelsList2" v-bind:placeholder="t$('home.labels')" required>
                    </div>
                    <!-- Annotate on sentence level if column is a list-->

                </fieldset>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="newAnnotation" style="display: inline-block;" v-text="t$('dataset.annotation-mode')"></button>
                <button type="button" class="btn btn-secondary" @click="closeModal" v-text="t$('home.close')"></button>
            </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts" src="./dataset.component.ts"></script>
<style>
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
table {
    display: block;
    overflow-x: auto;
}
</style>