import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../../app/models/product";

export default function Product() {
  const productId = useParams<{ productId: string }>().productId;

  console.log("Product ID:", productId);
  const [product, setProduct] = useState<Product | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8081/api/products/${productId}`)
    .then((response) => setProduct(response.data))
    .catch((error) => {
      console.error("Error fetching product:", error);
    })
    .finally(() => setLoading(false));
  },[productId])

  
  if (loading) return <h2>Loading...</h2>;
  if (!product) return <h2>Product not found</h2>;

  return (
    <>
      <h2>{product.name}</h2>
      <h2>{product.description}</h2>
      <h2>{product.price}</h2>
    </>
  );
}