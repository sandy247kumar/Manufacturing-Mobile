<script>
</script>

<template>
  <div class="container">
    <div
      class="row d-flex align-items-center justify-content-center"
      style="height: 65vh"
    >
      <img width="100%" src="@/assets/images/error404.avif" />

      <div class="col text-center">
        <button class="btn btn-outline-secondary" id="btn" type="button">
          <RouterLink class="nav-link" to="/">BACK TO HOME</RouterLink>
        </button>
      </div>
    </div>
  </div>
</template>

<style  scoped>
.btn:hover {
  color: lightgrey;
}
</style>