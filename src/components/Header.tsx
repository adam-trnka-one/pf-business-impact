
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1.5 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v6.5"></path>
              <path d="M10 16.64a4 4 0 1 1 4.2.3"></path>
              <path d="m2 22 3-3"></path>
              <path d="M19 22v-4"></path>
              <path d="M22 19h-4"></path>
              <path d="m2 11 3-3"></path>
              <path d="M14 2h-4"></path>
              <path d="M3.64 14.64A9 9 0 1 0 9 21"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Support ROI Seer</h1>
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
