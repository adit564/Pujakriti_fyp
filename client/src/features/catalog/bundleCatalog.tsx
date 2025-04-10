import { useEffect, useState } from "react";
import { Bundle } from "../../app/models/bundle";
import BundleList from "./bundleList";

export default function BundleCatalog() {
  const [bundles, setBundles] = useState<Bundle[]>([]);

  useEffect(() => {
    fetch(
      "http://localhost:8081/api/bundles?page=0&size=10&sort=bundleId&order=asc"
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setBundles(data.content);
      })
      .catch((error) => {
        console.error("Error fetching bundles:", error);
      });
  }, []);

  return <BundleList bundles={bundles} />;
}
