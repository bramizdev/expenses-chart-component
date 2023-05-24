'use strict';

const $ = (selector) => document.querySelector(selector);

const maxBarSize = '150';

const $chart = $('.chart');

const getHighestExpense = (arr) => {
  return arr.reduce(
    (acc, curr) => (acc = curr.amount > acc ? curr.amount : acc),
    0
  );
};

const calculateBarSize = (highest, amount) => {
  return Math.trunc((maxBarSize * amount) / highest);
};

const displayExpenses = async (url) => {
  const response = await fetch(url);
  const expenses = await response.json();

  const highestAmount = getHighestExpense(expenses);

  const updatedData = expenses.map((el) => {
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
              highest ? maxBarSize : calculateBarSize(highestAmount, amount)
            }px">
          </div>
          <p class="chart__day">${day}</p>
        </div>
      `;
    $chart.insertAdjacentHTML('beforeend', markup);
  });
};

displayExpenses('./data.json');

$chart.addEventListener('mouseover', (e) => {
  const bar = e.target;
  if (!bar.classList.contains('chart__bar')) return;
  const markup = `
        <span class="chart__span">$${bar.getAttribute('data-amount')}</span>
      `;
  bar.insertAdjacentHTML('beforeend', markup);
  bar.style.opacity = '0.75';
});

$chart.addEventListener('mouseout', (e) => {
  const bar = e.target;
  if (!bar.classList.contains('chart__bar')) return;
  bar.innerHTML = '';
  bar.style.opacity = '1';
});
