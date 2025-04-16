
import { Card, CardContent } from "@/components/ui/card";
import Calculator from "@/components/Calculator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Info } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Calculate Your Support Savings
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Quantify the ROI of implementing in-app support solutions like help centers, 
                contextual guides, and AI assistance.
              </p>
            </div>
            
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
                      Input your current support metrics including ticket volume, time spent per ticket, and hourly costs.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                      <span className="text-blue-800 font-bold">2</span>
                    </div>
                    <h4 className="text-lg font-medium mb-2">Set Reduction Target</h4>
                    <p className="text-gray-600 text-sm">
                      Estimate the percentage of tickets that could be eliminated with improved in-app support.
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
                      Instantly see your potential monthly and annual cost savings from reduced support needs.
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
