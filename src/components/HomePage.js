import React, { Fragment } from 'react';
import Header from './Header'; 
import classes from "./HomePage.module.css"

const HomePage = () => {
  return (
    <Fragment>
      <Header />
      <div className={classes.container}>
        <h1>Welcome, Admin!</h1>
        <p>This is your admin dashboard where you can manage orders, users, and more.</p>
      </div>
    </Fragment>
  );
};



export default HomePage;
