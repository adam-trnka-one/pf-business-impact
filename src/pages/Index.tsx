
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Calculator from "@/components/Calculator";
import ChurnCalculator from "@/components/ChurnCalculator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Info, Users, BarChart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Calculate Your Product ROI
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Quantify the benefits of implementing in-app support solutions and reducing customer churn.
              </p>
            </div>
            
            <Tabs defaultValue="support" className="mb-8">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="support" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span>Support ROI</span>
                </TabsTrigger>
                <TabsTrigger value="churn" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Churn Reduction</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="support">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start">
                  <Info className="text-blue-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800">
                      Based on industry data, companies typically see a <strong>20-35% reduction</strong> in 
                      support tickets after implementing comprehensive in-app support solutions.
                    </p>
                  </div>
                </div>
                
                <Calculator />
              </TabsContent>
              
              <TabsContent value="churn">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8 flex items-start">
                  <Info className="text-purple-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-purple-800">
                      Based on industry data, companies typically see a <strong>30-70% reduction</strong> in 
                      customer churn after implementing better onboarding and in-app guidance.
                    </p>
                  </div>
                </div>
                
                <ChurnCalculator />
              </TabsContent>
            </Tabs>
            
            <div className="mt-16 space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">How It Works</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                      <span className="text-blue-800 font-bold">1</span>
                    </div>
                    <h4 className="text-lg font-medium mb-2">Enter Your Data</h4>
                    <p className="text-gray-600 text-sm">
                      Input your current metrics including support costs or customer churn rates.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                      <span className="text-blue-800 font-bold">2</span>
                    </div>
                    <h4 className="text-lg font-medium mb-2">Set Reduction Targets</h4>
                    <p className="text-gray-600 text-sm">
                      Estimate the percentage of improvement you could achieve with better in-app experiences.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                      <span className="text-blue-800 font-bold">3</span>
                    </div>
                    <h4 className="text-lg font-medium mb-2">View Your Savings</h4>
                    <p className="text-gray-600 text-sm">
                      Instantly see your potential cost savings and revenue retention opportunities.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
