'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { OverallProgress } from '@/components/vocabulary/OverallProgress';
import { TopicCard } from '@/components/vocabulary/TopicCard';
import { Roadmap } from '@/services/types/roadmap';
import { TopicData } from '@/services/types/topic';
import { useRoadmaps } from '@/hooks/useRoadmaps';
import { useTopics } from '@/hooks/useTopics';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { Icon } from '@iconify/react';
import { useAuth } from '@clerk/nextjs';
import { Spinner } from '@heroui/react';

interface RoadmapSectionProps {
  roadmap: Roadmap;
  topics: TopicData[];
  isLoading?: boolean;
}

function RoadmapSection({ roadmap, topics, isLoading }: RoadmapSectionProps) {
  return (
    <div className="mb-8">
      {/* Roadmap Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Icon
            icon="material-symbols:folder"
            className="text-blue-500"
          />
          {roadmap.name}
        </h2>
        {roadmap.description && (
          <p className="text-gray-600 mt-2">
            {roadmap.description}
          </p>
        )}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
            >
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : topics?.length > 0 ? (
          topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Icon
              icon="material-symbols:quiz-outline"
              className="text-gray-300 text-6xl mb-4 mx-auto"
            />
            <p className="text-gray-500">
              No topics available in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LearnVocabularyPage() {
  const { roadmaps, isLoading, error, refetch } = useRoadmaps();
  const { getTopicsByRoadmap, error: topicsError } = useTopics();
  const [loadingTopics, setLoadingTopics] = useState<Record<string, boolean>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Clerk authentication hooks
  const { isLoaded, isSignedIn, getToken } = useAuth();

  // Get all topics from Redux outside of the render loop
  const allTopicsByRoadmap = useSelector((state: RootState) => state.topic.topicsByRoadmap);
  
  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Check authentication status - wait for Clerk to load
  useEffect(() => {
    if (isClient && isLoaded) {
      if (!isSignedIn) {
        setAuthError("Please log in to access vocabulary learning features");
        setIsDataLoaded(false); // Reset data loading flag when user is not signed in
      } else {
        setAuthError(null);
        // Don't reset isDataLoaded here, let the main effect handle it
      }
    }
  }, [isClient, isLoaded, isSignedIn]);
  
  // Reset data loading flag when roadmaps change (e.g., on refetch)
  useEffect(() => {
    if (roadmaps.length > 0 && !isDataLoaded) {
      // Don't automatically set isDataLoaded = false here
      // Let it be controlled by the main loading effect
    }
  }, [roadmaps.length, isDataLoaded]);

  // Memoize roadmap IDs to avoid unnecessary re-computation
  const roadmapIds = useMemo(() => roadmaps.map(r => r.id), [roadmaps]);

  // Load topics for all roadmaps và vocabularies
  useEffect(() => {
    const loadAllData = async () => {
      // Only proceed if:
      // 1. We have roadmaps (no error from useRoadmaps)
      // 2. Clerk is loaded and user is signed in
      // 3. Data hasn't been loaded yet
      if (roadmaps.length > 0 && !error && isClient && isLoaded && isSignedIn && !isDataLoaded) {
        
        console.log('Starting data load...');
        setIsDataLoaded(true); // Prevent multiple calls
        
        // Set loading state for topics
        const newLoadingState: Record<string, boolean> = {};
        roadmaps.forEach((roadmap) => {
          newLoadingState[roadmap.id] = true;
        });
        setLoadingTopics(newLoadingState);

        try {
          // Fetch topics for all roadmaps first
          console.log('Fetching topics for roadmaps...');
          const topicsPromises = roadmaps.map(async (roadmap) => {
            await getTopicsByRoadmap(roadmap.id);
            return roadmap.id;
          });

          await Promise.all(topicsPromises);
          console.log('Topics loaded');
          
          console.log('Data loading completed successfully');
          
        } catch (error) {
          setIsDataLoaded(false); // Reset flag on error to allow retry
          
          if (error && typeof error === 'object') {
            const errorDetails = {
              message: (error as any).message,
              status: (error as any).response?.status,
              statusText: (error as any).response?.statusText,
              data: (error as any).response?.data
            };
            console.error('Error details:', errorDetails);
            
            if ((error as any).response?.status === 403) {
              setAuthError("Authentication failed. Please log in again.");
            }
          }
        } finally {
          console.log('🏁 Data loading finished, clearing loading states');
          // Clear loading states
          const newLoadingState: Record<string, boolean> = {};
          roadmaps.forEach((roadmap) => {
            newLoadingState[roadmap.id] = false;
          });
          setLoadingTopics(newLoadingState);
        }
      } else {
        console.log('⏸️ Not loading data yet - waiting for:', {
          roadmapsLoaded: roadmaps.length > 0,
          noRoadmapsError: !error,
          isClient,
          clerkIsLoaded: isLoaded,
          userIsSignedIn: isSignedIn,
          isDataLoaded
        });
      }
    };

    loadAllData();
  }, [roadmaps.length, error, isClient, isLoaded, isSignedIn, isDataLoaded]); // Added error to dependencies

  // Custom refetch function that resets data loading state
  const handleRefetch = useCallback(() => {
    setIsDataLoaded(false); // Reset the flag to allow data reload
    refetch(); // Call the original refetch from useRoadmaps
  }, [refetch]);

  // Reset data loaded flag when there's an error to allow retry
  useEffect(() => {
    if (error) {
      setIsDataLoaded(false);
    }
  }, [error]);


  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner variant="wave" color="primary" size="lg" label="Loading..." labelColor="primary"/>
          <p className="text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to load courses
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefetch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show authentication error if user is not logged in
  // if (authError) {
  //   return (
  //     <div className="flex h-screen w-full items-center justify-center bg-gray-50">
  //       <div className="text-center max-w-md">
  //         <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
  //           <svg
  //             className="w-8 h-8 text-yellow-500"
  //             fill="none"
  //             stroke="currentColor"
  //             viewBox="0 0 24 24"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth={2}
  //               d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
  //             />
  //           </svg>
  //         </div>
  //         <h2 className="text-xl font-semibold text-gray-800 mb-2">
  //           Authentication Required
  //         </h2>
  //         <p className="text-gray-600 mb-6">{authError}</p>
  //         <Link
  //           href="/sign-in"
  //           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
  //         >
  //           Go to Login
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header Section - Enhanced but Simple */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 border-b border-gray-200">
        <div className="w-full px-6 py-12">
          <div className="text-center">
            {/* Icon and Title */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Icon icon="material-symbols:school" className="text-white text-2xl" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                English Vocabulary Learning
              </h1>
            </div>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Build your English vocabulary systematically with our structured learning courses
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Icon icon="material-symbols:folder" className="text-blue-500" />
                <span className="font-medium">{roadmaps.length} courses available</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Icon icon="material-symbols:quiz" className="text-purple-500" />
                <span className="font-medium">Interactive Learning</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Icon icon="material-symbols:trending-up" className="text-green-500" />
                <span className="font-medium">Track Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress Section - Compact and Elegant */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="w-full px-6 py-6">
          <OverallProgress />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 pb-8">
        <div className="space-y-6">
          <div className="mb-6 text-center mt-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your Courses
            </h2>
            <p className="text-gray-600">
              Select a category to view available topics and start learning.
            </p>
          </div>

          {/* Roadmaps and Topics */}
          <div className="space-y-8">
            {roadmaps.map((roadmap) => {
              // Get topics for this roadmap from the pre-fetched data
              const roadmapTopics = allTopicsByRoadmap[roadmap.id] || [];

              return (
                <RoadmapSection 
                  key={roadmap.id} 
                  roadmap={roadmap} 
                  topics={roadmapTopics}
                  isLoading={loadingTopics[roadmap.id]}
                />
              );
            })}
          </div>

          {/* Empty State */}
          {roadmaps.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No courses available yet
              </h3>
              <p className="text-gray-500">
                Check back later for new vocabulary courses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
