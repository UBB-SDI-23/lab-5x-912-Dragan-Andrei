import { Blend } from './Blend';
import {Sale} from './Sale';

export interface Coffee {
    id: number;
    name: string;
    price: number;
    calories: number;
    quantity: number;
    vegan: boolean;
    blend: Blend;
    sales: Sale[]; 
}