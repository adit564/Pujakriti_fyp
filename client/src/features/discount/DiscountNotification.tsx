import { useEffect, useState } from "react";
import type { DiscountCode } from "../../app/models/discountCode";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setDiscountCode } from "./discountSlice";

export default function DiscountNotification() {
  const [notifiedCodes, setNotifiedCodes] = useState<string[]>([]);
  const dispatch = useDispatch();
  const [activeCode, setActiveCode] = useState<DiscountCode | null>(null);

  useEffect(() => {
    fetch('http://localhost:8081/api/discounts/active')
      .then((res) => res.json())
      .then((data: DiscountCode[]) => {
        if (data.length > 0) {
          dispatch(setDiscountCode(data[0]));
          setNotifiedCodes([data[0].code]); 
          setActiveCode(data[0]);
        }
      })
      .catch((err) => console.error('Initial discount fetch error:', err));
  }, [dispatch]);


  useEffect(() => {
    if (!activeCode) return;

    const interval = setInterval(() => {
      toast.info(
        `🎉${activeCode.code} (${activeCode.discountRate * 100}% OFF)`,
        {
          position: "bottom-right",
          autoClose: 5000,
        }
      );
    }, 60000); 

    return () => clearInterval(interval);
  }, [activeCode]);

  
}
