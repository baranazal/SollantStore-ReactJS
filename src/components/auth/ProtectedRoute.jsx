import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useTheme } from '@/features/themes/useTheme';

const ProtectedRoute = ({ user, children, requiredRole }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      }
      setLoading(false);
    };
    fetchUserRole();
  }, [user]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-background-dark' : 'bg-background'}`}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};


ProtectedRoute.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }),
  children: PropTypes.node.isRequired, 
  requiredRole: PropTypes.string,
};

export default ProtectedRoute;