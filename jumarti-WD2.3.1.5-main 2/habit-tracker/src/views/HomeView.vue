<template>
  <div>
    <!-- Include day navigation and habit list components -->
    <DayNavigation :date="date" @update-date="updateDate" />
    <HabitList 
      :date="date" 
      :habits="filteredHabits" 
      :completions="completions" 
      @toggle-completion="toggleCompletion" 
      @add-habit="addHabit"
      @edit-habit="editHabit"
      @stop-habit="stopHabit"
      @delete-habit="deleteHabit"
    />
  </div>
</template>

<script>
import { reactive, toRefs, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DayNavigation from '@/components/DayNavigation.vue'
import HabitList from '@/components/HabitList.vue'

export default {
  components: {
    DayNavigation,
    HabitList,
  },
  setup() {
    // Initialize reactive state for habits and completions
    const state = reactive({
      habits: [],
      completions: {}, // { '2023-07-29': { habitId: true } }
    })

    const route = useRoute()
    const router = useRouter()

    // Compute the current date from the route parameters
    const date = computed(() => route.params.date)

    // Update the current date in the URL
    const updateDate = (newDate) => {
      router.push(`/day/${newDate}`)
    }

    // Toggle the completion status of a habit for a given date
    const toggleCompletion = ({ date, id }) => {
      if (!state.completions[date]) {
        state.completions[date] = {}
      }
      state.completions[date][id] = !state.completions[date][id]
    }

    // Add a new habit to the state
    const addHabit = (habitName) => {
      const id = Date.now().toString()
      state.habits.push({ id, name: habitName, stoppedAt: null })
    }

    // Edit an existing habit's name
    const editHabit = ({ id, name }) => {
      const habit = state.habits.find((h) => h.id === id)
      if (habit) {
        habit.name = name
      }
    }

    // Stop a habit from a certain date forward
    const stopHabit = (id, date) => {
      const habit = state.habits.find((h) => h.id === id)
      if (habit) {
        habit.stoppedAt = date
      }
    }

    // Delete a habit and its completion records
    const deleteHabit = (id) => {
      state.habits = state.habits.filter((h) => h.id !== id)
      Object.keys(state.completions).forEach((date) => {
        delete state.completions[date][id]
      })
    }

    // Filter habits to exclude those stopped before the current date
    const filteredHabits = computed(() => {
      return state.habits.filter(
        (habit) => !habit.stoppedAt || habit.stoppedAt >= date.value
      )
    })

    // Load habits and completions from localStorage with error handling
    const loadFromLocalStorage = () => {
      try {
        const savedHabits = JSON.parse(localStorage.getItem('habits'));
        const savedCompletions = JSON.parse(localStorage.getItem('completions'));
        if (savedHabits) state.habits = savedHabits;
        if (savedCompletions) state.completions = savedCompletions;
      } catch (error) {
        console.error('Failed to load from localStorage', error);
      }
    };

    // Save habits and completions to localStorage with error handling
    const saveToLocalStorage = () => {
      try {
        localStorage.setItem('habits', JSON.stringify(state.habits));
        localStorage.setItem('completions', JSON.stringify(state.completions));
      } catch (error) {
        console.error('Failed to save to localStorage', error);
      }
    };

    // Initialize state from localStorage
    loadFromLocalStorage()

    // Watch for changes and save to localStorage
    watch(state.habits, saveToLocalStorage, { deep: true })
    watch(state.completions, saveToLocalStorage, { deep: true })

    return {
      ...toRefs(state),
      date,
      updateDate,
      toggleCompletion,
      addHabit,
      editHabit,
      stopHabit,
      deleteHabit,
      filteredHabits,
    }
  },
}
</script>
