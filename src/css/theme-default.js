import { createMuiTheme } from '@material-ui/core/styles';
import { blue, grey, indigo, red } from '@material-ui/core/colors';
import { getCompanyColors, getCompanyNavBarColor } from '../config/company';

const ThemeDefault = createMuiTheme({
  typography: {
    useNextVariants: true,
    h5: {
      fontSize: '1.1rem',
      fontWeight: '500',
    },
  },
  palette: {
    primary: {
      light: blue[300],
      main: getCompanyColors().primary,
      dark: indigo[500],
      contrastText: grey[50],
    },
    secondary: {
      light: grey[200],
      main: getCompanyColors().secondary,
      dark: grey[900],
      contrastText: grey[50],
    },
    error: {
      light: red[300],
      main: red[500],
      dark: red[700],
    },
  },
  toolbar: {
    bgColor: {},
    opacity: 0,
    content: '',
  },
  drawer: {
    bgColor: getCompanyNavBarColor(),
  },
  overrides: {
    MuiButton: {
      root: {
        color: indigo[500],
      },
    },
    MuiIconButton: {
      root: {
        color: indigo[500],
      },
    },
    MuiFab: {
      root: {
        color: grey[50],
        position: 'fixed',
        bottom: '2em',
        right: '2em',
      },
    },
    MuiFormControl: {
      root: {
        minWidth: 150,
      },
    },
    MuiDialogContentText: {
      root: {
        padding: '0 2em',
      },
    },
    MuiBottomNavigationAction: {
      root: {
        whiteSpace: 'nowrap',
      },
    },
    MuiTableCell: {
      root: {
        '& > *': {
          opacity: '1 !important',
        },
        textOverflow: 'ellipsis',
      },
      paddingNone: {
        padding: '4 !important',
      },
    },
    jss373: {
      opacity: '1 !important',
    },
    jss13: {
      opacity: '1 !important',
    },
    MuiPaper: {
      root: {
        '& > *': {
          opacity: '1 !important',
        },
      },
    },
  },
});

export default ThemeDefault;
