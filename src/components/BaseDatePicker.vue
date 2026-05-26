<script setup lang="ts">
import { ref, computed } from "vue";

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

const props = withDefaults(
  defineProps<{
    modelValue?: DateRange;
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
  }>(),
  {
    modelValue: () => ({ from: null, to: null }),
    placeholder: "Select date range",
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: DateRange): void;
  (e: "change", value: DateRange): void;
}>();

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const PRESETS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "wtd", label: "Week to date" },
  { key: "mtd", label: "Month to date" },
  { key: "qtd", label: "Quarter to date" },
  { key: "ytd", label: "Year to date" },
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const isOpen = ref(false);
const selecting = ref<"from" | "to" | null>("from");
const hoveredDate = ref<Date | null>(null);
const activePreset = ref<string | null>(null);
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

const range = ref<DateRange>({
  from: props.modelValue?.from ?? null,
  to: props.modelValue?.to ?? null,
});

// ── computed ──────────────────────────────────────────────────────────────────

const monthLabel = computed(() => `${MONTHS[currentMonth.value]} ${currentYear.value}`);

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  const daysInPrev = new Date(currentYear.value, currentMonth.value, 0).getDate();
  const days: { date: Date; current: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--)
    days.push({
      date: new Date(currentYear.value, currentMonth.value - 1, daysInPrev - i),
      current: false,
    });
  for (let i = 1; i <= daysInMonth; i++)
    days.push({ date: new Date(currentYear.value, currentMonth.value, i), current: true });
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++)
    days.push({ date: new Date(currentYear.value, currentMonth.value + 1, i), current: false });

  return days;
});

const triggerLabel = computed(() => {
  if (!range.value.from && !range.value.to) return null;
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (range.value.from && range.value.to)
    return `${fmt(range.value.from)} – ${fmt(range.value.to)}`;
  if (range.value.from) return `${fmt(range.value.from)} – …`;
  return null;
});

const dayCount = computed(() => {
  if (!range.value.from || !range.value.to) return null;
  return Math.round(Math.abs(range.value.to.getTime() - range.value.from.getTime()) / 86400000) + 1;
});

// ── helpers ───────────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isFrom(d: Date) {
  return range.value.from ? isSameDay(d, range.value.from) : false;
}
function isTo(d: Date) {
  return range.value.to ? isSameDay(d, range.value.to) : false;
}
function isToday(d: Date) {
  return isSameDay(d, today);
}

function isDisabled(d: Date) {
  if (props.minDate && d < props.minDate) return true;
  if (props.maxDate && d > props.maxDate) return true;
  return false;
}

function isInRange(d: Date) {
  const from = range.value.from;
  const to = selecting.value === "to" ? (hoveredDate.value ?? range.value.to) : range.value.to;
  if (!from || !to) return false;
  const lo = from < to ? from : to;
  const hi = from < to ? to : from;
  return d > lo && d < hi;
}

function formatFull(d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// ── navigation ────────────────────────────────────────────────────────────────

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else currentMonth.value--;
}
function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else currentMonth.value++;
}

// ── open / close ──────────────────────────────────────────────────────────────

function openPicker() {
  if (props.disabled) return;
  isOpen.value = true;
  if (range.value.from) {
    currentMonth.value = range.value.from.getMonth();
    currentYear.value = range.value.from.getFullYear();
  }
}
function closePicker() {
  isOpen.value = false;
  hoveredDate.value = null;
}

// ── preset selection ──────────────────────────────────────────────────────────

function applyPreset(key: string) {
  activePreset.value = key;
  const d = new Date(today);

  if (key === "today") {
    range.value.from = new Date(today);
    range.value.to = new Date(today);
  } else if (key === "yesterday") {
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    range.value.from = y;
    range.value.to = new Date(y);
  } else if (key === "7d") {
    const s = new Date(today);
    s.setDate(s.getDate() - 6);
    range.value.from = s;
    range.value.to = new Date(today);
  } else if (key === "30d") {
    const s = new Date(today);
    s.setDate(s.getDate() - 29);
    range.value.from = s;
    range.value.to = new Date(today);
  } else if (key === "90d") {
    const s = new Date(today);
    s.setDate(s.getDate() - 89);
    range.value.from = s;
    range.value.to = new Date(today);
  } else if (key === "wtd") {
    const s = new Date(today);
    s.setDate(s.getDate() - s.getDay());
    range.value.from = s;
    range.value.to = new Date(today);
  } else if (key === "mtd") {
    range.value.from = new Date(today.getFullYear(), today.getMonth(), 1);
    range.value.to = new Date(today);
  } else if (key === "qtd") {
    const q = Math.floor(today.getMonth() / 3);
    range.value.from = new Date(today.getFullYear(), q * 3, 1);
    range.value.to = new Date(today);
  } else if (key === "ytd") {
    range.value.from = new Date(today.getFullYear(), 0, 1);
    range.value.to = new Date(today);
  }

  if (range.value.from) {
    currentMonth.value = range.value.from.getMonth();
    currentYear.value = range.value.from.getFullYear();
  }

  selecting.value = null;
  emit("update:modelValue", { ...range.value });
  emit("change", { ...range.value });
  closePicker();
}

