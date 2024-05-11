<template>
    <div class="row">
        <div class="col-md-9">
            <h3 v-if="dataset">
            {{ dataset.name }}
            <small class="text-body-secondary">{{ dataset.authors }}</small>
            </h3>
        </div>
        <div class="col-md-3 btn-group text-center">
            <div>
                <button type="button" class="btn btn-outline-info" v-on:click="" style="display: inline-block;" v-text="t$('dataset.annotation-mode')"></button>
            </div>
            <hr>
            <div>
                <button type="button" class="btn btn-outline-primary" v-on:click="exportDataset()" style="display: inline-block;" v-text="t$('dataset.export-dataset')"></button>
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
</template>

<script lang="ts" src="./dataset.component.ts"></script>
  