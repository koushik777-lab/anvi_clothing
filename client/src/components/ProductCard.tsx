import { useState } from "react";
import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  discount?: number | null;
  images: string[];
  category: string;
  inStock: boolean;
  onSale?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <div
      className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-md transition-all duration-300"
      data-testid={`card-product-${product._id}`}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative overflow-hidden aspect-[3/4] bg-secondary cursor-pointer">
          <img
            src={product.images[imgIdx] || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onMouseEnter={() => product.images[1] && setImgIdx(1)}
            onMouseLeave={() => setImgIdx(0)}
            data-testid={`img-product-${product._id}`}
          />
          {product.discount && product.discount > 0 && (
            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-sm font-medium">
              {product.discount}% OFF
            </span>
          )}
          {!product.inStock && (
            <span className="absolute inset-0 bg-background/60 flex items-center justify-center text-sm font-medium text-foreground">
              Out of Stock
            </span>
          )}
          {/* Quick add overlay */}
          {product.inStock && onAddToCart && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="absolute bottom-0 left-0 right-0 bg-primary/95 text-primary-foreground text-xs py-2.5 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10"
              data-testid={`button-quick-add-${product._id}`}
            >
              <ShoppingBag size={14} />
              Quick Add
            </button>
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/product/${product.slug}`}>
          <div className="cursor-pointer">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{product.category.replace(/-/g, " ")}</p>
            <h3 className="text-sm font-medium text-foreground leading-snug mb-2 hover:text-primary transition-colors" data-testid={`text-name-${product._id}`}>
              {product.name}
            </h3>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground" data-testid={`text-price-${product._id}`}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
