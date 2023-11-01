import React from "react";

import ProductItem from "./ProductItem";
import { useSelector } from "react-redux";
import Sort from "./Sort";

export default function ProductItemList({}) {
  const data = useSelector((state) => state.products);
  if (data.length === 0) {
    return (
      <div className="d-inline-flex p-2 bd-highlight">
        <div
          className="spinner-border"
          style={{ position: "absolute",top: "46%",left: "46%",width: "8rem", height: "8rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else {
    return (
      <>  
      <Sort />
      <div className="d-inline-flex flex-wrap p-2 bd-highlight">      
        {data.map((item) => (
          <ProductItem item={item} key={item.title} />
        ))}
      </div>
      </>
    );
  }
}