import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import ChatsPage from './pages/ChatsPage/ChatsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
   return (
      <div className="wrapper">
         <BrowserRouter>
            <Routes>
               <Route path="/login" element={<LoginPage />} />
               <Route
                  path="/chat"
                  element={
                     <ProtectedRoute>
                        <ChatsPage />
                     </ProtectedRoute>
                  }
               />
               <Route path="*" element={<LoginPage />} />
            </Routes>
         </BrowserRouter>
      </div>
   );
}

export default App;
