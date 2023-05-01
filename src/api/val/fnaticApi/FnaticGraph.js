const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const ChartjsPluginBackground = require("chartjs-plugin-background");

const createGraph = async (resultData) => {
  //have to pass in object
  const width = 600;
  const height = 400;

  const chartConfig = {
    type: "bar",
    data: {
      labels: ["Potential deaths and deaths"],
      datasets: [
        {
          label: "Survived on <25HP",
          data: [resultData["Deaths if you had light armor"]],
          backgroundColor: "rgba(255, 99, 132)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: "Heavy Armor Death",
          data: [resultData["Deaths on heavy armor"]],
          backgroundColor: "rgba(54, 162, 235)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        background: {
          color: "white",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
    plugins: [ChartjsPluginBackground],
  };
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(chartConfig);
  return imageBuffer;
};

module.exports = { createGraph };
