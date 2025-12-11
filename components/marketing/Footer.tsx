export const Footer = () => {
  return (
    <div className="border-t border-slate-800 bg-slate-950 p-4">
      <div className="md:max-w-screen-2xl mx-auto p-4 flex items-center justify-between">
         <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-emerald-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">T</span>
                </div>
                <span className="font-semibold text-slate-200">TradeMastery</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs">
                Master the markets with our comprehensive trading curriculum. From technical analysis to psychology, we cover it all.
            </p>
         </div>
         <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
            <div className="flex items-center gap-x-4">
                <span className="text-slate-500 text-sm">© 2024 TradeMastery. All rights reserved.</span>
                <span className="text-slate-500 text-sm cursor-pointer hover:text-emerald-400">Privacy Policy</span>
                <span className="text-slate-500 text-sm cursor-pointer hover:text-emerald-400">Terms of Service</span>
            </div>
         </div>
      </div>
    </div>
  );
};
