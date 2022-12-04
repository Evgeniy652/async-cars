import { renderGarage } from '../garage';
import { renderWinners } from '../winners';
import { fireworks } from '../../shared/components/fireworks';
import './index.scss';

export const renderPage = (): void => {
  const markup = `
    <header class="header">
      <button type="button" class="btn header-garage-btn">garage</button>
      <button type="button" class="btn header-winners-btn">winners</button>
    </header>
    <main id="garage-page">
      <div class="forms-container">
        <form class="form create-form" id="create-form">
          <input class="input"  id="create-name" name="name" type="text" autocomplete="off"  required />
          <input
            class="color"
            id="create-color"
            name="color"
            type="color"
            value="#ff0000"
          />
          <button class="btn" type="submit">Create</button>
        </form>
        <form class="form update-form" id="update-form">
          <input
            class="input"
            id="update-name"
            name="name"
            type="text"
						autocomplete="off"
            disabled
            required
          />
          <input
            class="color"
            id="update-color"
            name="color"
            type="color"
            value="#ff0000"
            disabled
          />
          <button class="btn" id="update-btn" type="submit" disabled >Update</button>
        </form>
      </div>
      <ul class="controls-list">
        <li class="item" ><button class="btn race-btn" id="race">Race</button></li>
        <li class="item" ><button class="btn reset-btn" id="reset" disabled>Reset</button></li>
        <li class="item" ><button class="btn generate-btn" id="generate">Generate</button></li>
      </ul>
      <div id="garage" class="garage">${renderGarage()}</div>
      <div>
        <p class="win-message hidden" id="win-message"></p>
      </div>
    </main>
    <div id="winners-page" class="winners-page">${renderWinners()}</div>
    <div class="pagination">
      <button class="btn prev-button" disabled id="prev">←</button>
      <button class="btn next-button" disabled id="next">→</button>
    </div>
`;
  const app = document.createElement('div');
  app.innerHTML = markup;
  document.body.appendChild(app);
  document.body.insertAdjacentHTML('afterbegin', fireworks().render);
};
