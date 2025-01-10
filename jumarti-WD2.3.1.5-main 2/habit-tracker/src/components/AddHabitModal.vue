<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>Add Habit</h3>
      <!-- Input field for habit name -->
      <input v-model="habitName" placeholder="Habit name" />
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <div class="modal-actions">
        <!-- Buttons to add the habit or cancel -->
        <button @click="addHabit">Add</button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup(props, { emit }) {
    const habitName = ref('');
    const errorMessage = ref('');

    const addHabit = () => {
      if (habitName.value.length > 0 && habitName.value.length <= 20) {
        emit('add-habit', habitName.value);
        habitName.value = '';
        errorMessage.value = '';
        emit('close');
      } else {
        errorMessage.value = 'Habit name must be between 1 and 20 characters.';
      }
    };

    return {
      habitName,
      errorMessage,
      addHabit,
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

.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
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

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}
</style>
