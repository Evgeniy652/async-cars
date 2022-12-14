import store from '../../services/store';
import { getWinners } from '../../services/api';
import { renderCarImg } from '../car';
import { SortBy, SortOrder } from '../../shared/enums';
import './index.scss';

export const renderWinners = (): string => `
  <h2>Winners (${store.winnersCount})</h2>
  <h4>Page №${store.winnersPage}</h4>
<table>
<tr>
  <th>№</th>
  <th>Car</th>
  <th>Name of the car</th>
      <th class="table-button table-wins ${
  store.sortBy === SortBy.Wins ? store.sortOrder : ''
}	id="sort-by-wins">Wins</th>
      <th class="table-button table-time ${
  store.sortBy === SortBy.Time ? store.sortOrder : ''
}	id="sort-by-time">Best time (sec)</th>
  </tr>
        ${store.winners
    .map(
      (
        winner: {
          car: { name: string; color: string };
          wins: number;
          time: number;
        },
        index,
      ) => `
        <tr>
          <td>${index + 1}</td>
          <td>${renderCarImg(winner.car.color)}</td>
          <td>${winner.car.name}</td>
          <td>${winner.wins}</td>
          <td>${winner.time}</td>
        </tr>
      `,
    )
    .join('')}

</table>`;

export const updateWinners = async (): Promise<void> => {
  const { items, count } = await getWinners({
    page: store.winnersPage,
    sort: store.sortBy,
    order: store.sortOrder,
  });

  store.winners = items;
  store.winnersCount = count;

  const nextBtn = document.getElementById('next') as HTMLButtonElement;
  nextBtn.disabled = store.winnersPage * 10 >= Number(store.winnersCount);

  const prevBtn = document.getElementById('prev') as HTMLButtonElement;
  prevBtn.disabled = store.winnersPage <= 1;
};

export const setSortOrder = async (sortBy: string): Promise<void> => {
  store.sortOrder = store.sortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc;
  store.sortBy = sortBy;

  await updateWinners();
  const winnersPage = document.getElementById('winners-page') as HTMLDivElement;
  winnersPage.innerHTML = renderWinners();
};
