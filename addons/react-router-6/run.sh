#!/bin/bash
echo --- addon to install React Router v6 to an existing project.

# STEP 1 - install dependencies
npm install react-router-dom@6
mkdir -p ./src

# STEP 2 - add example: src/AppExample.tsx
FILE1="src/AppExample.tsx"
echo $FILE1
[ -f $FILE1 ] && echo \> file existed: overriding.
cat > $FILE1 <<EOL
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";

// const ProtectedRoute = (props: any) => {
//   const { user } = useAuth();
//   return user ? props.children : <div>Unauthorized</div>;
// };

export default () => {
  return (
    <BrowserRouter>
      <h1>Welcome to React Router!</h1>
      <Routes>
        <Route path="/" element={<div>Home | <Link to="/about">About</Link></div>} />
        <Route path="about" element={<div>About</div>} />

        <!--<Route path="profile" element={<ProtectedRoute>Protected Profile</ProtectedRoute>} />-->
      </Routes>
    </BrowserRouter>
  );
};
EOL

# STEP 3 - verify - try it: you will need to import and render AppExample.tsx
echo example - try it: you will need to import and render AppExample.tsx
