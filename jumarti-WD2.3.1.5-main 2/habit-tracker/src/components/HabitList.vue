<template>
  <div>
    <h2>Habits for {{ date }}</h2>
    <!-- List of habits -->
    <div v-for="habit in habits" :key="habit.id" class="habit-item">
      <span>{{ habit.name }}</span>
      <div>
        <!-- Checkbox to mark habit as completed -->
        <input 
          type="checkbox" 
          :checked="isCompleted(habit.id)" 
          @change="() => toggleCompletion(habit.id)" 
        />
        <!-- Buttons to edit, stop, or delete habit -->
        <button @click="() => openEditHabitModal(habit)">Edit</button>
        <button @click="() => stopHabit(habit.id)">Stop</button>
        <button @click="() => deleteHabit(habit.id)">Delete</button>
      </div>
    </div>
    <!-- Button to open modal for adding a new habit -->
    <button @click="openAddHabitModal">Add Habit</button>
    <!-- Modals for adding and editing habits -->
    <AddHabitModal 
      v-if="showAddHabitModal" 
      @close="showAddHabitModal = false" 
      @add-habit="addHabit" 
    />
    <EditHabitModal 
      v-if="showEditHabitModal" 
      :habit="currentHabit" 
      @close="showEditHabitModal = false" 
      @edit-habit="editHabit"
    />
  </div>
</template>

<script>
import { ref, computed, toRefs } from 'vue';
import AddHabitModal from './AddHabitModal.vue';
import EditHabitModal from './EditHabitModal.vue';

export default {
  components: {
    AddHabitModal,
    EditHabitModal,
  },
  props: {
    date: String,
    habits: Array,
    completions: Object,
  },
  setup(props, { emit }) {
    const { date, habits, completions } = toRefs(props);

    const showAddHabitModal = ref(false);
    const showEditHabitModal = ref(false);
    const currentHabit = ref(null);

    const isCompleted = (habitId) => {
      return completions.value[date.value]?.[habitId] || false;
    };

    const toggleCompletion = (habitId) => {
      emit('toggle-completion', { date: date.value, id: habitId });
    };

    const openAddHabitModal = () => {
      showAddHabitModal.value = true;
    };

    const addHabit = (habitName) => {
      emit('add-habit', habitName);
    };

    const openEditHabitModal = (habit) => {
      currentHabit.value = habit;
      showEditHabitModal.value = true;
    };

    const editHabit = ({ id, name }) => {
      emit('edit-habit', { id, name });
    };

    const stopHabit = (habitId) => {
      emit('stop-habit', habitId, date.value);
    };

    const deleteHabit = (habitId) => {
      emit('delete-habit', habitId);
    };

    return {
      date,
      habits,
      completions,
      showAddHabitModal,
      showEditHabitModal,
      currentHabit,
      isCompleted,
      toggleCompletion,
      openAddHabitModal,
      addHabit,
      openEditHabitModal,
      editHabit,
      stopHabit,
      deleteHabit,
    };
  },
};
</script>

<style scoped>
.habit-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.habit-item button {
  margin-left: 5px;
}

button {
  margin-top: 10px;
}
</style>
