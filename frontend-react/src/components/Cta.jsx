export default function CTA() {
    return (
      <section className="py-20 px-4 ">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 rounded-[32px] py-16 px-8 sm:px-16 text-center shadow-2xl shadow-blue-500/20">
            
            <h2 className="text-3xl sm:text-4xl font-[800] text-white mb-10">
              Ready to Simplify Your Hiring Process?
            </h2>
  
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-3 bg-white text-blue-600  rounded-xl hover:bg-blue-50 transition-colors duration-300 shadow-lg">
                Start Free Trial
              </button>
              
              <button className="w-full sm:w-auto px-8 py-3 bg-white/10 text-white  rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                Contact Sales
              </button>
            </div>
  
            {/* Optional: subtle background decorative circles to match the depth of the image */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />
            
          </div>
        </div>
      </section>
    );
  }