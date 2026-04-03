<template>
  <div
    v-if="visible"
    class="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg"
  >
    {{ message }}
  </div>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);
const message = ref("");

const showToast = (msg) => {
  message.value = msg;
  visible.value = true;

  setTimeout(() => {
    visible.value = false;
  }, 3000);
};

defineExpose({ showToast });
</script>