// ── day selection ─────────────────────────────────────────────────────────────

function selectDay(date: Date) {
  if (isDisabled(date)) return;
  activePreset.value = null;

  if (selecting.value === "from") {
    range.value.from = date;
    range.value.to = null;
    selecting.value = "to";
  } else {
    if (range.value.from && date < range.value.from) {
      range.value.to = range.value.from;
      range.value.from = date;
    } else {
      range.value.to = date;
    }
    selecting.value = null;
    hoveredDate.value = null;
    emit("update:modelValue", { ...range.value });
    emit("change", { ...range.value });
    closePicker();
  }
}

function clearRange() {
  range.value = { from: null, to: null };
  activePreset.value = null;
  selecting.value = "from";
  emit("update:modelValue", { ...range.value });
  emit("change", { ...range.value });
}

// ── day CSS classes ───────────────────────────────────────────────────────────

function dayClasses(date: Date, current: boolean) {
  const from = isFrom(date);
  const to = isTo(date);
  const inRange = isInRange(date);
  const disabled = isDisabled(date);
  const isStart = from && range.value.to && range.value.from! < range.value.to;
  const isEnd = to && range.value.from && range.value.from < range.value.to!;

  return [
    "day",
    !current && !from && !to ? "other-month" : "",
    disabled ? "disabled" : "",
    (from || to) && isStart && !isEnd ? "ep rs" : "",
    (from || to) && isEnd && !isStart ? "ep re" : "",
    (from || to) && isStart && isEnd ? "ep rs re" : "",
    (from || to) && !isStart && !isEnd ? "ep rs re" : "",
    inRange && !from && !to ? "in-range" : "",
    isToday(date) && current ? "today-dot" : "",
    !from && !to && !inRange && !disabled ? "hoverable" : "",
  ]
    .filter(Boolean)
    .join(" ");
}
</script>

<template>
  <div class="drp" v-click-outside="closePicker">
    <!-- Trigger -->
    <button
      type="button"
      :disabled="disabled"
      :class="['trigger', isOpen && 'open', !triggerLabel && 'placeholder-state']"
      @click="openPicker"
    >
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </svg>
      <span class="trigger-val">{{ triggerLabel ?? placeholder }}</span>
      <Transition name="fade">
        <button
          v-if="range.from || range.to"
          type="button"
          class="clear-btn"
          @click.stop="clearRange"
          aria-label="Clear date range"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </Transition>
      <svg
        class="chevron"
        :class="{ rotated: isOpen }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

    <!-- Dropdown -->
    <Transition name="pop">
      <div v-if="isOpen" class="popup">
        <!-- Sidebar presets -->
        <aside class="sidebar">
          <p class="sidebar-label">Quick select</p>
          <button
            v-for="p in PRESETS"
            :key="p.key"
            type="button"
            :class="['preset-btn', activePreset === p.key && 'active']"
            @click="applyPreset(p.key)"
          >
            {{ p.label }}
          </button>
        </aside>

        <!-- Calendar -->
        <div class="cal-panel">
          <!-- Month nav -->
          <div class="cal-header">
            <button type="button" class="nav-btn" @click="prevMonth">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span class="month-label">{{ monthLabel }}</span>
            <button type="button" class="nav-btn" @click="nextMonth">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <!-- Day names -->
          <div class="day-names">
            <span v-for="d in DAYS" :key="d" class="day-name">{{ d }}</span>
          </div>

          <!-- Days -->
          <div class="days-grid">
            <div
              v-for="({ date, current }, i) in calendarDays"
              :key="i"
              :class="dayClasses(date, current)"
              @click="!isDisabled(date) && selectDay(date)"
              @mouseenter="hoveredDate = date"
              @mouseleave="hoveredDate = null"
            >
              {{ date.getDate() }}
              <span
                v-if="isToday(date) && current && !isFrom(date) && !isTo(date)"
                class="today-indicator"
              />
            </div>
          </div>

          <!-- Footer hint -->
          <div class="cal-footer">
            <span v-if="selecting === 'from'" class="hint">Pick a start date</span>
            <span v-else-if="selecting === 'to'" class="hint">Now pick an end date</span>
            <span v-else-if="dayCount" class="day-count"
              >{{ dayCount }} {{ dayCount === 1 ? "day" : "days" }} selected</span
            >
          </div>
        </div>
      </div>
    </Transition>

    <!-- Result summary (optional — remove if not needed) -->
    <Transition name="fade">
      <div v-if="range.from && range.to" class="result-bar">
        <strong>{{ formatFull(range.from) }}</strong>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <strong>{{ formatFull(range.to) }}</strong>
        <span class="result-count">· {{ dayCount }} {{ dayCount === 1 ? "day" : "days" }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ── Reset ── */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* ── Trigger ── */
.drp {
  position: relative;
  display: inline-block;
  font-family: inherit;
}

.trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 40px;
  min-width: 220px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #1e293b;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}
.trigger:hover {
  border-color: #94a3b8;
}
.trigger.open {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.12);
}
.trigger:disabled {
  opacity: 0.5;
  pointer-events: none;
}
.trigger.placeholder-state .trigger-val {
  color: #94a3b8;
}

