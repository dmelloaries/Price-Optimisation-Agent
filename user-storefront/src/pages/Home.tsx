import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ShoppingCart } from "lucide-react";
import { MorphingText } from "@/components/ui/morphing-text";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  our_price: number;
  image_url: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://asia-south1.workflow.boltic.app/c17e5c0a-a857-4df5-80c2-ea9d67188b49/get-my-products"
        );
        const data = await response.json();
        setProducts(data.return);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
    toast.success("Item added to cart");
  };

  const features = [
    {
      image: "/dress.png",
      title: "Dress",
    },
    {
      image: "/eyewear.png",
      title: "Eyewear",
    },
    {
      image: "/hats.png",
      title: "Hats",
    },
    {
      image: "/makeup.png",
      title: "Makeup",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo on the left */}
            <div className="flex items-center">
              <img
                src="/mello-logo.png"
                alt="Mello Logo"
                className="h-24 w-auto"
              />
            </div>

            {/* Cart and Logout buttons on the right */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="relative cursor-pointer"
                onClick={() => toast.info("Cart feature coming soon!")}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button
                onClick={handleLogout}
                className="cursor-pointer"
                variant="outline"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="">
          <div className="text-center">
            <MorphingText
              texts={[
                "  Discover amazing products",
                "& enjoy a seamless shopping experience",
              ]}
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 cursor-pointer md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-24 w-auto mx-auto"
                  />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900">Our Products</h3>
          <p className="mt-4 text-lg text-gray-600">
            Browse our amazing collection
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">
                    {product.name}
                  </CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.our_price.toFixed(2)}
                    </span>
                    <Button
                      onClick={handleAddToCart}
                      size="sm"
                      className="cursor-pointer"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
