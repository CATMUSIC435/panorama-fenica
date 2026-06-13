import React from 'react';

export const NewsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <article key={i} className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col p-0 animate-pulse border-white/20">
        <div className="h-48 bg-white/30" />
        <div className="p-6 flex flex-col flex-1 gap-4">
          <div className="h-3 w-24 bg-white/40 rounded-full" />
          <div className="space-y-2 mt-2">
            <div className="h-5 w-full bg-white/40 rounded-full" />
            <div className="h-5 w-4/5 bg-white/40 rounded-full" />
          </div>
          <div className="mt-auto h-3 w-32 bg-white/40 rounded-full" />
        </div>
      </article>
    ))}
  </div>
);
