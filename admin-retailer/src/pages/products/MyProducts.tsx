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
  const { toast } = useToast();

  const handlePriceOptimization = async () => {
    setIsOptimizing(true);
    toast({
      title: "Price Optimization Started",
      description: "Running price optimization agent in background...",
    });

    try {
      const response = await fetch(
        "https://asia-south1.workflow.boltic.app/4380f3de-86c6-4a0f-8c9f-870b42773b0f/MyProducts"
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
        <Button onClick={handlePriceOptimization} disabled={isOptimizing}>
          {isOptimizing ? "Optimizing..." : "Run Price Optimisation Agent"}
        </Button>
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
                        ${product.our_price.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      ${product.competitor_prices.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-blue-600">
                        ${product.recommended_price.toFixed(2)}
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
