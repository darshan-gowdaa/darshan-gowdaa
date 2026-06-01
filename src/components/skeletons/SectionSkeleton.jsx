import React from 'react';

const SectionSkeleton = ({ title = true }) => {
  return (
    <section className="w-full min-h-[80vh] py-20 px-4 md:px-8 lg:px-16 flex flex-col items-start justify-start max-w-7xl mx-auto opacity-50 relative overflow-hidden">
      
      {/* Optional Title Skeleton */}
      {title && (
        <div className="w-full mb-12">
          <div className="h-4 w-24 bg-white/5 rounded animate-pulse mb-4" />
          <div className="h-10 w-48 bg-white/10 rounded animate-pulse" />
        </div>
      )}

      {/* Grid Content Skeleton */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full h-[300px] bg-white/5 rounded-2xl animate-pulse flex flex-col p-6 gap-4 border border-white/5">
            <div className="h-8 w-1/3 bg-white/10 rounded" />
            <div className="h-4 w-full bg-white/5 rounded mt-4" />
            <div className="h-4 w-5/6 bg-white/5 rounded" />
            <div className="h-4 w-4/6 bg-white/5 rounded" />
            
            <div className="mt-auto flex gap-2">
              <div className="h-6 w-16 bg-white/10 rounded-full" />
              <div className="h-6 w-16 bg-white/10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Custom Shimmer Overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
    </section>
  );
};

export default SectionSkeleton;
