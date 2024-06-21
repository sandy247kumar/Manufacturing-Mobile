<script setup>
import Netsuite from "../service/netsuite.js";
import { ref } from "vue";
import { useRoute } from "vue-router";
import errorMsg from "../components/errorMsg.vue";
import { RouterLink, RouterView } from "vue-router";


const route = useRoute();

var service = new Netsuite();

const loading = ref(false);

const iserror = ref(false);

const pageNotFound = ref(false);

const errorDetails = ref({
  title: "",
  message: "",
  stack: [],
});

const results = ref({
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  subsidiary: "",
});

loading.value = true;

var data = service.post({
  action: "lookup",
  id: route.params.id,
  columns: [
    "internalid",
    "firstname",
    "email",
    "phone",
    "defaultjobresourcerole",
    "subsidiary",
  ],
  type: "employee",
});

data
  .then(function (res) {
    loading.value = false;

    console.log("res in emp==>", res);

    if (Object.values(res).length == 0) {
      pageNotFound.value = true;
      return;
    }
    // if (Object.keys(res).length == 2) {
    if (res.success == false) {
      iserror.value = true;
      errorDetails.value = res.result;
      return;
    }

    iserror.value = false;

    results.value.internalid = res.internalid[0].value;
    results.value.firstname = res.firstname;
    results.value.lastname = res.lastname;
    results.value.email = res.email;
    results.value.phone = Number(res.phone);
    results.value.subsidiary = res.subsidiary;
    results.value.jobtitle = res.defaultjobresourcerole;
    results.value.viewlink = `/view/${res.id}`;
  })
  .catch((v) => {
    loading.value = false;
    console.log("errr in emp==>", v);
    iserror.value = true;
    errorDetails.value = {
      title: v.title,
      message: v.message,
      stack: v.stack,
    };
  });

const tryAgain = () => {
  return data;
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
        </div>
      </div>
    </template>

    <template v-else-if="loading">
      <!-- <div id="container" v-if="isnotFound">
        <img width="100%" src="@/assets/images/404page" />
      </div> -->
      <div>
        <section class="wrapper">
          <div class="loader">
            <div class="loading one"></div>
            <div class="loading two"></div>
            <div class="loading three"></div>
            <div class="loading four"></div>
          </div>
        </section>
      </div>
    </template>

    <template v-else-if="!loading">
      <div class="container">
        <div class="row mt-3">
          <div class="col-md-12">
            <div class="list-group">
              <a
                href="#"
                class="list-group-item list-group-item-action"
                aria-current="true"
              >
                <div
                  class="d-flex w-100 justify-content-between"
                  style="border-color: black"
                >
                  <h5 class="mb-1">
                    {{ `${results.firstname} ${results.lastname || ""}` }}
                  </h5>
                  <small>{{ results.phone || "" }}</small>
                </div>
                <p class="mb-1">{{ results.id }}</p>
                <small>{{ results.email }}</small>
              </a>
            </div>
          </div>
        </div>

        <hr />

        <div class="row mb-3">
          <div class="col-md-12">
            <table class="table table-sm table-bordered">
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{{ results.internalid }}</td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>
                    {{ `${results.firstname} ${results.lastname || ""}` }}
                  </td>
                </tr>

                <tr v-if="results.phone">
                  <td>Phone</td>
                  <td>{{ results.phone }}</td>
                </tr>

                <tr>
                  <td>Email</td>
                  <td>{{ results.email }}</td>
                </tr>

                <tr>
                  <td>Subsidiary</td>
                  <td>{{ results.subsidiary[0].text }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="row mb-12">
          <div class="d-grid gap-2">
            <button class="btn btn-primary" type="button">
              <RouterLink class="nav-link" :to="{ name: 'update' }">
                <!-- <update-employee :employeeData="results" /> -->
                EDIT
              </RouterLink>
            </button>
            
            <button class="btn btn-secondary" type="button">
              <RouterLink class="nav-link" to="/">BACK</RouterLink>
            </button>
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
