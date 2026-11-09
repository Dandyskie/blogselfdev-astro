<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Habit {
  id: number;
  text: string;
  icon: string;
  completed: boolean;
}

const defaultHabits: Habit[] = [
  { id: 1, text: 'Minum 2 Liter Air Putih', icon: '💧', completed: true },
  { id: 2, text: 'Membaca Buku Self Dev 15 Menit', icon: '📖', completed: true },
  { id: 3, text: 'Latihan Pernapasan / Meditasi 5 Menit', icon: '🧘', completed: false },
  { id: 4, text: 'Olahraga Ringan / Jalan Kaki 20 Menit', icon: '🏃', completed: false },
  { id: 5, text: 'Menulis 3 Hal yang Disyukuri (Gratitude)', icon: '✍️', completed: false },
];

const habits = ref<Habit[]>([]);
const newHabitText = ref('');
const streakCount = ref(7);

const quotes = [
  { text: 'Kita tidak menjadi apa yang kita inginkan, kita menjadi apa yang kita biasakan setiap hari.', author: 'James Clear' },
  { text: 'Kebahagiaan hidup Anda bergantung pada kualitas pikiran yang Anda rawat.', author: 'Marcus Aurelius' },
  { text: 'Fokuslah pada proses dan progres 1%, bukan sekadar hasil instan.', author: 'Atomic Habits' },
  { text: 'Masa depan Anda diciptakan oleh apa yang Anda lakukan hari ini, bukan besok.', author: 'Robert Kiyosaki' },
  { text: 'Kedisiplinan adalah jembatan antara tujuan dan pencapaian nyata.', author: 'Jim Rohn' },
];

const currentQuoteIndex = ref(0);

const currentQuote = computed(() => quotes[currentQuoteIndex.value]);

const nextQuote = () => {
  currentQuoteIndex.value = (currentQuoteIndex.value + 1) % quotes.length;
};

const completedCount = computed(() => {
  return habits.value.filter((h) => h.completed).length;
});

const progressPercentage = computed(() => {
  if (habits.value.length === 0) return 0;
  return Math.round((completedCount.value / habits.value.length) * 100);
});

const encouragementMessage = computed(() => {
  const pct = progressPercentage.value;
  if (pct === 100) return '🎉 Sempurna! Semua kebiasaan hari ini telah tuntas. Pertahankan momentum!';
  if (pct >= 60) return '💪 Keren banget! Kamu sudah menyelesaikan lebih dari separuh target harian.';
  if (pct >= 20) return '🌱 Langkah awal yang bagus. Selesaikan satu kebiasaan lagi sekarang!';
  return '✨ Awali harimu dengan satu kebiasaan kecil sekarang. Kamu pasti bisa!';
});

const toggleHabit = (id: number) => {
  const habit = habits.value.find((h) => h.id === id);
  if (habit) {
    habit.completed = !habit.completed;
    saveHabits();
  }
};

const addHabit = () => {
  if (!newHabitText.value.trim()) return;
  habits.value.push({
    id: Date.now(),
    text: newHabitText.value.trim(),
    icon: '🎯',
    completed: false,
  });
  newHabitText.value = '';
  saveHabits();
};

const removeHabit = (id: number) => {
  habits.value = habits.value.filter((h) => h.id !== id);
  saveHabits();
};

const saveHabits = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bertumbuh_habits', JSON.stringify(habits.value));
    } catch {
      // ignore
    }
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('bertumbuh_habits');
      if (saved) {
        habits.value = JSON.parse(saved);
        return;
      }
    } catch {
      // fallback
    }
  }
  habits.value = defaultHabits;
});
</script>

