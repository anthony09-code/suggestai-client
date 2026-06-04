<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useFeedbackStats } from "../../features/feedback/composables/use.stats.feedback";

const { stats, isLoading } = useFeedbackStats();

const feedbackTrendLabels = computed(() =>
  Array.isArray(stats.value?.feedback_trend) ? stats.value.feedback_trend.map((t) => t.month) : [],
);
const feedbackTrendData = computed(() =>
  Array.isArray(stats.value?.feedback_trend) ? stats.value.feedback_trend.map((t) => t.count) : [],
);

const feedbacksPerOfficeLabels = computed(() =>
  Array.isArray(stats.value?.feedbacks_per_office)
    ? stats.value.feedbacks_per_office.map((o) => o.office_name)
    : [],
);
const feedbacksPerOfficeData = computed(() =>
  Array.isArray(stats.value?.feedbacks_per_office)
    ? stats.value.feedbacks_per_office.map((o) => o.feedback_count)
    : [],
);

// const isLoading = ref(true);

// onMounted(() => {
//   setTimeout(() => {
//     isLoading.value = false;
//   }, 1500);
// });

const wordCloudData = [
  { text: "Facility issues", weight: 10 },
  { text: "Staff concerns", weight: 8 },
  { text: "Process delays", weight: 6 },
  { text: "Wifi & internet", weight: 7 },
  { text: "Food & canteen", weight: 5 },
  { text: "Library resources", weight: 4 },
  { text: "Classroom comfort", weight: 9 },
  { text: "Tuition fees", weight: 7 },
  { text: "Scholarship concerns", weight: 6 },
  { text: "Enrollment process", weight: 8 },
  { text: "Document processing", weight: 7 },
  { text: "Guidance counseling", weight: 4 },
  { text: "Health services", weight: 5 },
  { text: "Restroom cleanliness", weight: 6 },
  { text: "Parking issues", weight: 3 },
  { text: "Laboratory equipment", weight: 5 },
  { text: "Teaching quality", weight: 8 },
  { text: "Grade concerns", weight: 7 },
  { text: "Extracurricular", weight: 3 },
  { text: "Campus safety", weight: 6 },
  { text: "Noise level", weight: 4 },
];
</script>

<template>
  <main class="flex flex-col gap-2">
    <div class="mb-6">
      <h2 class="text-xl font-medium">Dashboard</h2>
      <p class="text-base text-text-muted">
        Overview of student feedback across offices, highlighting common concerns, trends, and
        system usage.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      <BaseStatCard
        label="Total Feedbacks"
        :value="stats?.total_feedbacks ?? 0"
        subtitle="All across offices"
        :loading="isLoading"
      />
      <BaseStatCard
        label="Topics found"
        :value="36"
        subtitle="Across all offices"
        :loading="isLoading"
      />
      <BaseStatCard label="Offices" :value="8" subtitle="All Active" :loading="isLoading" />
      <BaseStatCard label="Sessions run" :value="18" subtitle="This month" :loading="isLoading" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
      <BaseChartCard
        class="lg:col-span-2"
        title="Feedback Submissions"
        subtitle="Monthly breakdown"
        :loading="isLoading"
        height="280px"
      >
        <BaseBarChart
          :key="feedbackTrendData.join(',')"
          :labels="feedbackTrendLabels"
          :datasets="[{ label: 'Feedback Submissions', data: feedbackTrendData }]"
          height="280px"
        />
      </BaseChartCard>

      <BaseChartCard
        title="Feedback Status"
        subtitle="All feedbacks"
        :loading="isLoading"
        height="280px"
      >
        <BaseDonutChart
          :labels="['Processed', 'Pending']"
          :datasets="[{ data: [60, 25] }]"
          height="280px"
        />
      </BaseChartCard>
    </div>

    <BaseChartCard
      title="Feedbacks per Office"
      subtitle="Comparison across offices"
      :loading="isLoading"
    >
      <BaseBarChart
        :key="feedbacksPerOfficeData.join(',')"
        :labels="feedbacksPerOfficeLabels"
        :datasets="[{ label: 'Feedbacks', data: feedbacksPerOfficeData }]"
        horizontal
        height="280px"
      />
    </BaseChartCard>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
      <BaseChartCard
        title="Anonymous vs Identified"
        subtitle="All time ratio"
        :loading="isLoading"
        height="280px"
      >
        <BaseDonutChart
          :labels="['Anonymous', 'Identified']"
          :datasets="[{ data: [60, 25] }]"
          height="280px"
        />
      </BaseChartCard>

      <BaseChartCard
        class="lg:col-span-2"
        title="Topics by Office"
        subtitle="Latest analysis session"
        :loading="isLoading"
        height="280px"
      >
        <BaseBarChart
          :labels="['Saso Office', 'Feb', 'Mar', 'Apr', 'May']"
          :datasets="[{ label: 'Topics by Office', data: [1, 5, 10, 15, 20] }]"
          horizontal
          height="280px"
        />
      </BaseChartCard>
    </div>

    <BaseChartCard
      title="Recent Analysis Sessions"
      subtitle="Latest processed feedback analysis"
      :loading="isLoading"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-text-muted border-b border-border">
              <th class="py-2">Office</th>
              <th class="py-2">Feedbacks</th>
              <th class="py-2">Status</th>
              <th class="py-2">Date</th>
            </tr>
          </thead>

          <tbody>
            <tr class="border-b border-border" v-for="i in 4" :key="i">
              <td class="py-2">Office {{ i }}</td>
              <td class="py-2">{{ i * 40 }}</td>
              <td class="py-2 text-primary">Completed</td>
              <td class="py-2 text-text-muted">2 hours ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseChartCard>

    <BaseChartCard
      title="Top topics across all offices"
      subtitle="Most common student concerns"
      :loading="isLoading"
      height="320px"
    >
      <BaseWordCloud :words="wordCloudData" />
    </BaseChartCard>
  </main>
</template>
