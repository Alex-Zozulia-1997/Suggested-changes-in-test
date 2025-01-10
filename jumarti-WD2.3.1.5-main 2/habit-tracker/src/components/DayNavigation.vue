<template>
  <div class="day-navigation">
    <!-- Buttons for navigating between days -->
    <button @click="changeDay(-1)">Previous</button>
    <span>{{ formattedDate }}</span>
    <button @click="changeDay(1)" :disabled="isToday">Next</button>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  props: ['date'],
  setup(props, { emit }) {
    const formattedDate = computed(() => {
      return new Date(props.date).toLocaleDateString();
    });

    const isToday = computed(() => {
      return props.date === new Date().toISOString().split('T')[0];
    });

    const changeDay = (days) => {
      const newDate = new Date(props.date);
      newDate.setDate(newDate.getDate() + days);
      emit('update-date', newDate.toISOString().split('T')[0]);
    };

    return {
      formattedDate,
      isToday,
      changeDay,
    };
  },
};
</script>

<style scoped>
.day-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

button {
  margin: 0 10px;
}
</style>
