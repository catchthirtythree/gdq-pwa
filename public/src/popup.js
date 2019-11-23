const titleElement = document.querySelector('#event-title');
const backdrop = document.querySelector('#modal-backdrop');

titleElement.onclick = e => {
  backdrop.setAttribute('opened', true);
}

const close = document.querySelector('#modal .modal-close');
close.onclick = function () {
  backdrop.removeAttribute('opened');
}

window.onclick = function (event) {
  if (_.isEqual(event.target, backdrop)) {
    backdrop.removeAttribute('opened');
  }
}

const idInput = document.querySelector('#modal #schedule-id');
idInput.onkeydown = e => {
  if (_.isEqual(e.key, 'Enter')) {
    const value = e.target.value;
    const query = _.isEmpty(value) ? '' : `/?id=${value}`;
    window.location.assign(`${window.location.origin}${query}`);
  }
}

idInput.onkeyup = e => {
  e.target.value = e.target.value.replace(/[^\d]/, '');
}

const verifyBtn = document.querySelector('#modal .modal-footer #modal-verify-btn');
verifyBtn.onclick = e => {
  const resource = '/schedule';
  const id = idInput.value;
  const parameter = _.some(id) ? `/${id}` : '';

  fetch(`${resource + parameter}`)
    .then(response => {
      if (response.ok) {
        console.log(response);
      } else {
        console.log('error');
      }
    });
}

const goBtn = document.querySelector('#modal .modal-footer #modal-go-btn');
goBtn.onclick = e => {
  const idInput = document.querySelector('#modal #schedule-id');
  const inputValue = idInput.value;

  if (inputValue.match(/\d+/)) {
    window.location.href = `${window.location.origin}/?id=${inputValue}`
  } else {
    window.location.href = `${window.location.origin}`;
  }
}
