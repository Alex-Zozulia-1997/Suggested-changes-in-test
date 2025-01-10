<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>Edit Habit</h3>
      <!-- Input field for habit name -->
      <input v-model="habitName" placeholder="Habit name" />
      <div class="modal-actions">
        <!-- Buttons to save changes or cancel -->
        <button @click="editHabit">Save</button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: ['habit'],
  setup(props, { emit }) {
    const habitName = ref(props.habit.name);

    watch(() => props.habit.name, (newName) => {
      habitName.value = newName;
    });

    const editHabit = () => {
      if (habitName.value) {
        emit('edit-habit', { id: props.habit.id, name: habitName.value });
        emit('close');
      }
    };

    return {
      habitName,
      editHabit,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-actions {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #f0f0f0;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.5s;
}

.modal-enter, .modal-leave-to {
  opacity: 0;
}
</style>
