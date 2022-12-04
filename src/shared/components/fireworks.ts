import './fireworks.scss';

export const fireworks = () => ({
  render: `
            <div class="pyro hide">
                <div class="before"></div>
                <div class="after"></div>
            </div>
        `,
  show: () => {
    document.querySelector('.pyro').classList.remove('hide');
  },
  hide: () => {
    document.querySelector('.pyro').classList.add('hide');
  },
});
