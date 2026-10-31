import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { designers, colorSchemes, type Product, type Designer } from "./designers"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ProductWithDesigner {
  product: Product;
  designer: Designer;
  designerIndex: number;
  accentColor: string;
}

export function findProductById(productId: number): ProductWithDesigner | null {
  for (let i = 0; i < designers.length; i++) {
    const designer = designers[i];
    const product = designer.products.find(p => p.id === productId);
    if (product) {
      return {
        product,
        designer,
        designerIndex: i,
        accentColor: colorSchemes[i % colorSchemes.length][1],
      };
    }
  }
  return null;
}

export function getRelatedProducts(productId: number, limit: number = 4): ProductWithDesigner[] {
  const current = findProductById(productId);
  if (!current) return [];

  const related: ProductWithDesigner[] = [];

  // First, get other products from the same designer
  for (const product of current.designer.products) {
    if (product.id !== productId && related.length < limit) {
      related.push({
        product,
        designer: current.designer,
        designerIndex: current.designerIndex,
        accentColor: current.accentColor,
      });
    }
  }

  return related;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getAllProducts(): ProductWithDesigner[] {
  const allProducts: ProductWithDesigner[] = [];

  for (let i = 0; i < designers.length; i++) {
    const designer = designers[i];
    const accentColor = colorSchemes[i % colorSchemes.length][1];

    for (const product of designer.products) {
      allProducts.push({
        product,
        designer,
        designerIndex: i,
        accentColor,
      });
    }
  }

  return allProducts;
}

export function getAllCategories(): string[] {
  const categories = new Set<string>();

  for (const designer of designers) {
    for (const product of designer.products) {
      categories.add(product.category);
    }
  }

  return Array.from(categories).sort();
}

export function getAllDesignerNames(): string[] {
  return designers.map(d => d.name);
}

export function getPriceRange(): { min: number; max: number } {
  let min = Infinity;
  let max = 0;

  for (const designer of designers) {
    for (const product of designer.products) {
      if (product.price < min) min = product.price;
      if (product.price > max) max = product.price;
    }
  }

  return { min, max };
}
