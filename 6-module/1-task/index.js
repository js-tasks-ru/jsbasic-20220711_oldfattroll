/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
 export default class UserTable {
  elem = null;

  constructor(rows) {
    let tbody = document.createElement('tbody');
    let table = document.createElement('table');

    for (let item of rows) {
      let tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.age}</td>
        <td>${item.salary}</td>
        <td>${item.city}</td>
        <td><button class="remove-button" data-action="remove">X</button></td>`;
      tbody.appendChild(tr);

      table.appendChild(tbody);

      tr.classList.add("row");
      table.classList.add("myTable");
    }

    this.elem = table;

    table.querySelector("tbody").addEventListener("click", (event) => {
      event.target.closest('.row').remove();
    });
  }
}










