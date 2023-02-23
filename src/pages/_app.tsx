import { ContextComponents } from '@/components/layout/context/ContextComponents';
import { GlobalContextProvider } from '@/context/GlobalContext';
import '@/styles/globals.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppBar, Box, createTheme, styled, ThemeProvider, Typography } from '@mui/material';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

const NavBar = styled(AppBar)({
  backdropFilter: 'blur(5px)',
  padding: '10px 25px',
});

const NavTitle = styled(Typography)({
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.3rem',
  color: 'inherit',
  textDecoration: 'none',
});

const WebLink = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer'
});

const PageContainer = styled(Box)({
  padding: '40px',
  display: 'flex',
  justifyContent: 'center'
});

const darkTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'rgba(255,255,255, 0.5)',
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter()

  return <div style={{ maxHeight: '100vh' }}>
    <ThemeProvider theme={darkTheme}>
      <GlobalContextProvider>
        <ContextComponents />
        <NavBar position="sticky">
          <NavTitle variant="h5" noWrap
            sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'left' } }}
          >
            <WebLink onClick={() => router.push('/')}>
              <DashboardIcon />&nbsp;DB COMPARE
            </WebLink>
          </NavTitle>
        </NavBar>
        <PageContainer>
          <Component {...pageProps} />
        </PageContainer>
      </GlobalContextProvider>
    </ThemeProvider>
  </div>
}
