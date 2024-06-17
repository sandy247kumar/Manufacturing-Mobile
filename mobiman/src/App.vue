<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Mobile Manufacture</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">

          <RouterLink class="nav-link" to="/">Home</RouterLink>
          <RouterLink class="nav-link" to="/about">About</RouterLink>
        </div>
      </div>
    </div>
  </nav>

  <div class="container">
    <RouterView />
  </div>



  <div class="container" style="text-align: center; font-size: x-small;">
    <p>Prateek Technosoft 2024</p>
  </div>

</template>

<style scoped></style>
