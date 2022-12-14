import { renderPage } from './components/page';
import { renderGarage, updateGarage } from './components/garage';
import { renderWinners, updateWinners, setSortOrder } from './components/winners';
import { startDriving, stopDriving } from './shared/driving';
import refs from './shared/refs';
import store from './services/store';
import { getCreateCar, updateCar, saveWinner, getCarById, getDeleteCarById, deleteWinner } from './services/api';
import { generateRandomCars } from './shared/utils/generateCars';
import { View, SortBy } from './shared/enums';
import { race } from './shared/utils/race';
import { fireworks } from './shared/components/fireworks';
import './style.scss';

let selectedCar: { name: string; color: string; id: number };

renderPage();
await updateGarage();

const onGenerateBtnClick = async (event: Event) => {
  const generateBtn = <HTMLButtonElement>event.target;
  generateBtn.disabled = true;

  const generatedCars = generateRandomCars();

  await Promise.all(generatedCars.map(async (car) => getCreateCar(car)));
  await updateGarage();
  const garage = document.getElementById('garage') as HTMLDivElement;
  garage.innerHTML = renderGarage();
  generateBtn.disabled = false;
};

const onRaceBtnClick = async (event: Event) => {
  const raceBtn = <HTMLButtonElement>event.target;
  const winMessage = document.getElementById('win-message');

  raceBtn.disabled = true;

  const resetBtn = document.getElementById('reset') as HTMLButtonElement;
  resetBtn.disabled = false;

  const winner = await race(startDriving);
  winMessage.innerHTML = `Winner is <strong>${winner.name}</strong>, for <strong>${winner.time}</strong> secs!`;
  winMessage.classList.remove('hidden');
  await saveWinner(winner);
  fireworks().show();

  setTimeout(() => {
    winMessage.classList.add('hidden');
    fireworks().hide();
  }, 5000);
};

const onResetBtnClick = (event: Event) => {
  const resetBtn = <HTMLButtonElement>event.target;

  resetBtn.disabled = true;

  store.cars.map(({ id }) => stopDriving(id));
  const winMessage = document.getElementById('win-message');
  winMessage.classList.add('hidden');
  const raceBtn = document.getElementById('race') as HTMLButtonElement;
  raceBtn.disabled = false;
};

const onGarageBtnClick = async () => {
  const garagePage = document.getElementById('garage-page') as HTMLDivElement;
  const winnersPage = document.getElementById('winners-page') as HTMLDivElement;

  await updateGarage();

  store.view = View.Garage;

  garagePage.style.display = 'block';
  winnersPage.style.display = 'none';
};

const onWinnersBtnClick = async () => {
  const garagePage = document.getElementById('garage-page') as HTMLDivElement;
  const winnersPage = document.getElementById('winners-page') as HTMLDivElement;

  winnersPage.style.display = 'inline-block';
  garagePage.style.display = 'none';
  await updateWinners();

  store.view = View.Winners;

  winnersPage.innerHTML = renderWinners();
};

const onPrevBtnClick = async () => {
  switch (store.view) {
    case View.Garage: {
      store.carsPage -= 1;
      await updateGarage();

      const garage = document.getElementById('garage') as HTMLDivElement;
      garage.innerHTML = renderGarage();
      break;
    }
    case View.Winners: {
      store.winnersPage -= 1;
      await updateWinners();

      const winners = document.getElementById('winners-page') as HTMLDivElement;
      winners.innerHTML = renderWinners();
      break;
    }
    default:
  }
};

const onNextBtnClick = async () => {
  switch (store.view) {
    case View.Garage: {
      store.carsPage += 1;
      await updateGarage();
      const garage = document.getElementById('garage') as HTMLDivElement;

      garage.innerHTML = renderGarage();
      break;
    }
    case View.Winners: {
      store.winnersPage += 1;
      await updateWinners();
      const winners = document.getElementById('winners-page') as HTMLDivElement;

      winners.innerHTML = renderWinners();
      break;
    }
    default:
  }
};

const onSelectBtnClick = async (target: HTMLElement) => {
  const carUpdName = document.getElementById('update-name') as HTMLInputElement;
  const carUpdColor = document.getElementById('update-color') as HTMLInputElement;
  const updateBtn = document.getElementById('update-btn') as HTMLButtonElement;

  selectedCar = await getCarById(target.id.split('select-car-')[1]);

  carUpdName.value = selectedCar.name;
  carUpdColor.value = selectedCar.color;
  carUpdName.disabled = false;
  carUpdColor.disabled = false;
  updateBtn.disabled = false;
};

const omRemoveBtnClick = async (target: HTMLElement) => {
  const id = Number(target.id.split('remove-car-')[1]);
  await getDeleteCarById(id);
  await deleteWinner(id);
  await updateGarage();
  const garage = document.getElementById('garage') as HTMLDivElement;
  garage.innerHTML = renderGarage();
};

// MAIN LISTENER

refs.root.addEventListener('click', async (event) => {
  const target = <HTMLElement>event.target;

  if (target.classList.contains('generate-btn')) {
    onGenerateBtnClick(event);
  } else if (target.classList.contains('race-btn')) {
    onRaceBtnClick(event);
  } else if (target.classList.contains('reset-btn')) {
    onResetBtnClick(event);
  } else if (target.classList.contains('header-garage-btn')) {
    onGarageBtnClick();
  } else if (target.classList.contains('header-winners-btn')) {
    onWinnersBtnClick();
  }

  if (target.classList.contains('prev-button')) {
    onPrevBtnClick();
  }

  if (target.classList.contains('next-button')) {
    onNextBtnClick();
  }

  if (target.classList.contains('table-wins')) {
    setSortOrder(SortBy.Wins);
  } else if (target.classList.contains('table-time')) {
    setSortOrder(SortBy.Time);
  }

  if (target.classList.contains('select-btn')) {
    onSelectBtnClick(target);
  }

  if (target.classList.contains('remove-btn')) {
    omRemoveBtnClick(target);
  }
});

// LISTENERS CREATE / UPDATE

const createForm = document.getElementById('create-form') as HTMLFormElement;

createForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const garage = document.getElementById('garage') as HTMLDivElement;
  const nameInput = document.getElementById('create-name') as HTMLInputElement;
  const colorInput = document.getElementById('create-color') as HTMLInputElement;

  const car = { name: nameInput.value, color: colorInput.value };

  await getCreateCar(car);
  await updateGarage();

  garage.innerHTML = renderGarage();
  nameInput.value = '';
  colorInput.value = '';
});

const updateForm = document.getElementById('update-form') as HTMLFormElement;

updateForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const updateBtn = document.getElementById('update-btn') as HTMLButtonElement;
  const garage = document.getElementById('garage') as HTMLDivElement;
  const nameInput = document.getElementById('update-name') as HTMLInputElement;
  const colorInput = document.getElementById('update-color') as HTMLInputElement;

  const car = { name: nameInput.value, color: colorInput.value };

  await updateCar(selectedCar.id, car);
  await updateGarage();

  garage.innerHTML = renderGarage();
  nameInput.value = '';
  updateBtn.disabled = true;
  nameInput.disabled = true;
  colorInput.disabled = true;
  colorInput.value = '';
});