.trigger .icon {
  width: 16px;
  height: 16px;
  color: #94a3b8;
  flex-shrink: 0;
}
.trigger-val {
  flex: 1;
  text-align: left;
}
.trigger .chevron {
  width: 14px;
  height: 14px;
  color: #94a3b8;
  flex-shrink: 0;
  transition: transform 0.2s;
}
.trigger .chevron.rotated {
  transform: rotate(180deg);
}

.clear-btn {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.clear-btn svg {
  width: 10px;
  height: 10px;
  color: #64748b;
}
.clear-btn:hover {
  background: #fee2e2;
}
.clear-btn:hover svg {
  color: #dc2626;
}

/* ── Popup ── */
.popup {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 100;
  display: flex;
  width: 500px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 30px rgb(0 0 0 / 0.08);
  overflow: hidden;
}

/* ── Sidebar ── */
.sidebar {
  width: 148px;
  flex-shrink: 0;
  border-right: 1px solid #f1f5f9;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sidebar-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  padding: 2px 8px 8px;
}
.preset-btn {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: #475569;
  padding: 7px 10px;
  border-radius: 8px;
  transition:
    background 0.1s,
    color 0.1s;
}
.preset-btn:hover {
  background: #f8fafc;
  color: #1e293b;
}
.preset-btn.active {
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 500;
}

/* ── Calendar panel ── */
.cal-panel {
  flex: 1;
  padding: 14px 14px 12px;
  min-width: 0;
}

.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.nav-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition:
    border-color 0.12s,
    color 0.12s;
}
.nav-btn svg {
  width: 14px;
  height: 14px;
}
.nav-btn:hover {
  border-color: #a5b4fc;
  color: #4f46e5;
}
.month-label {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.day-names {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 2px;
}
.day-name {
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  padding: 3px 0;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  font-size: 13px;
  cursor: pointer;
  position: relative;
  color: #1e293b;
  border-radius: 8px;
  transition:
    background 0.08s,
    color 0.08s;
  user-select: none;
}
.day.other-month {
  color: #cbd5e1;
}
.day.disabled {
  color: #cbd5e1;
  cursor: not-allowed;
}
.day.hoverable:hover {
  background: #f1f5f9;
}

/* range highlight */
.day.in-range {
  background: #eef2ff;
  color: #4338ca;
  border-radius: 0;
}

/* endpoints */
.day.ep {
  background: #eef2ff;
  color: #4338ca;
  font-weight: 600;
}
.day.ep.rs {
  border-radius: 8px 0 0 8px;
}
.day.ep.re {
  border-radius: 0 8px 8px 0;
}
.day.ep.rs.re {
  border-radius: 8px;
}

/* today dot */
.today-indicator {
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #6366f1;
}

/* ── Footer ── */
.cal-footer {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
  min-height: 26px;
}
.hint {
  font-size: 12px;
  color: #94a3b8;
}
.day-count {
  font-size: 12px;
  font-weight: 500;
  color: #6366f1;
}

/* ── Result bar ── */
.result-bar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 13px;
  color: #475569;
}
.result-bar strong {
  color: #1e293b;
  font-weight: 500;
}
.result-bar svg {
  width: 14px;
  height: 14px;
  color: #94a3b8;
}
.result-count {
  color: #94a3b8;
}

/* ── Transitions ── */
.pop-enter-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.pop-leave-active {
  transition:
    opacity 0.1s ease,
    transform 0.1s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.fade-enter-active {
  transition: opacity 0.15s;
}
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
