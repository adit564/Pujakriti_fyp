import { useEffect, useState } from "react";
import type { DiscountCode } from "../models/discountCode";
import { toast } from "react-toastify";


let discount: DiscountCode | undefined = undefined; // Initialize discount as undefined

export default function DiscountNotification() {


    const [notifiedCodes, setNotifiedCodes] = useState<string[]>([]);

    useEffect(() => {
      const interval = setInterval(() => {
        fetch('http://localhost:8081/api/discounts/active')
          .then((res) => res.json())
          .then((data: DiscountCode[]) => {
            const newCodes = data.filter(
              (d) => !notifiedCodes.includes(d.code)
            );
            
            discount = (newCodes[0]); // Add new codes to the discount array
            
            console.log("New discount codes:", newCodes);

            newCodes.forEach((discount) => {
              toast.info(`🎉 Use discount code: ${discount.code} (${discount.discountRate * 100}% OFF)`, {
                position: "bottom-right",
                autoClose: 5000
              });
            });
  
            setNotifiedCodes((prev) => [
              ...prev,
              ...newCodes.map((d) => d.code),
            ]);
          })
          .catch((err) => console.error('Error checking discounts:', err));
      }, 60000); 
  
      return () => clearInterval(interval);
    });

}


export function getDiscountCodes() {
    return discount;
  }
