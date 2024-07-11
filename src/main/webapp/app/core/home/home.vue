<template>
  <div class="home row">
    <div class="col-md-3">
      <span class="nlp img-fluid rounded"></span>
    </div>
    <div class="col-md-9">
      <div style="float: right;">
        <button class="btn btn-outline-primary" @click="openModal" v-text="t$('home.upload-dataset')"></button>
      </div>
      <div class="row">
        <div class="col-md-4" v-for="dataset in datasets">
          <div class="card border-primary mb-3" style="max-width: 20rem;">
            <div class="card-header">{{ dataset.name }}</div>
            <div class="card-body">
              <h4 class="card-title">{{ dataset.name }}</h4>
              <button @click="openDataset(dataset.id)" type="button" class="btn btn-link" v-text="t$('home.open-dataset')" style="padding: 0px;"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" v-bind:style="isModalOpen ? 'display: block;' : 'display: none;'">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" v-text="t$('home.upload-dataset')"></h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close">
              <span aria-hidden="true">X</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <fieldset>
                <!--<div>
                  <label for="datasetHuggingFace" class="form-label mt-4" v-text="t$('home.dataset-huggingface')"></label>
                  <input type="text" class="form-control" id="datasetHuggingFace" aria-describedby="datasetHuggingFace" v-bind:placeholder="t$('home.dataset-huggingface')" required>
                </div>-->
                <div>
                  <label for="datasetName" class="form-label mt-4" v-text="t$('home.dataset-name')"></label>
                  <input type="text" class="form-control" id="datasetName" aria-describedby="datasetName" v-bind:placeholder="t$('home.dataset-name')" required>
                  <div class="invalid-feedback" v-bind:style="datasetNameEmpty ? 'display: block;' : 'display: none;'" v-text="t$('home.error-no-dataset-name')"></div>
                </div>
                <div>
                  <label for="datasetAuthors" class="form-label mt-4" v-text="t$('home.dataset-authors')"></label>
                  <input type="text" class="form-control" id="datasetAuthors" aria-describedby="datasetAuthors" v-bind:placeholder="t$('home.dataset-authors')" required>
                  <div class="invalid-feedback" v-bind:style="datasetAuthorsEmpty ? 'display: block;' : 'display: none;'" v-text="t$('home.error-no-dataset-authors')"></div>
                </div>
                <div>
                  <label for="datasetInput" class="form-label mt-4" v-text="t$('home.dataset-file')"></label>
                  <input class="form-control" type="file" id="datasetInput" @change="pickFile" accept=".csv, .tsv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
                  <div class="invalid-feedback" v-bind:style="datasetEmpty ? 'display: block;' : 'display: none;'" v-text="t$('home.error-no-dataset-file')"></div>
                </div>
                <br>
              </fieldset>
            </form>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="uploadDataset" v-text="t$('home.upload')"></button>
            <button type="button" class="btn btn-secondary" @click="closeModal" v-text="t$('home.close')"></button>
          </div>
        </div>
    </div>
  </div>

</template>
<style>
.form-control[type=file]:not(:disabled):not([readonly]) {
    cursor: pointer;
}
.form-control::-webkit-file-upload-button {
  padding: 0.75rem 1.5rem;
  margin: -0.75rem -1.5rem;
  -webkit-margin-end: 1.5rem;
  margin-inline-end: 1.5rem;
  color: var(--bs-body-color);
  background-color: var(--bs-tertiary-bg);
  pointer-events: none;
  border-color: inherit;
  border-style: solid;
  border-width: 0;
  border-inline-end-width: 0;
  border-radius: 0;
  -webkit-transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.form-control::file-selector-button {
  padding: 0.75rem 1.5rem;
  margin: -0.75rem -1.5rem;
  -webkit-margin-end: 1.5rem;
  margin-inline-end: 1.5rem;
  color: var(--bs-body-color);
  background-color: var(--bs-tertiary-bg);
  pointer-events: none;
  border-color: inherit;
  border-style: solid;
  border-width: 0;
  border-inline-end-width: 0;
  border-radius: 0;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>

<script lang="ts" src="./home.component.ts"></script>
