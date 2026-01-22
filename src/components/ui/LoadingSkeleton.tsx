import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'circle' | 'list';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ variant = 'card', count = 1, className = '' }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count });

  if (variant === 'card') {
    return (
      <>
        {skeletons.map((_, i) => (
          <div key={i} className={`animate-pulse bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'text') {
    return (
      <>
        {skeletons.map((_, i) => (
          <div key={i} className={`animate-pulse h-4 bg-gray-200 rounded mb-2 ${className}`}></div>
        ))}
      </>
    );
  }

  if (variant === 'circle') {
    return (
      <>
        {skeletons.map((_, i) => (
          <div key={i} className={`animate-pulse rounded-full bg-gray-200 ${className}`}></div>
        ))}
      </>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {skeletons.map((_, i) => (
          <div key={i} className={`animate-pulse flex items-center space-x-3 ${className}`}>
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="flex-1 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

// Specific skeleton components for common use cases
export function DashboardSkeleton() {
  return (
    <div className="p-6">
      <div className="animate-pulse mb-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadingSkeleton variant="card" count={6} />
      </div>
    </div>
  );
}

export function ListDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="animate-pulse mb-8">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="space-y-4">
        <LoadingSkeleton variant="list" count={8} />
      </div>
    </div>
  );
}

export function LibrarySkeleton() {
  return (
    <div className="p-6">
      <div className="animate-pulse mb-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex space-x-2 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadingSkeleton variant="card" count={9} />
      </div>
    </div>
  );
}
