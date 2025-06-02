export const getCurrentDate = () => new Date().toISOString().split('T').join('-').split('.')[0];

export const downloadTextFile = (fileName, content) => {
  const hiddenElement = document.createElement('a');

  hiddenElement.href = 'data:attachment/text,' + encodeURI(content);
  hiddenElement.target = '_blank';
  hiddenElement.download = fileName;
  hiddenElement.click();
};

export const downloadExcelContent = (content, filename = getCurrentDate()) => {
  const url = URL.createObjectURL(new Blob([content]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.xlsx`);
  document.body.appendChild(link);
  link.click();
};

export const removeUnsetValuesFromFilter = mapped => {
  for (let param in mapped) {
    if (mapped[param] === undefined || mapped[param] === null || mapped[param] === '') {
      delete mapped[param];
    }
  }
};

