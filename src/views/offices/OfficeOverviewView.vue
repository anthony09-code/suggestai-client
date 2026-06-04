<script setup lang="ts">
import { ref, onMounted } from "vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);
});
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
        label="Total Topics"
        :value="43"
        subtitle="this session"
        :loading="isLoading"
      />

      <BaseStatCard
        class="w-full"
        label="Feedbacks analyzed"
        :value="36"
        subtitle="100% of submitted"
        :loading="isLoading"
      />

      <BaseStatCard
        class="w-full"
        label="Avg confidence"
        :value="0.82"
        subtitle="Across all topics"
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
        title="Confidence breakdown"
        subtitle="Topic assignment quality"
        :loading="isLoading"
        height="280px"
      >
        <BaseDonutChart
          :labels="['High', 'Medium', 'Low']"
          :datasets="[{ data: [612, 213, 176] }]"
          height="280px"
        />
      </BaseChartCard>
    </div>

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
