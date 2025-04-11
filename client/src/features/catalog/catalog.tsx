import {useEffect, useState } from "react";
import { Product } from "../../app/models/product.ts";
import ProductList from "./productList.tsx";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(
      "http://localhost:8081/api/products?page=0&size=15&sort=productId&order=asc"
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setProducts(data.content);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return <ProductList products={products} />;
}
