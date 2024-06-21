<script setup>
import Netsuite from "../service/netsuite.js";
import { ref } from "vue";
import { useRoute } from "vue-router";
import errorMsg from "../components/errorMsg.vue";

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
  action: "update_record",
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
</script>

<template>
  <div>This is an save page</div>
</template>
