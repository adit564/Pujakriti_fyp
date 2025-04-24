import { Puja } from './Puja';
import { Guide } from './Guide';

export interface Bundle {
  bundleId: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  puja: string; 
  guide: string; 
}


export interface BundleDetails {
  bundleId: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  puja: number; 
  guide: number; 
}

export interface AddBundleRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  puja: {
    name: string;
    description?: string;
  };
  guide: {
    name: string;
    description:string,
    content: string;
  };
}