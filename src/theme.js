import { createTheme } from '@material-ui/core/styles';
import { fontFamily, colors, boxShadows, borderRadius, fontWeight, fontSizes } from './Css';

const theme = createTheme({
  typography: {
    button: {
      fontSize: '1rem',
      textTransform: 'none',
    },
    fontFamily: Object.values(fontFamily).join(','),
  },
  spacing: 2,
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
  },
  zIndex: {
    modal: 5000,
  },
  overrides: {
    MuiTypography: {
      colorTextPrimary: {
        color: '#1D2733',
      },
      colorTextSecondary: {
        color: '#565D66',
      },
      colorInherit: {
        color: '#9C9C9C',
      },
      colorError: {
        color: colors.textError,
      },
    },
    MuiAvatar: {
      root: {
        fontSize: '1em',
      },
      colorDefault: {
        backgroundColor: colors.avatarDefaultBackground,
      },
    },
    MuiListItem: {
      gutters: {
        paddingLeft: 16,
      },
    },
    MuiDialog: {
      paper: {
        padding: 40,
        paddingTop: 24,
      },
    },
    MuiDialogTitle: {
      root: {
        padding: 0,
      },
    },
    MuiDialogContent: {
      root: {
        padding: `16px 0px`,
      },
    },
    MuiDialogActions: {
      root: {
        padding: 0,
      },
    },
    MuiTableCell: {
      root: {
        padding: 8,
        borderBottom: `1px solid #E7E7ED`,
      },
      body: {
        color: '#565D66',
      },
      head: {
        color: '#565D66',
        fontWeight: fontWeight.regular,
      },
    },
    MuiTableRow: {
      hover: {
        '&:hover': {
          backgroundColor: 'rgba(147, 1, 0, 0.05)',
        },
      },
    },
    MuiFormHelperText: {
      root: {
        margin: 0,
      },
      contained: {
        margin: `0 !important`,
      },
    },
    MuiPaper: {
      root: {
        color: '#565D66',
      },
      rounded: {
        borderRadius: borderRadius.default,
      },
      elevation1: {
        boxShadow: boxShadows.md,
      },
      elevation2: {
        boxShadow: boxShadows.lg,
      },
    },
    MuiCheckbox: {
      root: {
        color: '#9C9C9C',
      },
    },
    MuiRadio: {
      root: {
        color: '#C4CDD5',
      },
    },
    MuiPaginationItem: {
      root: {
        color: '#565D66',
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: borderRadius.default,
      },
      notchedOutline: {
        borderColor: '#CDCED9',
      },
      input: {
        color: '#1D2733',
        fontWeight: fontWeight.regular,
        padding: `14px 14px`,
      },
    },
    MuiFormLabel: {
      root: {
        color: '#565D66',
      },
    },
    MuiInputLabel: {
      outlined: {
        transform: `translate(14px,14px) scale(1)`,
      },
    },
    MuiButton: {
      disableElevation: true,
      root: {
        borderRadius: borderRadius.default,
        textTransform: 'initial',
        minHeight: 45,
        padding: `8px 16px`,
      },
      sizeLarge: {
        padding: `17px 16px`,
        minHeight: 60,
        fontSize: fontSizes.large,
      },
      sizeSmall: {
        minHeight: 'auto',
      },
      contained: {
        color: '#1D2733',
        backgroundColor: colors.white,
      },
      containedPrimary: {
        color: colors.white,
        borderRadius: '4px',
      },
      containedSecondary: {
        color: colors.white,
      },
      outlined: {
        borderColor: '#CDCED9',
        color: '#1D2733',
      },
    },
    MuiTab: {
      root: {
        padding: 0,
        minWidth: 'auto !important',
        marginRight: 40,
        fontSize: fontSizes.large,
        '&:last-child': {
          marginRight: 0,
        },
      },
      textColorPrimary: {
        color: '#565D66',
      },
    },
    MuiTabs: {
      root: {
        marginRight: -40,
      },
      indicator: {
        borderRadius: `${borderRadius.md} ${borderRadius.md} 0px 0px`,
        height: 4,
      },
    },
    MuiAlert: {
      root: {
        borderRadius: borderRadius.default,
        maxWidth: 600,
        boxSizing: 'border-box',
      },
      action: {
        paddingTop: 8,
        alignItems: 'flex-start',
        '& button': {
          padding: 0,
        },
      },
      standardSuccess: {
        color: '#1D2733',
        border: '1px solid #5ACA75',
        backgroundColor: '#EDF9F0',
      },
      standardInfo: {
        color: colors.primary,
        border: '1px solid #458FFF',
        backgroundColor: '#F0F5FF',
      },
      standardError: {
        color: colors.textError,
        border: `1px solid ${colors.textError}`,
        // backgroundColor: colors.error,
      },
    },
  },
});

export default theme;
