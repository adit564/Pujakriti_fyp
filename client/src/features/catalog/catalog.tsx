import { use, useEffect, useState } from "react";
import { Product } from "../../app/models/product.ts";
import ProductList from "./productList.tsx";
import agent from "../../app/api/agent.ts";
import Spinner from "../../app/layout/spinner.tsx";
import NotFoundError from "../../app/errors/NotFoundError.tsx";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    agent.ProductsList.list()
      .then((products) => setProducts(products.content))
      .catch((error) => console.error("Error fetching products:", error))
      .finally(() => setLoading(false));
  }, []);

  if(!products) return <NotFoundError />;
  if (loading) return <Spinner message="Loading products..." />;

  return <ProductList products={products} />;
}
