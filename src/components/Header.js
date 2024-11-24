import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import classes from "./Header.module.css"

const Header = () => {
  return (
    <Fragment>
      <header className={classes.header}>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/orders">Orders</Link>
      </header>
    </Fragment>
  );
}

export default Header;