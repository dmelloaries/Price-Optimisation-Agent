import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  our_price: number;
  image_url: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product: Product) => {
    // Calculate updated cart first
    const existingItem = cartItems.find((item) => item.id === product.id);
    const updatedCart = existingItem
      ? cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cartItems, { ...product, quantity: 1 }];

    // Update state
    setCartItems(updatedCart);

    // Send cart data to API
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        // Extract unique product IDs (only unique items, not based on quantity)
        const uniqueIds = new Set<number>();
        updatedCart.forEach((item) => {
          const parsedId = parseInt(item.id);
          if (!isNaN(parsedId)) {
            uniqueIds.add(parsedId);
          }
        });
        const productIds = Array.from(uniqueIds);

        console.log("Sending product_ids:", productIds);
        
        const response = await fetch(
          "https://asia-south1.workflow.boltic.app/90f91151-139d-4118-90a3-6978103eac91/user-cart-interest",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              product_ids: productIds,
            }),
          }
        );

        console.log("Cart interest API response:", response.status);
      } else {
        console.warn("No userId found in localStorage");
      }
    } catch (error) {
      console.error("Failed to send cart data to API:", error);
      // Don't throw error to avoid disrupting the user experience
    }
  };

  const removeFromCart = async (productId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);

    // Send updated cart data to API
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const uniqueIds = new Set<number>();
        updatedCart.forEach((item) => {
          const parsedId = parseInt(item.id);
          if (!isNaN(parsedId)) {
            uniqueIds.add(parsedId);
          }
        });
        const productIds = Array.from(uniqueIds);

        await fetch(
          "https://asia-south1.workflow.boltic.app/90f91151-139d-4118-90a3-6978103eac91/user-cart-interest",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              product_ids: productIds,
            }),
          }
        );
      }
    } catch (error) {
      console.error("Failed to send cart data to API:", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);

    // Send updated cart data to API
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const uniqueIds = new Set<number>();
        updatedCart.forEach((item) => {
          const parsedId = parseInt(item.id);
          if (!isNaN(parsedId)) {
            uniqueIds.add(parsedId);
          }
        });
        const productIds = Array.from(uniqueIds);

        await fetch(
          "https://asia-south1.workflow.boltic.app/90f91151-139d-4118-90a3-6978103eac91/user-cart-interest",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              product_ids: productIds,
            }),
          }
        );
      }
    } catch (error) {
      console.error("Failed to send cart data to API:", error);
    }
  };

  const clearCart = async () => {
    setCartItems([]);

    // Send empty cart to API
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        await fetch(
          "https://asia-south1.workflow.boltic.app/90f91151-139d-4118-90a3-6978103eac91/user-cart-interest",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              product_ids: [],
            }),
          }
        );
      }
    } catch (error) {
      console.error("Failed to send cart data to API:", error);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.our_price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
