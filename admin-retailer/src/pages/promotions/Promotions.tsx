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

interface Promotion {
  userId: string;
  userImage: string;
  userEmail: string;
  productSuggested: string;
  reasonForSuggestion: string;
}

const mockPromotions: Promotion[] = [
  {
    userId: "U001",
    userImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    userEmail: "john.smith@example.com",
    productSuggested: "Wireless Bluetooth Headphones",
    reasonForSuggestion:
      "Frequently views audio equipment; high engagement with similar products",
  },
  {
    userId: "U002",
    userImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    userEmail: "sarah.johnson@example.com",
    productSuggested: "Smart Watch Series 5",
    reasonForSuggestion:
      "Recently purchased fitness accessories; interested in health tracking",
  },
  {
    userId: "U003",
    userImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    userEmail: "michael.brown@example.com",
    productSuggested: "Ergonomic Office Chair",
    reasonForSuggestion: "Works from home; previously bought desk accessories",
  },
  {
    userId: "U004",
    userImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    userEmail: "emily.davis@example.com",
    productSuggested: "Mechanical Keyboard RGB",
    reasonForSuggestion:
      "Gaming enthusiast; high activity in gaming peripherals category",
  },
  {
    userId: "U005",
    userImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    userEmail: "david.wilson@example.com",
    productSuggested: "Portable SSD 1TB",
    reasonForSuggestion:
      "Content creator; frequently purchases storage solutions",
  },
  {
    userId: "U006",
    userImage:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    userEmail: "jessica.martinez@example.com",
    productSuggested: "4K Webcam Pro",
    reasonForSuggestion:
      "Remote worker; recently searched for video conferencing equipment",
  },
  {
    userId: "U007",
    userImage:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    userEmail: "robert.taylor@example.com",
    productSuggested: "Wireless Gaming Mouse",
    reasonForSuggestion:
      "Competitive gamer; high engagement with gaming accessories",
  },
  {
    userId: "U008",
    userImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    userEmail: "amanda.lee@example.com",
    productSuggested: "USB-C Charging Cable 6ft",
    reasonForSuggestion:
      "Owns multiple USB-C devices; frequently needs replacement cables",
  },
];

const getInitials = (email: string) => {
  const name = email.split("@")[0];
  const parts = name.split(".");
  return parts.map((part) => part[0].toUpperCase()).join("");
};

const Promotions = () => {
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">User ID</TableHead>
                  <TableHead className="w-20">User Image</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>Product Suggested</TableHead>
                  <TableHead>Reason for Suggestion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPromotions.map((promotion) => (
                  <TableRow key={promotion.userId}>
                    <TableCell className="font-medium">
                      {promotion.userId}
                    </TableCell>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={promotion.userImage}
                          alt={promotion.userEmail}
                        />
                        <AvatarFallback>
                          {getInitials(promotion.userEmail)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {promotion.userEmail}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {promotion.productSuggested}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {promotion.reasonForSuggestion}
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

export default Promotions;
