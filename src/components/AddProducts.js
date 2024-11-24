import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import classes from "./AddProducts.module.css"

const AddProducts = ({ onClose, onProductAdded, isEditing, product }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [img, setImg] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isEditing && product) {
      setName(product.name);
      setCategory(product.category);
      setImg(product.img);
      setPrice(product.price);
      setDescription(product.description);
    }
  }, [isEditing, product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = { name, category, img, price, description };

    if (isEditing) {
      try {
        await fetch(
          `https://zepto-kind-default-rtdb.firebaseio.com/products/${product.id}.json`,
          {
            method: "PUT",
            body: JSON.stringify(newProduct),
          }
        );
      } catch (error) {
        console.error("Error updating product:", error);
      }
    } else {
      try {
        await fetch(
          `https://zepto-kind-default-rtdb.firebaseio.com/products.json`,
          {
            method: "POST",
            body: JSON.stringify(newProduct),
          }
        );
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }

    onProductAdded();
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <label htmlFor="name">Name:</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="category">Category:</label>
        <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        <label htmlFor="img">Image URL:</label>
        <input id="img" type="text" value={img} onChange={(e) => setImg(e.target.value)} />
        <label htmlFor="price">Price:</label>
        <input id="price" type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">{isEditing ? "Update Product" : "Add Product"}</button>
      </form>
    </Modal>
  );
};

export default AddProducts;
