import { Link } from "wouter";
import { useGetCart, useUpdateCartItem, useRemoveFromCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCartSession } from "@/hooks/use-cart-session";
import { formatPrice } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const sessionId = useCartSession();
  const { data: cart, isLoading } = useGetCart(
    { sessionId: sessionId ?? "" },
    { query: { enabled: !!sessionId } }
  );
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidateCart = () => {
    queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId: sessionId ?? "" }) });
  };

  const handleUpdate = (itemId: string, quantity: number) => {
    if (!sessionId) return;
    updateItem.mutate(
      { itemId, data: { sessionId, quantity } },
      { onSuccess: invalidateCart }
    );
  };

  const handleRemove = (itemId: string) => {
    if (!sessionId) return;
    removeItem.mutate(
      { itemId, data: { sessionId } },
      {
        onSuccess: () => {
          invalidateCart();
          toast({ title: "Removed from cart" });
        },
      }
    );
  };

  if (isLoading || !sessionId) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-semibold mb-8">Your Cart</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-24 h-28 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground text-sm mb-6">Looks like you haven't added anything yet.</p>
        <Link href="/shop">
          <span
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-sm text-sm hover:bg-primary/90 transition-colors cursor-pointer"
            data-testid="link-shop-now"
          >
            Start Shopping
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-semibold mb-8" data-testid="text-cart-title">Your Cart ({cart.itemCount} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="flex gap-4 p-4 border border-border rounded-lg bg-card" data-testid={`row-cart-item-${item._id}`}>
              <Link href={`/product/${item.productId}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-28 object-cover rounded-md bg-secondary cursor-pointer"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.productId}`}>
                  <h3 className="text-sm font-medium text-foreground leading-snug hover:text-primary transition-colors cursor-pointer" data-testid={`text-item-name-${item._id}`}>
                    {item.name}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground mt-1">Size: {item.size}</p>
                <p className="text-sm font-semibold text-foreground mt-2" data-testid={`text-item-price-${item._id}`}>
                  {formatPrice(item.price)}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-border rounded-sm">
                    <button
                      onClick={() => handleUpdate(item._id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors text-sm"
                      data-testid={`button-decrease-${item._id}`}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm" data-testid={`text-item-qty-${item._id}`}>{item.quantity}</span>
                    <button
                      onClick={() => handleUpdate(item._id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors text-sm"
                      data-testid={`button-increase-${item._id}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    data-testid={`button-remove-${item._id}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold" data-testid={`text-item-subtotal-${item._id}`}>
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-secondary rounded-lg p-5 sticky top-24">
            <h2 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({cart.itemCount} items)</span>
                <span data-testid="text-subtotal">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 mb-5">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span data-testid="text-total">{formatPrice(cart.subtotal)}</span>
              </div>
            </div>
            <button
              className="w-full bg-primary text-primary-foreground py-3 rounded-sm text-sm hover:bg-primary/90 transition-colors font-medium"
              data-testid="button-checkout"
            >
              Proceed to Checkout
            </button>
            <Link href="/shop">
              <span className="block text-center text-xs text-muted-foreground mt-3 hover:text-primary transition-colors cursor-pointer">
                Continue Shopping
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
