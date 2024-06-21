<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  stack: {
    type: String,
    required: true,
  },
});
</script>

<template>
<div class="container">
    <div class="card text-white bg-danger mb-12" style="margin-bottom: 20px; margin-top: 20px;">
        <div class=" card-header" style="font-size: xxx-large;">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="10" fill="white" stroke="#E53E3E" stroke-width="2" />
                <path d="M14 8L8 14M8 8L14 14" stroke="#E53E3E" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
            <b>ERROR!</b>
        </div>
        <div class="card-body">
            <h6 class="card-title"> {{name}} </h6>
            <small>
                {{message}}
            </small>
        </div>
    </div>

    <div class="card border-danger mb-12">
        <div class="card-header text-danger"><b style="font-size: large;">STACK TRACE</b></div>
        <div class="card-body text-danger">

            <p class="card-text">
            <pre>
                {{stack}}
            </pre>
            </p>
        </div>
    </div>
    
    <!-- <div class="row mb-12" style="margin-top: 30px;">
        <div class="d-grid ">
            <button class="btn  btn-outline-success" type="button"><b><a @click="$router.go()">Try Again</a></b></button>
        </div>
    </div> -->
    </div>
</template>

<style scoped>
</style>
