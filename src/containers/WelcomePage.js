import React, { useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { t } from 'mt-react-library/functions';
import WELCOME from '../images/welcome.jpg';

export const WelcomePage = () => {
  useEffect(() => {
    document.body.style.backgroundImage = `url(${WELCOME})`;
    document.body.style.backgroundSize = 'cover';
    return () => {
      document.body.style.backgroundImage = 'none';
    };
  });
  return (
    <div>
      <Typography variant="h2" align="center">{t('welcome')}</Typography>
      <Typography variant="h6" align="center" color="primary">{t('welcomeDescription')}</Typography>
    </div>
  );
};
