import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Product {
  id: string;
  product_id: number;
  name: string;
  image_url: string;
  category: string;
  our_price: number;
  competitor_prices: number;
  recommended_price: number;
  "suggestion reason": string;
  stock_quantity: number;
  trend_score: number;
}

const getSuggestionColor = (suggestion: string) => {
  if (!suggestion) return "bg-blue-50 text-blue-700 border-blue-200";
  const lower = suggestion.toLowerCase();
  if (lower.includes("increase") || lower.includes("above")) {
    return "bg-green-50 text-green-700 border-green-200";
  }
  if (lower.includes("decrease") || lower.includes("lower")) {
    return "bg-red-50 text-red-700 border-red-200";
  }
  return "bg-blue-50 text-blue-700 border-blue-200";
};

const getTrendBadge = (score: number) => {
  if (score >= 8.5) {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
        {score}
      </Badge>
    );
  }
  if (score >= 7.5) {
    return (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        {score}
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
      {score}
    </Badge>
  );
};

const MyProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    name: "",
    category: "",
    our_price: "",
    stock_quantity: "",
    image_url: "",
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://asia-south1.workflow.boltic.app/69d14580-dd44-4ad6-bd11-35707528532a/post-myproduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: Number(formData.product_id),
            name: formData.name,
            category: formData.category,
            our_price: Number(formData.our_price),
            stock_quantity: Number(formData.stock_quantity),
            image_url: formData.image_url,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      toast({
        title: "Success",
        description: "Product added successfully!",
      });

      // Reset form and close sheet
      setFormData({
        product_id: "",
        name: "",
        category: "",
        our_price: "",
        stock_quantity: "",
        image_url: "",
      });
      setIsSheetOpen(false);

      // Refresh products list
      const productsResponse = await fetch(
        "https://asia-south1.workflow.boltic.app/c17e5c0a-a857-4df5-80c2-ea9d67188b49/get-my-products"
      );
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.return || []);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to add product",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePriceOptimization = async () => {
    setIsOptimizing(true);
    toast({
      title: "Price Optimization Started",
      description: "Running price optimization agent in background...",
    });

    try {
      const response = await fetch(
        "https://asia-south1.workflow.boltic.app/b7b741cf-347f-4d23-b0ae-b2438f55a081/0d2d45d5-1231-49ba-9b21-0e3a9e8fba1b/MyProducts"
      );

      if (!response.ok) {
        throw new Error("Failed to run price optimization");
      }

      const data = await response.json();

      toast({
        title: "Success",
        description:
          data.response || "Price optimization completed successfully",
      });

      // Refresh products after optimization
      const productsResponse = await fetch(
        "https://asia-south1.workflow.boltic.app/c17e5c0a-a857-4df5-80c2-ea9d67188b49/get-my-products"
      );
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.return || []);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to run price optimization",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://asia-south1.workflow.boltic.app/c17e5c0a-a857-4df5-80c2-ea9d67188b49/get-my-products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.return || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-2">
            Manage your product inventory and pricing strategy
          </p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Loading products...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-2">
            Manage your product inventory and pricing strategy
          </p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-2">
            Manage your product inventory and pricing strategy
          </p>
        </div>

        <div className="flex gap-3">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Add New Product</SheetTitle>
                <SheetDescription>
                  Fill in the product details below to add it to your inventory.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleAddProduct} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="product_id">Product ID</Label>
                  <Input
                    id="product_id"
                    name="product_id"
                    type="number"
                    required
                    value={formData.product_id}
                    onChange={handleInputChange}
                    placeholder="e.g., 11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Yoga Mat Premium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    type="text"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Fitness"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="our_price">Price ($)</Label>
                  <Input
                    id="our_price"
                    name="our_price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.our_price}
                    onChange={handleInputChange}
                    placeholder="e.g., 49.99"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    name="stock_quantity"
                    type="number"
                    required
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 89"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    type="url"
                    required
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding Product..." : "Add Product"}
                </Button>
              </form>
            </SheetContent>
          </Sheet>
          <Button
            className="cursor-pointer"
            onClick={handlePriceOptimization}
            disabled={isOptimizing}
          >
            {isOptimizing ? "Optimizing..." : "Run Price Optimisation Agent"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-20 font-semibold">ID</TableHead>
                  <TableHead className="min-w-[200px] font-semibold">
                    Product
                  </TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="text-right font-semibold">
                    My Price
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Competitor
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Recommended
                  </TableHead>
                  <TableHead className="w-[200px] font-semibold">
                    Suggestion
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Stock
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Trend
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow
                    key={product.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    <TableCell className="font-semibold text-gray-700">
                      {product.product_id}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-2 max-w-[200px]">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-14 h-14 rounded-lg object-cover shadow-sm border border-gray-200"
                        />
                        <span className="font-medium text-gray-900 break-words">
                          {product.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-gray-900">
                        ${product.our_price?.toFixed(2) ?? "0.00"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      ${product.competitor_prices?.toFixed(2) ?? "0.00"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-blue-600">
                        ${product.recommended_price?.toFixed(2) ?? "0.00"}
                      </span>
                    </TableCell>
                    <TableCell className="w-[200px]">
                      <div
                        className={`text-sm p-2 rounded-md border leading-relaxed break-words ${getSuggestionColor(
                          product["suggestion reason"]
                        )}`}
                      >
                        {product["suggestion reason"]}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-medium ${
                          product.stock_quantity === 0
                            ? "text-red-600"
                            : product.stock_quantity < 50
                            ? "text-amber-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.stock_quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {getTrendBadge(product.trend_score)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProducts;
