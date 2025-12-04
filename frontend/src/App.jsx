/*
#######################################################################
#
# Copyright (C) 2020-2025 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {createContext, useState} from 'react';
import Login from './view/Login';
import Home from './view/Home';
import ProtectedRoute from './view/ProtectedRoute';

export const userContext = createContext();
/**
 * Simple component with no state.
 * @returns {object} JSX
 */
function App() {
  const [user, setUser] = useState();
  return (
    <userContext.Provider value={{user, setUser}}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/home' element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
