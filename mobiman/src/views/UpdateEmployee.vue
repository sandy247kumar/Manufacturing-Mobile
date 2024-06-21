<script setup>
import Netsuite from "../service/netsuite.js";
import { ref } from "vue";
import { useRoute } from "vue-router";
import errorMsg from "../components/errorMsg.vue";
import { RouterLink, RouterView } from "vue-router";
import { useRouter } from "vue-router";
// import router from "@/router";

const router = useRouter();
const route = useRoute();

var service = new Netsuite();

const loading = ref(false);

const iserror = ref(false);

const isBack = ref(false);

const errorDetails = ref({
  title: "",
  message: "",
  stack: [],
});

const employeeFields = [
  {
    required: false,
    type: "input",
    disabled: true,
    attrs: {
      class: "form-control",
      type: "text",
    },
    field: "id",
    label: "Internal ID",
  },
  {
    required: false,
    disabled: false,
    attrs: {
      id: "floatingInput",
      type: "text",
      class: "form-floating mb-3",
    },
    field: "firstname",
    label: "First Name",
  },
  {
    required: true,
    disabled: true,
    attrs: {
      id: "",
      class: "form-floating mb-3",
      type: "email",
    },
    field: "email",
    label: "Email",
  },
  {
    required: false,
    disabled: false,
    attrs: {
      id: "",
      type: "number",
      class: "form-floating mb-3",
    },
    field: "phone",
    label: "Phone No",
  },
  {
    required: false,
    disabled: true,
    attrs: {
      id: "",
      type: "text",
      class: "form-floating mb-3",
    },
    field: "jobtitle",
    label: "Job Title",
  },
  {
    required: false,
    disabled: true,
    attrs: {
      id: "",
      type: "text",
      class: "form-floating mb-3",
    },
    field: "subsidiary",
    label: "Subsidiary",
  },
];

const results = ref({
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  subsidiary: "",
  job: "",
});

loading.value = true;

var data = service.post({
  action: "load",
  type: "employee",
  id: route.params.id,
  fields: [
    "id",
    "firstname",
    "email",
    "phone",
    "defaultjobresourcerole",
    "subsidiary",
  ],
});

data
  .then(function (res) {
    console.log("res in update -->", res);
    loading.value = false;

    if (res.success == false) {
      iserror.value = true;
      errorDetails.value = res.result;
      return;
    }

    iserror.value = false;

    // results.value.internalid = res.internalid[0].value;
    results.value.id = res.id;
    results.value.firstname = res.firstname;
    results.value.lastname = res.lastname;
    results.value.email = res.email;
    if (Number(res.phone)) {
      results.value.phone = Number(res.phone);
    } else {
      results.value.phone = "";
    }

    results.value.subsidiary = res.subsidiary_txt;
    results.value.jobtitle = res.defaultjobresourcerole_txt;
    results.value.viewlink = `/view/${res.id}`;
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

console.log("result ==>", results);

const saveResponse = (res) => {
  try {
    var userResponse = confirm("Do you want to continue?");

    if (userResponse) {
      loading.value = true;
      var updated = service.post({
        action: "update_record",
        type: "employee",
        id: res.id,
        fields: {
          firstname: res.firstname,
          phone: Number(res.phone),
        },
      });

      updated.then(function (response) {
        console.log("response", response);

        loading.value = false;

        alert("successfully updated");

        var answer = confirm("Do you want to go back?");

        if (answer) {
          router.push({ name: "employee" });
        }
      });
    }
    // loading.value = true;
  } catch (error) {
    loading.value = false;
    console.log("errr==>", v);
    iserror.value = true;
    errorDetails.value = {
      title: v.title,
      message: v.message,
      stack: v.stack,
    };
  }
};
</script>

<template>
  <div>
    <template v-if="loading">
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

    <form>
      <div class="form-floating mb-3" style="margin-top: 30px">
        <template v-for="field in employeeFields">
          <div class="pt-2">
            <label for="floatingTextarea">{{ field.label }}</label>
            <input
              :bind="field.attrs"
              class="form-control"
              :type="field.attrs.type"
              value=""
              v-model="results[field.field]"
              :disabled="field.disabled"
              :readonly="field.required"
              aria-label="Disabled input example"
            />
          </div>
        </template>
      </div>

      <div class="row mb-12" style="margin-top: 45px">
        <div class="d-grid gap-2">
          <button
            class="btn btn-primary"
            @click="saveResponse(results)"
            type="button"
          >
            SAVE
          </button>

          <button class="btn btn-secondary" type="button">
            <RouterLink class="nav-link" :to="{ name: 'employee' }">
              CANCEL
            </RouterLink>
          </button>
        </div>
      </div>
    </form>
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
