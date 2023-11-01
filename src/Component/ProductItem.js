import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useDispatch, useSelector } from "react-redux";
import { ProductToview, addproducts } from "../actions";
import { useNavigate } from "react-router-dom";
import { addCart, CartItems } from "../actions";
import { useState } from "react";
import customFetch from "../apiCall";
import { ToastContainer } from "react-toastify";
import { showToastMessage } from "../Notification/notify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductItem({ item }) {
  const [addedItem, setaddedItem] = useState(true);
  const [title, settitle] = useState(item.title);
  const [price, setprice] = useState(item.price);
  // const [rating, setrating] = useState(item.rating);
  const [description, setdescription] = useState(item.description);
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dispatchCart = useDispatch();
  const dispatchTotal = useDispatch();
  const dispatchProduct = useDispatch();

  function handleClick(item) {
    dispatch(ProductToview(item));
    navigate(`/productdetails/${item.id}`);
  }
  function handleCart(item) {
    if (addedItem) {
      item.qty = 1;
      dispatchCart(addCart(item));
      dispatchTotal(CartItems());
      setaddedItem(false);
      showToastMessage("item Added to cart", "success");
    } else {
      navigate("/cart");
    }
  }
  function handleEdit(item) {
    item.edit = false;
    dispatchProduct(addproducts([...products]));
  }
  // making delete request
  function handleDelelteProduct(item) {
    let url = `https://my-json-server.typicode.com/saritabagul/ecommerce_api/products/${item.id}`;
    let result = customFetch(url, { method: "DELETE" });

    let index = products.indexOf(item);
    products.splice(index, 1);
    dispatchProduct(addproducts([...products]));
    showToastMessage("item deleted", "warning");
  }
  // closing edit mode
  function handleCancel(item) {
    item.edit = true;
    dispatchProduct(addproducts([...products]));
  }
  // making put request after click on save button of edit
  function handleSave(item) {
    let url = `https://my-json-server.typicode.com/saritabagul/ecommerce_api/products/${item.id}`;
    let result = customFetch(url, {
      body: {
        ...item,
        title,
        price,
        // rating,
        description,
        edit: true,
      },
      method: "PUT",
    });
    result.then((data) => {
      let index = products.indexOf(item);
      products[index] = data;

      dispatchProduct(addproducts([...products]));
      showToastMessage("Edit suceesful", "success");
    });
  }
  return (
    <>
      <ToastContainer />
      <Card
        className="d-inline-flex p-2 m-2 bd-highlight"
        style={{ width: "18rem" }}
      >
        <Card.Img
          variant="top"
          className="img-fluid img-thumbnail"
          id="productImage"
          src={item.thumbnail}
          onClick={() => handleClick(item)}
        />
        <Card.Body style={{position:"relative", height: 240}}>
          <Card.Title>
            {item.edit ? (
              <span>{item.title}</span>
            ) : (
              <input
                type="text"
                value={title}
                className="w-100 form-control"
                onChange={(e) => settitle(e.target.value)}
              ></input>
            )}
          </Card.Title>
          <Card.Text>
            {item.edit ? (
              <span>Rs.{item.price}</span>
            ) : (
              <input
                type="text"
                value={price}
                className="w-100 form-control"
                onChange={(e) => setprice(e.target.value)}
              ></input>
            )}
            <br />
            {item.edit ? (
              <span>{item.description}</span>
            ) : (
              <div className="form-floating">
                <textarea
                  className="form-control"
                  value={description}
                  id="floatingTextarea"
                  style={{ width: "16rem", height: "auto" }}
                  onChange={(e) => setdescription(e.target.value)}
                ></textarea>
              </div>
            )}
          </Card.Text>

         <div style={{position:"absolute",bottom:0}}>
            {item.edit ? (
              <button
                type="button"
                className="btn btn-primary"
                style={{
                  width: "9rem",
                  backgroundColor: "#163d5c",
                }}
                onClick={() => handleCart(item)}
              >
                {addedItem ? "Add to Cart" : "Go to Cart "}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => handleCancel(item)}
              >
                Cancel
              </button>
            )}

            

            {item.edit ? (
              <>
                <span>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3196/3196909.png"
                    alt="error"
                    width={"30rem"}
                    style={{ cursor: "pointer",marginLeft:10 }}
                    onClick={() => handleEdit(item)}
                  />
                </span>
                <span>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/8556/8556073.png"
                    alt="error"
                    width={"30rem"}
                    style={{ cursor: "pointer",marginLeft:10 }}
                    onClick={() => handleDelelteProduct(item)}
                  />
                </span>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => handleSave(item)}
              >
                Save
              </button>
            )}
          </div>
          
        </Card.Body>
      </Card>
    </>
   
  );
}
