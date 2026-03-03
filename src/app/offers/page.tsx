import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, BarChart3, MessageSquare } from "lucide-react";

const providers = [
  {
    id: "adgem",
    name: "AdGem",
    icon: ClipboardList,
    description:
      "Complete app installs, sign-ups, and task-based offers to earn points.",
    types: "App Installs, Sign-ups, Tasks",
  },
  {
    id: "lootably",
    name: "Lootably",
    icon: BarChart3,
    description:
      "Browse a wide variety of offers including shopping, videos, and more.",
    types: "Shopping, Videos, Tasks, Surveys",
  },
  {
    id: "bitlabs",
    name: "BitLabs",
    icon: MessageSquare,
    description:
      "Take surveys from top research companies and earn points for your opinions.",
    types: "Surveys, Research Studies",
  },
];

export default function OffersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Earn Points</h1>
        <p className="text-muted-foreground mt-2">
          Complete offers from our partner networks to earn points. The more you
          complete, the more you earn.
        </p>
      </div>

      <Tabs defaultValue="adgem">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {providers.map((provider) => (
            <TabsTrigger key={provider.id} value={provider.id}>
              {provider.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {providers.map((provider) => (
          <TabsContent key={provider.id} value={provider.id}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <provider.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{provider.name}</h2>
                    <p className="text-muted-foreground mt-1">
                      {provider.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {provider.types.split(", ").map((type) => (
                        <Badge key={type} variant="secondary">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Offerwall placeholder — real iframe embeds in Phase 2 */}
                <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center">
                  <p className="text-muted-foreground">
                    Log in to access {provider.name} offers
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Offers will appear here once you&apos;re signed in
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
