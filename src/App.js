import {
  AppBar,
  Container,
  createMuiTheme,
  CssBaseline,
  makeStyles,
  responsiveFontSizes,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core'

import commonStyles from './styles/common'

/* https://material.io/resources/color/ */
const baseTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#546e7a',
    },
  },
})
const theme = responsiveFontSizes(baseTheme)

const useStyles = makeStyles((theme) => ({
  ...commonStyles(theme),

  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  toolbar: {
    justifyContent: 'space-around',
    [theme.breakpoints.up('xs')]: {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
  },

  untitledLeft: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'baseline',
  },

  footer: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),

    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },

    textAlign: 'center',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}))

function App() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <ThemeProvider theme={theme}></ThemeProvider>
      <AppBar position="static" role="banner">
        <Toolbar className={classes.toolbar}>
          <div className={classes.untitledLeft}>
            <Typography component="h1" variant="h4" color="inherit" noWrap className={classes.titleMain}>
              Ham2K Maps
            </Typography>
            <Typography component="div" color="inherit" noWrap className={classes.version}>
              v0.0.1-alpha
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" className={classes.content}>
        Welcome!
      </Container>
      <footer className={classes.footer}>
        <b>Ham2K Maps</b> developed by <a href="https://www.qrz.com/db/KI2D">KI2D</a> •{' '}
        <a href="https://twitter.com/sd">@sd</a>
      </footer>
    </div>
  )
}

export default App
