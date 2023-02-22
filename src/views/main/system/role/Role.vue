<template>
  <div class="role">
		<PageSearch :search-config="searchConfig"></PageSearch>
  </div>
</template>

<script setup lang="ts" name="role">
import PageSearch from '@/components/page-search/PageSearch.vue';
import searchConfig from './config/search-config'

</script>

<style scoped>
.role {
}
</style>
