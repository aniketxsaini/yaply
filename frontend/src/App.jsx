
import { ThemeProvider } from './context/ThemeContext';
import { WallpaperProvider } from './context/WallpaperContext';
import { Navigate, Route,Routes } from 'react-router';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import {useAuth} from '@clerk/react'
function App() {
  const {isSignedIn,isLoaded} = useAuth;
  if(!isLoaded) return <p>coming up wait...</p>
  return (
    <>
    <ThemeProvider>
      <WallpaperProvider>
      <Routes>
        <Route path="/" element={isSignedIn?<ChatPage />:<Navigate to={"/auth"} replace/>} />


        <Route path="/auth" element={!isSignedIn?<AuthPage/>:<Navigate to={"/"} replace/>}/>
      
      
      </Routes>
      </WallpaperProvider>
      </ThemeProvider>
    </>
  )
}

export default App