<template>
  <div class="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-800/40 relative overflow-hidden">
    <!-- Background Glow Accent -->
    <div class="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10">
      <!-- Widget Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-800/50">
        <div>
          <div class="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 mb-2">
            <span>⚡ Interactive Vue 3 Widget</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Daily Habit & Growth Tracker
          </h3>
          <p class="text-xs sm:text-sm text-emerald-100/70 mt-0.5">
            Bangun konsistensi harian Anda dan rasakan kemajuan 1% setiap hari.
          </p>
        </div>

        <!-- Streak Badge -->
        <div class="flex items-center gap-3 bg-emerald-950/60 border border-emerald-700/50 px-4 py-2.5 rounded-2xl self-start sm:self-auto">
          <span class="text-2xl">🔥</span>
          <div>
            <div class="text-xs text-emerald-300/80 font-medium">Daily Streak</div>
            <div class="text-base font-bold text-white">{{ streakCount }} Hari Berturut-turut</div>
          </div>
        </div>
      </div>

      <!-- Motivational Quote Banner -->
      <div class="my-6 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div class="flex items-start gap-3">
          <span class="text-xl">💡</span>
          <div>
            <p class="text-xs sm:text-sm italic text-emerald-50">"{{ currentQuote.text }}"</p>
            <span class="text-[11px] text-emerald-300/70 font-semibold">— {{ currentQuote.author }}</span>
          </div>
        </div>
        <button
          @click="nextQuote"
          class="text-xs text-emerald-300 hover:text-white bg-emerald-800/40 hover:bg-emerald-700/60 px-3 py-1.5 rounded-lg border border-emerald-600/30 transition-all shrink-0 cursor-pointer"
        >
          Quotes Baru ↻
        </button>
      </div>

      <!-- Progress Section -->
      <div class="mb-6">
        <div class="flex justify-between items-center text-xs sm:text-sm mb-2 font-medium">
          <span class="text-emerald-200">Progres Hari Ini: {{ completedCount }} dari {{ habits.length }} Kebiasaan</span>
          <span class="text-emerald-300 font-bold text-base">{{ progressPercentage }}%</span>
        </div>
        <div class="w-full bg-slate-800/80 rounded-full h-3 p-0.5 border border-emerald-800/40 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-emerald-400 to-teal-300 shadow-sm shadow-emerald-400"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <p class="text-xs text-emerald-200/80 mt-2 italic">
          {{ encouragementMessage }}
        </p>
      </div>

      <!-- Habits Checklist Grid -->
      <div class="space-y-2.5 mb-6">
        <div
          v-for="habit in habits"
          :key="habit.id"
          @click="toggleHabit(habit.id)"
          class="group flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer"
          :class="habit.completed
            ? 'bg-emerald-900/40 border-emerald-600/50 shadow-inner'
            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-emerald-500/40'"
        >
          <div class="flex items-center gap-3">
            <span class="text-lg">{{ habit.icon }}</span>
            <span
              class="text-xs sm:text-sm font-medium transition-colors"
              :class="habit.completed ? 'line-through text-emerald-200/60' : 'text-white group-hover:text-emerald-200'"
            >
              {{ habit.text }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <!-- Custom Styled Checkbox Indicator -->
            <div
              class="w-6 h-6 rounded-lg flex items-center justify-center border transition-all"
              :class="habit.completed ? 'bg-emerald-400 border-emerald-300 text-slate-900' : 'border-slate-500 group-hover:border-emerald-400'"
            >
              <svg v-if="habit.completed" class="w-4 h-4 fill-current stroke-current" viewBox="0 0 20 20">
                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
              </svg>
            </div>
            <!-- Delete habit if custom -->
            <button
              v-if="habit.id > 10"
              @click.stop="removeHabit(habit.id)"
              class="text-slate-400 hover:text-red-400 text-xs px-1"
              title="Hapus"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- Add New Custom Habit Input -->
      <form @submit.prevent="addHabit" class="flex gap-2">
        <input
          v-model="newHabitText"
          type="text"
          placeholder="Tambah kebiasaan harian baru Anda..."
          class="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-emerald-100/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shrink-0 cursor-pointer"
        >
          + Tambah
        </button>
      </form>
    </div>
  </div>
</template>

