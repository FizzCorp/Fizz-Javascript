const COLOR_CODES = ['#5c53d6', '#aa5bc4', '#25b129', '#fe9601', '#f15a2b', '#37b0d8', '#00b282', '#d845a2', '#bdc812', '#0c8771', '#0c8771'];

// helper methods - utils
const hashCode = (str) => {
  let i = 0;
  let chr = '';
  let hash = 0;
  const totalChars = (str != null) ? str.length : 0;

  for (i = 0; i < totalChars; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export const getColorFromString = (str) => {
  const index = hashCode(str) % COLOR_CODES.length;
  return COLOR_CODES[index];
};