import { useState } from "react";
import { useGetProductBySlug, useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCartSession } from "@/hooks/use-cart-session";
import { formatPrice } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Props {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: Props) {
  const { data: product, isLoading } = useGetProductBySlug(params.slug);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const sessionId = useCartSession();
  const addToCart = useAddToCart();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!sessionId) return;
    if (!selectedSize && product?.sizes && product.sizes.length > 0) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    addToCart.mutate(
      {
        data: {
          sessionId,
          productId: product!._id,
          quantity: qty,
          size: selectedSize || "Free Size",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
          toast({ title: "Added to cart", description: `${product?.name} added successfully.` });
        },
        onError: () => {
          toast({ title: "Error", description: "Could not add to cart.", variant: "destructive" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="aspect-[3/4] rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link href="/shop">
          <span className="text-primary hover:underline mt-4 block cursor-pointer">Back to Shop</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8 flex-wrap">
        <Link href="/"><span className="hover:text-primary cursor-pointer">Home</span></Link>
        <span>/</span>
        <Link href="/shop"><span className="hover:text-primary cursor-pointer">Shop</span></Link>
        <span>/</span>
        <Link href={`/shop/${product.category}`}><span className="hover:text-primary cursor-pointer capitalize">{product.category.replace(/-/g, " ")}</span></Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image gallery */}
        <div>
          <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-secondary mb-3">
            <img
              src={product.images[imgIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="img-product-main"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx((i) => Math.max(0, i - 1))}
                  disabled={imgIdx === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-background transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setImgIdx((i) => Math.min(product.images.length - 1, i + 1))}
                  disabled={imgIdx === product.images.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-background transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
            {product.discount && product.discount > 0 && (
              <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-sm font-medium">
                {product.discount}% OFF
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${i === imgIdx ? "border-primary" : "border-transparent"}`}
                  data-testid={`button-thumb-${i}`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 capitalize">
            {product.category.replace(/-/g, " ")}
          </p>
          <h1 className="text-2xl font-semibold text-foreground mb-3" data-testid="text-product-name">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-xl font-semibold text-foreground" data-testid="text-product-price">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount && product.discount > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-sm font-medium">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>
          )}

          {product.fabric && (
            <div className="mb-4 text-sm">
              <span className="font-medium text-foreground">Fabric:</span>{" "}
              <span className="text-muted-foreground">{product.fabric}</span>
            </div>
          )}

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-foreground mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-1.5 text-sm border rounded-sm transition-colors ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                    data-testid={`button-size-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-6">
            <p className="text-sm font-medium text-foreground">Quantity:</p>
            <div className="flex items-center border border-border rounded-sm">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center hover:bg-secondary transition-colors text-sm"
                data-testid="button-qty-minus"
              >
                −
              </button>
              <span className="w-10 text-center text-sm" data-testid="text-qty">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center hover:bg-secondary transition-colors text-sm"
                data-testid="button-qty-plus"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || addToCart.isPending}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-sm flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-60 transition-colors font-medium"
            data-testid="button-add-to-cart"
          >
            <ShoppingBag size={18} />
            {addToCart.isPending ? "Adding..." : product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
