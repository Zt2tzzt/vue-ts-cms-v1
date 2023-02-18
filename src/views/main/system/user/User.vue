<template>
  <div class="user">
    <UserSearch></UserSearch>
		<UserContent></UserContent>
  </div>
</template>

<script setup lang="ts" name="user">
import UserContent from './cpns/UserContent.vue';
import UserSearch from './cpns/UserSearch.vue';

</script>

<style scoped>
.user {
	border-radius: 8px;
	overflow: hidden;
}
</style>
