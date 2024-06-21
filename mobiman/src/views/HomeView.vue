<script setup>
import Netsuite from "../service/netsuite.js";
import { ref } from "vue";
import errorMsg from "../components/errorMsg.vue";

var service = new Netsuite();

const loading = ref(false);

const isnotFound = ref(false);

const results = ref([]);
const iserror = ref(false);

const keyword = ref("");

const errorDetails = ref({
  title: "",
  message: "",
  stackrace: [],
});

const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};

const PopulateResults = debounce(() => {
  loading.value = true;
  iserror.value = false;
  var data = service.post({
    action: "search",
    filters: [["firstname", "contains", `${keyword.value}`]],
    columns: [
      "internalid",
      "firstname",
      "email",
      "phone",
      "title",
      "subsidiary",
    ],
    type: "employee",
  });

  data
    .then(function (res) {
      loading.value = false;

      if (res.length == 0) {
        console.log("res is empty");
        isnotFound.value = true;
        results.value = [];
        return;
      } else {
        isnotFound.value = false;
      }

      if (res.success == false) {
        console.log("inside if==>");
        iserror.value = true;
        errorDetails.value = res.result;
        return;
      }

      iserror.value = false;
      console.log("inside else==>");

      if (keyword.value.length >= 2) {
        results.value = res.map(function (c) {
          c.viewlink = `/view/${c.id}`;
          return c;
        });
      }
    })
    .catch((v) => {
      loading.value = false;
      console.log("errr==>", v);
      iserror.value = true;
      errorDetails.value = {
        title: v.title,
        message: v.message,
        stack: v.stack,
      };
    });
}, 400);

const tryAgain = () => {
  PopulateResults();
};
</script>

<template>
  <div class="container">
    <template v-if="iserror">
      <errorMsg
        :name="errorDetails.name"
        :stack="errorDetails.stack"
        :message="errorDetails.message"
      />
      <div class="row mb-12" style="margin-top: 30px">
        <div class="d-grid">
          <button
            class="btn btn-outline-primary"
            @click="tryAgain()"
            type="button"
          >
            <b>Try Again</b>
          </button>
          <br />
          <button
            class="btn btn-outline-dark"
            @click="$router.go()"
            type="button"
          >
            <b>Go Back</b>
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="!iserror">
      <div class="row">
        <div class="col-12">
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-person-lines-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"
                />
              </svg>
            </span>
            <input
              @keyup="PopulateResults()"
              v-model="keyword"
              type="text"
              class="form-control"
              placeholder="Employee Name"
              aria-label="Employee Name"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>

        <section v-if="loading" class="wrapper">
          <div class="loader">
            <div class="loading one"></div>
            <div class="loading two"></div>
            <div class="loading three"></div>
            <div class="loading four"></div>
          </div>
        </section>
      </div>

      <div v-if="!loading" class="row" style="height: 720px; overflow: auto">
        <div id="container" v-if="isnotFound">
          <img width="100%" src="@/assets/images/emptyResult.gif" />
        </div>

        <div class="col-md-12">
          <div class="list-group">
            <a
              v-for="item in results"
              :key="item"
              :href="item.viewlink"
              class="list-group-item list-group-item-action"
              aria-current="true"
            >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ item.firstname }}</h5>
                <small>{{ item.jobtitle }}</small>
              </div>
              <p class="mb-1">{{ item.phone }}</p>
              <small>{{ item.email }}</small>
            </a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.wrapper .loader {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.loader .loading {
  /* background: #2596be; */
  background: #999999;
  width: 30px;
  height: 30px;
  border-radius: 50px;
  margin: 0 10px;
  animation: load 0.7s ease infinite;
}

.loader .loading.one {
  animation-delay: 0.3s;
}

.loader .loading.two {
  animation-delay: 0.4s;
}

.loader .loading.three {
  animation-delay: 0.5s;
}

@keyframes load {
  0% {
    width: 30px;
    height: 30px;
  }

  50% {
    width: 20px;
    height: 20px;
  }
}
</style>