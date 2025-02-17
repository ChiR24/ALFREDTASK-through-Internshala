import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <motion.div
      className="absolute inset-0 bg-gray-200 dark:bg-gray-700"
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  </div>
);

export const CardSkeleton = () => (
  <div className="w-full max-w-2xl mx-auto">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
      <Skeleton className="h-8 w-3/4 rounded-lg" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="flex justify-between mt-4">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

export const SidebarSkeleton = () => (
  <div className="w-64 h-screen bg-white dark:bg-gray-800 p-4 space-y-4">
    <Skeleton className="h-10 w-3/4 rounded-lg" />
    <div className="space-y-2">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

export const StatisticsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-2">
        <Skeleton className="h-6 w-1/2 rounded-lg" />
        <Skeleton className="h-12 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
      </div>
    ))}
  </div>
);

export default {
  Card: CardSkeleton,
  Sidebar: SidebarSkeleton,
  Statistics: StatisticsSkeleton,
}; 