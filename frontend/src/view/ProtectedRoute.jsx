import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {userContext} from '../App';
import PropTypes from 'prop-types';

/**
 * Protecting home from being entered
 * @param {object} props - Component props
 * @param {Node} props.children  child compoents to render
 * @returns {object} either component or navigate
 */
function ProtectedRoute({children}) {
  const userState = useContext(userContext);
  if (!userState.user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};


export default ProtectedRoute;

