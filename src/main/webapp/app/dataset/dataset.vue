<template>
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
                    <tr v-for="(row, index) in paginatedData" :key="index">
                        <td>
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    :id="'rowSelected_' + row.id"
                                    :name="'rowSelected_' + row.id"
                                    style="accent-color: #1a1a1a;"
                                    v-model="selectedRows[row.id]"
                                />
                                <label class="form-check-label" for="rowSelected"></label>
                            </div>
                        </td>
                        <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                    </tr>
                </tbody>
            </table>
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                        <a class="page-link" href="#" @click="prevPage" v-text="t$('dataset.previous')"></a>
                    </li>
                    <li class="page-item" v-for="pageNumber in totalPages" :key="pageNumber" :class="{ 'active': pageNumber === currentPage }">
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
                        <input type="text" class="form-control" id="fieldName1" aria-describedby="fieldName1" v-bind:placeholder="t$('home.field-name')" required>
                        <div class="d-flex" style="margin-top: 1em;">
                            <p v-text="t$('home.type')"></p>
                            <div class="form-check" style="margin-left: 1em;">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    id="checkboxFreetext1"
                                    name="checkboxFreetext1"
                                    style="accent-color: #1a1a1a;"/>
                                <label class="form-check-label" for="checkboxFreetext1" v-text="t$('home.text')"></label>
                            </div>
                            <div class="form-check" style="margin-left: 1em;">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    id="checkboxLabel1"
                                    name="checkboxLabel1"
                                    style="accent-color: #1a1a1a;"/>
                                <label class="form-check-label" for="checkboxLabel1" v-text="t$('home.label')"></label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label for="fieldName2" class="form-label mt-4" v-text="t$('home.field-name')"></label>
                        <input type="text" class="form-control" id="fieldName2" aria-describedby="fieldName2" v-bind:placeholder="t$('home.field-name')" required>
                        <div class="d-flex" style="margin-top: 1em;">
                            <p v-text="t$('home.type')"></p>
                            <div class="form-check" style="margin-left: 1em;">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    id="checkboxFreetext2"
                                    name="checkboxFreetext2"
                                    style="accent-color: #1a1a1a;"/>
                                <label class="form-check-label" for="checkboxFreetext2" v-text="t$('home.text')"></label>
                            </div>
                            <div class="form-check" style="margin-left: 1em;">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    id="checkboxLabel2"
                                    name="checkboxLabel2"
                                    style="accent-color: #1a1a1a;"/>
                                <label class="form-check-label" for="checkboxLabel2" v-text="t$('home.label')"></label>
                            </div>
                        </div>
                    </div>
                </fieldset>
                </form>
            </div>
            <div class="modal-footer">
                <a type="button" class="btn btn-primary" :href="'/dataset/annotation/' + dataset.id"  style="display: inline-block;" v-text="t$('dataset.annotation-mode')"></a>
                <button type="button" class="btn btn-secondary" @click="closeModal" v-text="t$('home.close')"></button>
            </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts" src="./dataset.component.ts"></script>
