import { BrowserRouter, Navigate, Route } from 'react-router-dom';
import './App.scss';
import ChatsPage from './pages/Chats';
import LoginPage from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
   return (
      <div className="wrapper ">
         <div className="container">
            <BrowserRouter>
               <Route path="/login" element={<LoginPage />} />

               <Route
                  path="/chat"
                  element={
                     <ProtectedRoute>
                        <ChatsPage />
                     </ProtectedRoute>
                  }
               />

               <Route path="*" element={<Navigate to="/chat" replace />} />
            </BrowserRouter>
         </div>
      </div>
   );
}

export default App;
