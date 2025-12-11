import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Package, ShoppingCart, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const features = [
    {
      icon: Package,
      title: "Wide Selection",
      description: "Browse through thousands of products",
    },
    {
      icon: ShoppingCart,
      title: "Easy Shopping",
      description: "Add items to cart with one click",
    },
    {
      icon: Star,
      title: "Top Quality",
      description: "Only the best products for you",
    },
    {
      icon: TrendingUp,
      title: "Best Deals",
      description: "Get the best prices guaranteed",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                User Storefront
              </h1>
            </div>
            <Button onClick={handleLogout} className="cursor-pointer" variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Welcome to Your Storefront
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing products and enjoy a seamless shopping experience
            </p>
            <div className="mt-8">
              <Button size="lg" className="mr-4">
                Start Shopping
              </Button>
              <Button size="lg" variant="outline">
                View Categories
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900">Why Choose Us</h3>
          <p className="mt-4 text-lg text-gray-600">
            Experience the best in online shopping
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900">Popular Products</h3>
          <p className="mt-4 text-lg text-gray-600">
            Check out our bestsellers
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <CardTitle>Product {item}</CardTitle>
                <CardDescription>Premium quality item</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    $99.99
                  </span>
                  <Button>Add to Cart</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
