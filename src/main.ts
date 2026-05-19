import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import PrimeVue from "primevue/config";
// import Aura from "@primeuix/themes/aura";

import "./assets/css/main.css";

import App from "./App.vue";
import router from "./router";

import ToastService from "primevue/toastservice";
import tooltip from "./directives/tooltip";
import Chart from "primevue/chart";

import BaseInput from "./components/BaseInput.vue";
import BaseButton from "./components/BaseButton.vue";
import BaseCard from "./components/BaseCard.vue";
import BaseMessage from "./components/BaseMessage.vue";
import BaseToast from "./components/BaseToast.vue";
import BaseDropdown from "./components/BaseDropdown.vue";
import BaseAvatar from "./components/BaseAvatar.vue";
import BaseSkeleton from "./components/BaseSkeleton.vue";
import BaseMenu from "./components/BaseMenu.vue";
import BaseBreadcrumb from "./components/BaseBreadcrumb.vue";
import BaseTable from "./components/table/BaseTable.vue";
import BaseChartCard from "./components/charts/BaseChartCard.vue";
import BaseStatCard from "./components/charts/BaseStatCard.vue";
import BaseBarChart from "./components/charts/BaseBarGraph.vue";
import BaseDonutChart from "./components/charts/BaseDonutGraph.vue";
import BaseLineChart from "./components/charts/BaseLineChart.vue";
import BaseWordCloud from "./components/charts/BaseWordCloud.vue";
import ErrorView from "./components/ErrorView.vue";

const app = createApp(App);

app
  .use(createPinia())
  .use(router)
  .use(VueQueryPlugin)
  .use(PrimeVue, {
    unstyled: true,
  })
  .use(ToastService);

app.directive("tooltip", tooltip);

app
  .component("BaseInput", BaseInput)
  .component("BaseButton", BaseButton)
  .component("BaseCard", BaseCard)
  .component("BaseMessage", BaseMessage)
  .component("BaseToast", BaseToast)
  .component("BaseDropdown", BaseDropdown)
  .component("BaseAvatar", BaseAvatar)
  .component("BaseSkeleton", BaseSkeleton)
  .component("BaseBreadcrumb", BaseBreadcrumb)
  .component("BaseMenu", BaseMenu)
  .component("BaseTable", BaseTable)
  .component("BaseChartCard", BaseChartCard)
  .component("BaseStatCard", BaseStatCard)
  .component("BaseBarChart", BaseBarChart)
  .component("BaseDonutChart", BaseDonutChart)
  .component("BaseLineChart", BaseLineChart)
  .component("BaseWordCloud", BaseWordCloud)
  .component("ErrorView", ErrorView)
  .component("Chart", Chart);

app.mount("#app");
