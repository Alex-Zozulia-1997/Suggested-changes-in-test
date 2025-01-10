<template>
  <div class="habit-item">
    <span>{{ habit.name }}</span>
    <input type="checkbox" :checked="isCompleted" @change="toggleCompletion" />
  </div>
</template>

<script>
import { toRefs } from 'vue';

export default {
  props: ['habit', 'isCompleted'],
  setup(props, { emit }) {
    const { habit, isCompleted } = toRefs(props);

    const toggleCompletion = () => {
      emit('toggle-completion', habit.value.id);
    };

    return {
      habit,
      isCompleted,
      toggleCompletion,
    };
  },
};
</script>

<style>
.habit-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}
</style>
