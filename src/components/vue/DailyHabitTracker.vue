<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Habit {
  id: number;
  text: string;
  category: string;
  completed: boolean;
}

const defaultHabits: Habit[] = [
  { id: 1, text: 'Berjalan kaki 15 menit tanpa mengecek ponsel', category: 'Kesehatan Fisik', completed: true },
  { id: 2, text: 'Menuliskan hal yang mengganjal di pikiran ke buku catatan', category: 'Mental Clarity', completed: true },
  { id: 3, text: 'Membaca 10 halaman buku sebelum tidur', category: 'Literasi Diri', completed: false },
  { id: 4, text: 'Mengambil jeda napas sadar tiga menit saat mulai kewalahan', category: 'Mindfulness', completed: false },
  { id: 5, text: 'Mematikan notifikasi non-darurat setelah pukul 20.00', category: 'Digital Detox', completed: false },
];

const habits = ref<Habit[]>([]);
const newHabitText = ref('');
const streakCount = ref(7);

const quotes = [
  { text: 'Ketenangan batin bermula saat Anda berhenti membiarkan situasi yang tidak bisa Anda kendalikan merusak hari Anda.', author: 'Marcus Aurelius' },
  { text: 'Anda tidak perlu menjadi luar biasa untuk memulai, tetapi Anda harus mulai mengambil langkah untuk bertumbuh.', author: 'James Clear' },
  { text: 'Membandingkan proses hidup Anda dengan garis finish orang lain adalah bentuk ketidakadilan paling kejam pada diri sendiri.', author: 'Catatan Redaksi wakeup' },
  { text: 'Istirahat yang cukup adalah bentuk tanggung jawab kerja jangka panjang, bukan bentuk kemalasan.', author: 'Refleksi Diri' },
  { text: 'Fokus pada satu hal yang bisa Anda selesaikan hari ini, bukan pada seratus hal yang belum tentu terjadi besok.', author: 'Mindset Harian' },
];

const currentQuoteIndex = ref(0);

const currentQuote = computed(() => quotes[currentQuoteIndex.value]);

const nextQuote = () => {
  currentQuoteIndex.value = (currentQuoteIndex.value + 1) % quotes.length;
};

const completedCount = computed(() => habits.value.filter((h) => h.completed).length);

const progressPercentage = computed(() => {
  if (habits.value.length === 0) return 0;
  return Math.round((completedCount.value / habits.value.length) * 100);
});

const progressNote = computed(() => {
  const pct = progressPercentage.value;
  if (pct === 100) return 'Seluruh niat sadar hari ini berhasil terpenuhi. Berikan penghargaan pada diri Anda.';
  if (pct >= 60) return 'Lebih dari separuh telah terselesaikan. Ritme harian Anda berjalan seimbang.';
  if (pct >= 20) return 'Satu langkah kecil telah diambil. Lanjutkan satu aktivitas lagi.';
  return 'Pilih satu aktivitas yang paling ringan untuk mengawali momentum hari ini.';
});

const toggleHabit = (id: number) => {
  const item = habits.value.find((h) => h.id === id);
  if (item) {
    item.completed = !item.completed;
    saveHabits();
  }
};

const addHabit = () => {
  if (!newHabitText.value.trim()) return;
  habits.value.push({
    id: Date.now(),
    text: newHabitText.value.trim(),
    category: 'Niat Pribadi',
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
      localStorage.setItem('wakeup_habits', JSON.stringify(habits.value));
    } catch {
      // ignore
    }
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('wakeup_habits');
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
  <div class="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs">
    <!-- Header Box -->
    <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-6 border-b border-stone-100">
      <div>
        <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
          <span>Logbook Interaktif</span>
          <span class="w-1 h-1 rounded-full bg-stone-400"></span>
          <span>Vue Island</span>
        </div>
        <h3 class="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
          Lembar Refleksi & Niat Harian
        </h3>
        <p class="text-xs sm:text-sm text-stone-500 mt-1">
          Pencatatan kebiasaan sadar untuk menjaga ritme hidup dan kesehatan mental Anda.
        </p>
      </div>

      <div class="inline-flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-md text-xs font-medium text-stone-700 self-start sm:self-auto">
        <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
        <span>Ritme Aktif: {{ streakCount }} Hari</span>
      </div>
    </div>

    <!-- Curated Editorial Quote -->
    <div class="my-6 p-4 rounded-lg bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div class="space-y-1">
        <p class="text-xs sm:text-sm italic text-stone-800 leading-relaxed font-serif">
          "{ currentQuote.text }"
        </p>
        <span class="text-[11px] font-semibold text-stone-500 block">
          koleksi kutipan: {{ currentQuote.author }}
        </span>
      </div>
      <button
        type="button"
        @click="nextQuote"
        class="min-h-[44px] px-3.5 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-md transition-colors shrink-0 cursor-pointer"
        aria-label="Ganti kutipan refleksi"
      >
        Ganti Kutipan ↻
      </button>
    </div>

    <!-- Progress Overview -->
    <div class="mb-6 space-y-2">
      <div class="flex justify-between items-baseline text-xs sm:text-sm text-stone-700 font-medium">
        <span>Ketercapaian: {{ completedCount }} dari {{ habits.length }} catatan</span>
        <span class="font-bold text-stone-900 text-base font-mono">{{ progressPercentage }}%</span>
      </div>
      <div class="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
        <div
          class="h-full bg-stone-900 transition-all duration-300 ease-out"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      <p class="text-xs text-stone-500">
        {{ progressNote }}
      </p>
    </div>

    <!-- Checklist Items -->
    <div class="space-y-2 mb-6" role="list">
      <div
        v-for="habit in habits"
        :key="habit.id"
        role="listitem"
        @click="toggleHabit(habit.id)"
        class="min-h-[48px] flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer select-none"
        :class="habit.completed
          ? 'bg-stone-50/80 border-stone-200 text-stone-400'
          : 'bg-white border-stone-200 hover:border-stone-400 text-stone-800'"
      >
        <div class="flex items-center gap-3">
          <!-- Accessible Checkbox indicator -->
          <div
            class="w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0"
            :class="habit.completed ? 'bg-stone-900 border-stone-900 text-white' : 'border-stone-300 bg-white'"
          >
            <svg v-if="habit.completed" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>

          <div class="space-y-0.5">
            <p
              class="text-xs sm:text-sm font-medium transition-all"
              :class="habit.completed ? 'line-through text-stone-400' : 'text-stone-800'"
            >
              {{ habit.text }}
            </p>
            <span class="text-[10px] text-stone-400 block uppercase tracking-wide">
              {{ habit.category }}
            </span>
          </div>
        </div>

        <button
          v-if="habit.id > 10"
          type="button"
          @click.stop="removeHabit(habit.id)"
          class="w-11 h-11 flex items-center justify-center text-stone-400 hover:text-stone-700 text-sm"
          title="Hapus catatan"
          aria-label="Hapus catatan ini"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Custom Habit Form -->
    <form @submit.prevent="addHabit" class="flex flex-col sm:flex-row gap-2">
      <label for="custom-habit-input" class="sr-only">Tambah niat harian baru</label>
      <input
        id="custom-habit-input"
        v-model="newHabitText"
        type="text"
        placeholder="Tuliskan komitmen kecil harian Anda..."
        class="flex-1 min-h-[44px] bg-stone-50 border border-stone-200 rounded-md px-3.5 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900"
      />
      <button
        type="submit"
        class="min-h-[44px] px-5 bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium text-xs rounded-md transition-colors shrink-0 cursor-pointer"
      >
        Simpan Niat
      </button>
    </form>
  </div>
</template>
