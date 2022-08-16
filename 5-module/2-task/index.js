function toggleText() {
  let button = document.querySelector('.toggle-text-button');
  let text = document.querySelector('#text');

  button.onclick = () => {
    text.hidden = text.hidden === false;
  };
}
