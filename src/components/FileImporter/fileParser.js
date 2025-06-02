export function parseCsvWithHeader(content, expectedHeader, delimiter = ';') {
  const data = [];
  const lines = content.split(/\r?\n/);
  const header = lines[0].trim().split(delimiter);
  const headerIndexes = getHeaderIndexes(header, expectedHeader);
  if (Object.values(headerIndexes).some(value => value === -1)) {
    throw new Error('CSV_PARSE_ERROR: Some expected columns are missing from the header.');
  }
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0 && line.trim().length > 0) {
      data[lineIndex - 1] = {};
      const split = line.split(delimiter);
      expectedHeader.forEach(field => data[lineIndex - 1][field] = split[headerIndexes[field]]);
    }
  });
  return data;
}

export function parseCsvWithoutHeader(content, header, delimiter = ';') {
  const data = [];
  const lines = content.split(/\r?\n/);
  lines.forEach((line, lineIndex) => {
    if (line.trim().length > 0) {
      data[lineIndex] = {};
      const split = line.split(delimiter);
      header.forEach((field, fieldIndex) => data[lineIndex][field] = split[fieldIndex]);
    }
  });
  return data;
}

// TODO: Add parseExcel() function

function getHeaderIndexes(header, expected) {
  const indexes = {};
  expected.forEach(expectedField => {
    indexes[expectedField] = header.findIndex(column => column === expectedField);
  });
  return indexes;
}
