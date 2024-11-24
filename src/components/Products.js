import React, { Fragment, useEffect, useState } from 'react';
import Header from './Header';
import AddProducts from './AddProducts';
import classes from "./Products.module.css";

const Products = () => {
  const [form, setForm] = useState(false);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [refetchProducts, setRefetchProducts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://zepto-kind-default-rtdb.firebaseio.com/products.json');
        const data = await response.json();

        if (data) {
          const productsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key]
          }));

          const grouped = productsArray.reduce((acc, product) => {
            if (!acc[product.category]) {
              acc[product.category] = [];
            }
            acc[product.category].push(product);
            return acc;
          }, {});

          setGroupedProducts(grouped);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [refetchProducts]);

  const hideForm = () => {
    setForm(false);
    setIsEditing(false);
    setSelectedProduct(null);
  };

  const showForm = () => {
    setForm(true);
  };

  const handleProductAdded = () => {
    setRefetchProducts(prev => !prev); // Trigger re-fetch by toggling the state
    hideForm();
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product); // Set the product to be updated
    setIsEditing(true); // Mark as editing
    setForm(true); // Show the form
  };

  const deleteProduct = async (productId, category) => {
    try {
      await fetch(
        `https://zepto-kind-default-rtdb.firebaseio.com/products/${productId}.json`,
        { method: "DELETE" }
      );

      const updatedGroupedProducts = { ...groupedProducts };
      updatedGroupedProducts[category] = updatedGroupedProducts[category].filter(
        (product) => product.id !== productId
      );

      if (updatedGroupedProducts[category].length === 0) {
        delete updatedGroupedProducts[category];
      }

      setGroupedProducts(updatedGroupedProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Fragment>
      <Header />
      <button className={classes.addProduct} onClick={showForm}>Add Products</button>

      {form && (
        <AddProducts
          onClose={hideForm}
          onProductAdded={handleProductAdded}
          isEditing={isEditing}
          product={selectedProduct} // Pass product to form for editing
        />
      )}

      <div className={classes.productList}>
        {Object.keys(groupedProducts).length === 0 ? (
          <p>No products available.</p>
        ) : (
          Object.keys(groupedProducts).map((category) => (
            <div key={category} className={classes.categorySection}>
              <h2>{category}</h2>
              <div className={classes.productGrid}>
                {groupedProducts[category].map((product) => (
                  <div key={product.id} className={classes.productItem}>
                    <h3>{product.name}</h3>
                    <img src={product.img} alt={product.name} className={classes.productImage} />
                    <p>Price: ${product.price}</p>
                    {/* <p>{product.description}</p> */}
                    <button onClick={() => deleteProduct(product.id, category)}>Delete</button>
                    <button onClick={() => handleUpdate(product)}>Update</button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Fragment>
  );
};

export default Products;
