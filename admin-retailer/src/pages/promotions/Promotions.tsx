import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Promotion {
  user_id: number;
  product_suggested: string;
  reason_for_suggestion: string;
  product_img: string;
  user_img_link: string;
  user_email: string;
}

const getInitials = (email: string) => {
  const name = email.split("@")[0];
  const parts = name.split(".");
  return parts.map((part) => part[0].toUpperCase()).join("");
};

const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingAds, setSendingAds] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://asia-south1.workflow.boltic.app/53686c3b-5eae-42d9-8b3d-2b637d2fdc78/promotion-table"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch promotions");
        }

        const data = await response.json();
        setPromotions(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const getUserOccurrenceIndex = (userId: number, currentIndex: number) => {
    return (
      promotions.slice(0, currentIndex + 1).filter((p) => p.user_id === userId)
        .length - 1
    );
  };

  const handleSendAds = async (userId: number, index: number) => {
    const key = `${userId}-${index}`;
    setSendingAds((prev) => ({ ...prev, [key]: true }));

    try {
      const occurrenceIndex = getUserOccurrenceIndex(userId, index);
      const response = await fetch(
        "https://asia-south1.workflow.boltic.app/fcf34828-d184-48bd-a0d9-9ceb31defdbe/send-ads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            index: occurrenceIndex,
            user_id: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send ads");
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: data.msg || `Ad sent successfully to user ${userId}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to send ads",
        variant: "destructive",
      });
    } finally {
      setSendingAds((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
        <p className="text-gray-600 mt-2">
          Personalized product recommendations for your customers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Promotions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-gray-500">Loading promotions...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : promotions.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-gray-500">No promotions available</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">ID</TableHead>
                    <TableHead className="w-20">User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Product Suggested</TableHead>
                    <TableHead>Reason for Suggestion</TableHead>
                    <TableHead>Ads Promotion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promotion, index) => (
                    <TableRow key={`${promotion.user_id}-${index}`}>
                      <TableCell className="font-medium">
                        {promotion.user_id}
                      </TableCell>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={promotion.user_img_link}
                            alt={promotion.user_email}
                          />
                          <AvatarFallback>
                            {getInitials(promotion.user_email)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {promotion.user_email}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start gap-2">
                          <img
                            src={promotion.product_img}
                            alt={promotion.product_suggested}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                          <Badge variant="outline" className="font-medium">
                            {promotion.product_suggested}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {promotion.reason_for_suggestion}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            handleSendAds(promotion.user_id, index)
                          }
                          disabled={sendingAds[`${promotion.user_id}-${index}`]}
                          size="sm"
                          className="cursor-pointer"
                        >
                          {sendingAds[`${promotion.user_id}-${index}`]
                            ? "Sending..."
                            : "Send Ads"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Promotions;
