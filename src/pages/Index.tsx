
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChurnCalculator from "@/components/ChurnCalculator";
import ConversionCalculator from "@/components/ConversionCalculator";
import { useIsMobile } from "@/hooks/use-mobile";
import Calculator from "@/components/Calculator";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 bg-[fffffff] bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl text-gray-900 mb-4 font-semibold md:text-4xl">Calculate the business impact of Product Fruits</h2>
              <p className="text-lg whitespace-nowrap overflow-x-auto mx-auto text-slate-950 px-0">Poor onboarding doesn't just frustrate users. It costs you in churn, conversions, and support overhead.</p>
            </div>
            
            <Tabs defaultValue="churn" className="mb-8">
              <TabsList className="grid w-full grid-cols-3 gap-2 mb-8 bg-white">
                <TabsTrigger value="churn" className="flex items-center gap-1 text-xs sm:text-base px-2 sm:px-3 py-1.5 border border-gray-300 bg-white">
                  <span>{isMobile ? "Churn" : "Churn reduction"}</span>
                </TabsTrigger>
                <TabsTrigger value="support" className="flex items-center gap-1 text-xs sm:text-base px-2 sm:px-3 py-1.5 border border-gray-300 bg-white">
                  <span>{isMobile ? "Support" : "Support cost reduction"}</span>
                </TabsTrigger>
                <TabsTrigger value="conversion" className="flex items-center gap-1 text-xs sm:text-base px-2 sm:px-3 py-1.5 border border-gray-300 bg-white">
                  <span>{isMobile ? "Revenue" : "Revenue uplift"}</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="churn">
                <div className="border border-[#03bf92] rounded-lg p-4 mb-8 flex items-start bg-[#03bf92]/[0.06]">
                  <div>
                    <p className="text-sm text-gray-800">
                      Clients using Product Fruits see a <strong>30-70% reduction</strong> in 
                      customer churn after implementing automated onboarding.
                    </p>
                  </div>
                </div>
                
                <ChurnCalculator />
              </TabsContent>
              
              <TabsContent value="support">
                <div className="border border-[#03bf92] rounded-lg p-4 mb-8 flex items-start bg-[#03bf92]/[0.06]">
                  <div>
                    <p className="text-sm text-gray-800">
                      Clients using Product Fruits see a <strong>20-35% reduction</strong> in 
                      support tickets after implementing automated user onboarding.
                    </p>
                  </div>
                </div>
                
                <Calculator />
              </TabsContent>

              <TabsContent value="conversion">
                <div className="border border-[#03bf92] rounded-lg p-4 mb-8 flex items-start bg-[#03bf92]/[0.06]">
                  <div>
                    <p className="text-sm text-gray-800">
                      Clients using Product Fruits see a <strong>25-50% lift</strong> in trial-to-paid conversions after implementing automated onboarding.
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
