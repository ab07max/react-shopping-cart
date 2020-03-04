import React from 'react';

import Shelf from '../Shelf';
import Filter from '../Shelf/Filter';
// import GithubCorner from '../github/Corner';
import FloatCart from '../FloatCart';
import NavBar from '../NavigationBar';

const App = () => (
  <React.Fragment>
    {/* <GithubCorner /> */}
    <NavBar />
    <main>
      <Filter />
      <Shelf />
    </main>
    <FloatCart />
  </React.Fragment>
);

export default App;
