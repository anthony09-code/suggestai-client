<script setup lang="ts">
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
    <div class="mb-10">
      <h2 class="text-xl font-medium">Dashboard</h2>
      <p class="text-base text-text-muted">
        Overview of student feedback across offices, highlighting common concerns, trends, and
        system usage.
      </p>
    </div>

    <div class="flex flex-row gap-2">
      <BaseCard class="w-full">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-text-muted">Total Feedbacks</span>
          <span class="text-base font-medium text-text">1000</span>
        </div>
        <span class="text-xs text-primary">+12% this week</span>
      </BaseCard>

      <BaseCard class="w-full">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-text-muted">Topics found</span>
          <span class="text-base font-medium text-text">36</span>
        </div>
        <span class="text-xs text-text-muted">Across all offices</span>
      </BaseCard>

      <BaseCard class="w-full">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-text-muted">Offices</span>
          <span class="text-base font-medium text-text">8</span>
        </div>
        <span class="text-xs text-text-muted">All Active</span>
      </BaseCard>

      <BaseCard class="w-full">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-text-muted">Sessions run</span>
          <span class="text-base font-medium text-text">18</span>
        </div>
        <span class="text-xs text-text-muted">This month</span>
      </BaseCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
      <BaseChartCard class="lg:col-span-2">
        <BaseBarChart
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
              label: 'Feedback Submissions',
              data: [120, 200, 150, 300, 250, 100, 100, 100, 200, 250, 300, 400],
            },
          ]"
          title="Feedback Submissions"
          subtitle="Monthly breakdown"
          height="280px"
        />
      </BaseChartCard>
      <BaseChartCard>
        <BaseDonutChart
          :labels="['English', 'Tagalog', 'Taglish', 'Other']"
          :datasets="[{ data: [60, 25, 15, 10] }]"
          title="Language Distribution"
          subtitle="All feedbacks"
          height="280px"
        />
      </BaseChartCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
      <BaseChartCard>
        <BaseDonutChart
          :labels="['Anonymous', 'Identified']"
          :datasets="[{ data: [60, 25] }]"
          title="Anonymous vs Identified"
          subtitle="All time ratio"
          height="280px"
        />
      </BaseChartCard>
      <BaseChartCard class="lg:col-span-2">
        <BaseBarChart
          :labels="['Saso Office', 'Feb', 'Mar', 'Apr', 'May']"
          :datasets="[{ label: 'Topics by Office', data: [1, 5, 10, 15, 20] }]"
          title="Topics by Office"
          subtitle="Latest analysis session"
          height="280px"
          horizontal
        />
      </BaseChartCard>
    </div>

    <BaseChartCard>
      <BaseWordCloud
        title="Top topics across all offices"
        subtitle="Most common student concerns"
        :words="wordCloudData"
      />
    </BaseChartCard>
  </main>
</template>
