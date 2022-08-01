function camelize(str) {
  const splitArr = str.split('-');
  const newArr = [];
  for (let i = 1; i < splitArr.length; i++) {
    newArr.push(splitArr[i].charAt(0).toUpperCase() + splitArr[i].slice(1));
  }
  return splitArr[0] + newArr.join("");
}
