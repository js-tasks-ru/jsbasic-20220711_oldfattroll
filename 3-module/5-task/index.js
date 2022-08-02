function getMinMax(str) {
  let arr = str.split(' ').filter((c) => !isNaN(parseInt(c))).map(item => Number(item));
  return {
    max: Math.max(...arr),
    min: Math.min(...arr),
  };
}
