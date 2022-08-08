function highlight(table) {
  let cells = table.querySelectorAll('td');

  cells.forEach(cell => {
    let row = cell.closest('tr');

    if (cell.dataset.available === 'true') {
      row.classList.add('available');
    } else if (cell.dataset.available === 'false') {
      row.classList.add('unavailable');
    } else {
      row.hidden = true;
    }
  });

  cells.forEach(cell => {
    let row = cell.closest('tr');

    if (cell.textContent < 18) {
      row.style.textDecoration = "line-through";
    }
  });

  cells.forEach(cell => {
    let row = cell.closest('tr');

    if (cell.textContent === "m") {
      row.classList.add("male");
    } else {
      row.classList.add("female");
    }
  });
}
