'use strict';

const chart = document.querySelector('.chart');
const maxBarSize = '150';

const getHighest = (arr) => {
  return arr.reduce(
    (acc, curr) => (acc = curr.amount > acc ? curr.amount : acc),
    0
  );
};

const calculatePercentaje = (highest, amount) => {
  return (maxBarSize * amount) / highest;
};

fetch('./data.json')
  .then((response) => response.json())
  .then((data) => {
    const highestAmount = getHighest(data);
    const updatedData = data.map((el) => {
      if (el.amount !== highestAmount) return { ...el, highest: false };
      return { ...el, highest: true };
    });

    updatedData.forEach(({ day, amount, highest }) => {
      const markup = `
        <div class="chart__division" >
          <div
            data-amount="${amount}"
            class="chart__bar ${highest ? 'highest-day' : ''}"
            style="height:${
              highest ? maxBarSize : calculatePercentaje(highestAmount, amount)
            }px">
          </div>
          <p class="chart__day">${day}</p>
        </div>
      `;
      chart.insertAdjacentHTML('beforeend', markup);
    });

    chart.addEventListener('mouseover', (e) => {
      const bar = e.target;
      if (!bar.classList.contains('chart__bar')) return;
      const markup = `
        <span class="chart__span">$${bar.getAttribute('data-amount')}</span>
      `;
      bar.insertAdjacentHTML('beforeend', markup);
      bar.style.opacity = '0.8';
    });

    chart.addEventListener('mouseout', (e) => {
      const bar = e.target;
      if (!bar.classList.contains('chart__bar')) return;
      bar.innerHTML = '';
      bar.style.opacity = '1';
    });
  });
