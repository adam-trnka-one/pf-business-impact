
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Calculator from "@/components/Calculator";
import ChurnCalculator from "@/components/ChurnCalculator";
import ConversionCalculator from "@/components/ConversionCalculator";
import { TrendingUp, Users, BarChart, Info } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Business Impact of Reducing Churn and Support Tickets
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Quantify the benefits of implementing in-app support solutions, reducing customer churn, and improving trial conversions.
              </p>
            </div>
            
            <Tabs defaultValue="support" className="mb-8">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="support" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span>Support Cost Reduction</span>
                </TabsTrigger>
                <TabsTrigger value="churn" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Churn Reduction</span>
                </TabsTrigger>
                <TabsTrigger value="conversion" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Revenue Impact</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="support">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-start">
                  <Info className="text-primary h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-800">
                      Based on industry data, companies typically see a <strong>20-35% reduction</strong> in 
                      support tickets after implementing comprehensive in-app support solutions.
                    </p>
                  </div>
                </div>
                
                <Calculator />
              </TabsContent>
              
              <TabsContent value="churn">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-start">
                  <Info className="text-primary h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-800">
                      Based on industry data, companies typically see a <strong>30-70% reduction</strong> in 
                      customer churn after implementing better onboarding and in-app guidance.
                    </p>
                  </div>
                </div>
                
                <ChurnCalculator />
              </TabsContent>

              <TabsContent value="conversion">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-start">
                  <Info className="text-primary h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-800">
                      Based on industry data, companies typically see a <strong>25-50% improvement</strong> in 
                      trial-to-paid conversion rates after implementing guided onboarding.
                    </p>
                  </div>
                </div>
                
                <ConversionCalculator />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
