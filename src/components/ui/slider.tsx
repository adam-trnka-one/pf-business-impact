import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>>(({
  className,
  ...props
}, ref) => <SliderPrimitive.Root ref={ref} className={cn("relative flex w-full touch-none select-none items-center", className)} {...props}>
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-100">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-gradient-to-r from-[#FF4C0A] to-[#FE8A26]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-12 w-12 rounded-full border border-[#FF751D]/50 bg-[#FF751D] shadow-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative">
      <img src="https://productfruits.com/images/pf_piktogram_bila.svg" alt="ProductFruits Logo" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6" />
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>);
Slider.displayName = SliderPrimitive.Root.displayName;
export { Slider };