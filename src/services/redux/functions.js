export const handleError = (err, sendNotification) => {
  if (err.response && err.response.data) {
    let errors = [err.response.data.error || err.response.data.errorMessage];
    if (err.response.data.errors) {
      errors.push(': ');
      err.response.data.errors.forEach(e => {
        errors.push(e.field + ' ' + e.defaultMessage + '; ');
      });
    }
    sendNotification('Error : ' + errors.join(''));
  } else {
    /*eslint no-console: ["error", { allow: ["error"] }] */
    console.error(err);
    sendNotification('Unknown error');
  }
};
