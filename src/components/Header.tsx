
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <img 
              src="https://productfruits.com/images/pf_logo.svg" 
              alt="ProductFruits Logo" 
              className="h-8"
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">ROI Seer</h1>
            {!isMobile && (
              <p className="text-sm text-gray-500">Calculate your support savings</p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
