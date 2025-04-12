import { useEffect, useState } from "react";
import { Bundle } from "../../app/models/bundle";
import BundleList from "./bundleList";
import agent from "../../app/api/agent";
import NotFoundError from "../../app/errors/NotFoundError";
import Spinner from "../../app/layout/spinner";

export default function BundleCatalog() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
    agent.BundleList.list()
      .then((bundles) => setBundles(bundles.content))
      .catch((error) => console.error("Error fetching bundles:", error))
      .finally(() => setLoading(false));
  }, []);

  if(!bundles) return <NotFoundError />;
  if (loading) return <Spinner message="Loading bundles..." />;
  return <BundleList bundles={bundles} />;
}
