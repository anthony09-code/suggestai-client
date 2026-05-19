<script setup lang="ts">
import { ref, onMounted } from "vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);
});

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
    <!-- <div class="mb-10">
      <h2 class="text-xl font-medium">Dashboard</h2>
      <p class="text-base text-text-muted">
        Overview of student feedback across offices, highlighting common concerns, trends, and
        system usage.
      </p>
    </div> -->

    <div class="flex flex-row gap-2">
      <BaseStatCard
        class="w-full"
        label="Total Feedbacks"
        :value="1000"
        subtitle="this session"
        :loading="isLoading"
      />

      <BaseStatCard
        class="w-full"
        label="Topic founds"
        :value="36"
        subtitle="from analysis"
        :loading="isLoading"
      />

      <BaseStatCard
        class="w-full"
        label="Processed"
        :value="89"
        subtitle="0 pending"
        highlight="true"
        :loading="isLoading"
      />

      <BaseStatCard
        class="w-full"
        label="Sessions run"
        :value="10"
        subtitle="all time"
        :loading="isLoading"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
      <BaseChartCard
        class="lg:col-span-2"
        title="Feedback Volume Over Sessions"
        subtitle="Tracks feedback volume and topic generation trends per month"
        :loading="isLoading"
        height="280px"
      >
        <BaseLineChart
          :labels="[
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ]"
          :datasets="[
            {
              label: 'Feedbacks',
              data: [120, 200, 150, 300, 250, 100, 100, 100, 200, 250, 300, 400],
              yAxisID: 'y',
              tension: 0.4,
            },
            {
              label: 'Topics',
              data: [30, 60, 45, 80, 70, 40, 35, 50, 65, 90, 100, 120],
              yAxisID: 'y1',
              tension: 0.4,
            },
          ]"
          :axes="[
            { id: 'y', position: 'left', label: 'Feedbacks' },
            { id: 'y1', position: 'right', label: 'Topics', grid: false },
          ]"
          height="280px"
        />
      </BaseChartCard>

      <BaseChartCard
        title="Language Distribution"
        subtitle="All feedbacks"
        :loading="isLoading"
        height="280px"
      >
        <BaseDonutChart
          :labels="['English', 'Tagalog', 'Taglish', 'Other']"
          :datasets="[{ data: [60, 25, 15, 10] }]"
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
      title="Top Feedback Sample per Topic"
      subtitle="All feedbacks"
      :loading="isLoading"
      height="280px"
    >
      <BaseDonutChart
        :labels="['English', 'Tagalog', 'Taglish', 'Other']"
        :datasets="[{ data: [60, 25, 15, 10] }]"
        height="280px"
      />
    </BaseChartCard>
  </main>
</template>
