import { Navigate } from 'react-router-dom';
import { authStorage } from '../auth/AuthStorage';

interface Props {
   children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
   const config = authStorage.get();

   if (!config) {
      return <Navigate to="/login" replace />;
   }

   return children;
}
