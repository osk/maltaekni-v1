const lsKey = 'what_an_awseome_person_you_are';
const emojis = [
  '😎',
  '⭐️',
  '⭐️⭐️',
  '⭐️⭐️⭐️',
  '🔥⭐️⭐️⭐️🔥',
  '🔥⭐️⭐️⭐️🔥',
  '🔥⭐️⭐️⭐️🔥',
  '🔥⭐️⭐️⭐️🔥',
];

const overflowing = '💯🔥💯🔥💯🔥💯🔥💯';

function joy(n) {
  window.localStorage.setItem(lsKey, n.toString());
  const count = document.querySelector('.count');
  count.textContent = n;

  const emoji = document.querySelector('.emoji');
  const index = Math.floor(n / 10);
  if (index >= emojis.length) {
    emoji.textContent = overflowing;
  } else {
    emoji.textContent = emojis[index];
  }
}

let n = 1;

if (window.localStorage.getItem(lsKey)) {
  const value = Number.parseInt(window.localStorage.getItem(lsKey));

  if (value > 0) {
    n = value;
    joy(n);
  }
}

function setQuestion(id, first, second) {
  const idElement = document.querySelector('input[name=id]');
  const firstElement = document.querySelector('p.first');
  const secondElement = document.querySelector('p.second');

  idElement.textContent = id;
  firstElement.textContent = first;
  secondElement.textContent = second;
}

function handleResponse(json) {
  try {
    if (json.error || !json.id || !json.sentence_one || !json.sentence_two) {
      throw new Error('villa í gögnum');
    }
    setQuestion(json.id, json.sentence_one, json.sentence_two);
    joy(n++);
  } catch (e) {
    handleError(e);
  }
}

function handleError(e) {
  const section = document.querySelector('section');
  section.textContent = `Villa í forriti 😭 ${e ? `(${JSON.stringify(e)})` : ''}`;
}

function submit(e) {
  e.preventDefault();

  const id = e.target.querySelector('input[name=id]').value;
  const value = e.submitter.value;

  // FormData uses multipart/form-data which would require a package on BE
  const body = new URLSearchParams();
  body.append('id', id);
  body.append('value', value);

  fetch('/classify', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-fetch': '1',
    },
    body: body.toString(),
  })
    .then((res) => res.json())
    .then(handleResponse)
    .catch(handleError);
}

document.querySelector('form').addEventListener('submit', submit);
