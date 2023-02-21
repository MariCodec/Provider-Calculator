// Отримання елементів DOM
let storageRange = document.getElementById("storage-range");
let transferRange = document.getElementById("transfer-range");
const storageValue = document.getElementById("storage-value");
const transferValue = document.getElementById("transfer-value");
const calculateButton = document.getElementById("calculate-button");
const result = document.getElementById("result");
const ctx = document.getElementById("myChart").getContext("2d");

// Обробка подій
storageRange.addEventListener("input", () => {
  storageValue.innerText = storageRange.value;
});

transferRange.addEventListener("input", () => {
  transferValue.innerText = transferRange.value;
});

calculateButton.addEventListener("click", () => {
  // Отримання значень Storage та Transfer
  let storage = parseInt(storageRange.value);
  let transfer = parseInt(transferRange.value);

  //

  // Розрахунок вартості послуг провайдерів
  const provider1StoragePrice = 0.005;
  const provider1TransferPrice = 0.01;
  const provider1MinPrice = 7;
  const provider1Price = Math.max(
    provider1MinPrice,
    provider1StoragePrice * storage + transfer * provider1TransferPrice
  );

  //

  const provider2HddStoragePrice = 0.01;
  const provider2SsdStoragePrice = 0.02;
  const provider2TransferPrice = 0.01;
  const provider2MaxPrice = 10;
  const isSeleckted = document.getElementById("storageType");
  const isHddStorage = isSeleckted.selectedIndex == 0 ? true : false;
  // Отримати значення з елементу DOM

  const provider2StoragePrice = isHddStorage
    ? provider2HddStoragePrice
    : provider2SsdStoragePrice;

  const provider2Price = Math.min(
    provider2MaxPrice,
    provider2StoragePrice * storage + transfer * provider2TransferPrice
  );

  //

  const provider3MultiStoragePrice = storage <= 75 ? 0 : (storage - 75) * 0.06;
  const provider3SingleStoragePrice = storage <= 75 ? 0 : (storage - 75) * 0.03;
  const provider3TransferPrice = transfer <= 75 ? 0 : (transfer - 75) * 0.02;
  const isSelecktedMulti = document.getElementById("type");
  const isMultiStorage = isSelecktedMulti.selectedIndex == 0 ? true : false;
  const provider3StoragePrice = isMultiStorage
    ? provider3MultiStoragePrice
    : provider3SingleStoragePrice;
  const provider3Price = provider3StoragePrice + provider3TransferPrice;

  //
  const provider4StoragePrice = 0.01;
  const provider4TransferPrice = 0.01;
  const provider4MinPrice = 5;
  const provider4Price = Math.max(
    provider4MinPrice,
    provider4StoragePrice * storage + transfer * provider4TransferPrice
  );

  const providers = [
    { name: "backblaze.com", price: provider1Price },
    { name: "bunny.net", price: provider2Price },
    { name: "scaleway.com", price: provider3Price },
    { name: "vultr.com", price: provider4Price },
  ];
  const cheapestProvider = providers.reduce((acc, curr) =>
    acc.price < curr.price ? acc : curr
  );

  // діаграма
  // Знаходимо максимальну вартість провайдера
  const maxCost = Math.max(
    provider1Price,
    provider2Price,
    provider3Price,
    provider4Price
  );

  // Обчислюємо відсоткову вартість кожного провайдера
  const provider1Percent = (provider1Price / maxCost) * 100;
  const provider2Percent = (provider2Price / maxCost) * 100;
  const provider3Percent = (provider3Price / maxCost) * 100;
  const provider4Percent = (provider4Price / maxCost) * 100;

  // Створюємо масив з відсотковими значеннями кожного провайдера
  const data = [
    provider1Percent,
    provider2Percent,
    provider3Percent,
    provider4Percent,
  ];
  drawChart(data);

  // Виведення результатів
  document.getElementById("result").innerHTML = `Cheapest Provider: ${
    cheapestProvider.name
  }, Price: ${cheapestProvider.price.toFixed(2)} $`;
  //

  const listItems = document.querySelectorAll("li");
  const span = document.querySelectorAll("span");
  span.forEach((elem) => {
    elem.innerHTML = "";
  });
  function addResult() {
    for (let i = 0; i < providers.length; i++) {
      let span = document.createElement("span");
      span.innerHTML = ` ${providers[i].price + "$"}`;
      listItems[i].append(span);
    }
  }
  addResult();

  // оновлення
  storageValue.innerText = storageRange.value;
  transferValue.innerText = transferRange.value;
});

// Налаштування діаграми

function drawChart(data) {
  const minValue = Math.min(...data); // знаходимо найменше значення
  const minIndex = data.indexOf(minValue); // знаходимо індекс найменшого значення
  if (window.chart != null) {
    window.chart.destroy();
  }

  window.chart = new Chart(ctx, {
    // chart options
    type: "bar",
    data: {
      labels: ["backblaze.com", "bunny.net", "scaleway.com", "vultr.com"],

      datasets: [
        {
          label: "Cost %",
          data: data,
          backgroundColor: data.map((val, index) =>
            index === minIndex ? "#5f0f40" : "silver"
          ),
        },
      ],
    },

    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              min: 0,
              max: 100,
              callback: function (value) {
                return value + "%"; // Додати знак відсотка до значення
              },
            },
          },
        ],
      },
    },
  });
}
