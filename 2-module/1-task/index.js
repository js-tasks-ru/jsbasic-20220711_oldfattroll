function sumSalary(salaries) {
  let sumS = 0;
  for (key in salaries) {
    if (Number.isInteger(salaries[key])) {
      sumS += salaries[key];
    }
  }
  return sumS
}
