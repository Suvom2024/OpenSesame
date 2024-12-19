'use client'

import { Filter, X, Info, Globe, Clock, Copy, MonitorPlay, Subtitles, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface CourseResult {
  course: {
    id: string;
    name: string;
    publisher: string;
    courseId: string;
    description: string;
    seatTime: string;
    textLanguages: string;
    audio: string;
    subtitle: string;
    isPublic: boolean;
    isRecommended: boolean;
    subjects: string[];
    topLevelSubject: string;
    leadershipCategory: string;
    createdDate: string;
    modifiedDate: string;
    additionalDescription: string;
  };
  score: number;
  reasoning?: string;
}

interface CourseSearchResponse {
  results: CourseResult[];
  status: string;
  error?: string;
  code: number;
}

export default function Home() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [selectedResult, setSelectedResult] = useState<CourseResult | null>(null)
  const [searchResults, setSearchResults] = useState<CourseResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setShowResults(false);
    
    try {
      const response = await fetch('/course_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          num_courses: 10,
          languages: selectedLanguages,
          require_reasoning: false
        })
      });

      if (!response.ok) {
        throw new Error('Search failed. Please try again.');
      }
      
      const data: CourseSearchResponse = await response.json();
      
      if (data.status === 'success') {
        setSearchResults(data.results);
        setShowResults(true);
      } else {
        throw new Error(data.error || 'Failed to get search results');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev => {
      if (prev.includes(language)) {
        return prev.filter(l => l !== language);
      } else {
        return [...prev, language];
      }
    });
  };

  const ScoreMeter = ({ score }: { score: number }) => {
    const getColor = (score: number) => {
      if (score >= 8) return 'text-blue-600 bg-blue-50'
      if (score >= 5) return 'text-yellow-600 bg-yellow-50'
      return 'text-red-600 bg-red-50'
    }
  
    const colorClass = getColor(score)
    const percentage = (score / 10) * 100
  
    return (
      <div className="relative flex items-center">
        <svg className="w-8 h-8" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            className={colorClass}
          />
          <text x="18" y="22" textAnchor="middle" className="text-sm font-medium">
            {score}
          </text>
        </svg>
      </div>
    )
  }
  
  const ResultCard = ({ result, onClick }: { result: CourseResult; onClick: () => void }) => (
    <div 
      onClick={onClick}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="p-4 sm:p-6">
        {result.course.isRecommended && (
          <div className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-full mb-4">
            Recommended
          </div>
        )}

        <div className="border-t border-gray-100 mb-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-4 border-b border-gray-100">
          <div className="space-y-1">
            <div className="text-xs text-gray-400 font-medium">DOCUMENT NAME</div>
            <div className="text-gray-900 font-semibold">{result.course.name}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-400 font-medium">PUBLISHER</div>
            <div className="text-gray-600">{result.course.publisher}</div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div className="space-y-1 mb-2 sm:mb-0">
              <div className="text-xs text-gray-400 font-medium">COURSE ID</div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-mono">{result.course.courseId}</span>
                <Copy className="w-4 h-4 text-gray-400 cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ScoreMeter score={result.score} />
              <div className="text-xs text-gray-400 font-medium ml-1">SCORE</div>
              {result.reasoning && (
                <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                {result.reasoning && (
                  <div className="absolute z-50 invisible group-hover:visible bg-gray-900/95 text-white text-sm px-4 py-2.5 rounded-lg shadow-xl -translate-x-1/2 left-1/2 mt-2 min-w-[200px] max-w-[300px]">
                    {result.reasoning}
                  </div>
                )}
              </div>
              )}
            </div>
          </div>
        </div>

        <div className="py-4 border-b border-gray-100">
          <div className="text-xs text-gray-400 font-medium mb-1">DESCRIPTION</div>
          <p className="text-gray-600 line-clamp-2">{result.course.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
          <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg flex-shrink-0">
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-400 font-medium">SEAT TIME</div>
              <div className="text-sm text-gray-600 truncate">{result.course.seatTime}</div>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg flex-shrink-0">
              <Globe className="w-4 h-4 text-gray-500" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-400 font-medium">TEXT LANGUAGES</div>
              <div className="text-sm text-gray-600 truncate">{result.course.textLanguages}</div>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg flex-shrink-0">
              <MonitorPlay className="w-4 h-4 text-gray-500" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-400 font-medium">AUDIO</div>
              <div className="text-sm text-gray-600 truncate">{result.course.audio}</div>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg flex-shrink-0">
              <Subtitles className="w-4 h-4 text-gray-500" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-400 font-medium">SUBTITLE</div>
              <div className="text-sm text-gray-600 truncate">{result.course.subtitle}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-400 mb-2 sm:mb-0">
            <span>Created Date: {result.course.createdDate}</span>
            <span>Modified Date: {result.course.modifiedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            {result.course.isPublic && (
              <>
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Public URL</span>
              </>
            )}
            <button className="ml-4 px-4 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              Know more
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const DetailView = ({ result, onClose }: { result: CourseResult; onClose: () => void }) => (
    <div className="h-full overflow-hidden bg-white shadow-lg border-l border-gray-100 rounded-l-3xl">
      <div 
        className="h-full overflow-y-auto px-8" 
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="py-8 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-gray-500 uppercase">DOCUMENT NAME</div>
              <div className="text-lg font-medium mt-1">{result.course.name}</div>
            </div>
            <div className="flex items-center gap-3">
              <ScoreMeter score={result.score} />
              <button 
                onClick={onClose}
                className="hover:bg-gray-50 p-1 rounded-full"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-gray-500 uppercase">PUBLISHER</div>
              <div className="mt-1">{result.course.publisher}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">COURSE ID</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono">{result.course.courseId}</span>
                <Copy className="w-4 h-4 text-gray-400 cursor-pointer" />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase">DESCRIPTION</div>
            <p className="mt-2 text-gray-700">{result.course.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Clock, label: 'SEAT TIME', value: result.course.seatTime },
              { icon: Globe, label: 'TEXT LANGUAGES', value: result.course.textLanguages },
              { icon: MonitorPlay, label: 'AUDIO', value: result.course.audio },
              { icon: Subtitles, label: 'SUBTITLE', value: result.course.subtitle }
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg">
                  <Icon className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">{label}</div>
                  <div className="text-sm mt-0.5">{value}</div>
                </div>
              </div>
            ))}
          </div>

          {result.course.subjects && (
            <div>
              <div className="text-xs text-gray-500 uppercase mb-3">SUBJECTS</div>
              <div className="flex flex-wrap gap-2">
                {result.course.subjects.map((subject: string) => (
                  <span 
                    key={subject} 
                    className="px-3 py-1 bg-orange-50 text-orange-500 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

{(result.course.topLevelSubject || result.course.leadershipCategory) && (
            <div>
              <div className="text-xs text-gray-500 uppercase mb-3">TOP-LEVEL SUBJECT</div>
              <div className="flex flex-wrap gap-2">
                {result.course.topLevelSubject && (
                  <span className="px-3 py-1 bg-orange-50 text-orange-500 rounded-full text-sm">
                    {result.course.topLevelSubject}
                  </span>
                )}
                {result.course.leadershipCategory && (
                  <span className="px-3 py-1 bg-orange-50 text-orange-500 rounded-full text-sm">
                    {result.course.leadershipCategory}
                  </span>
                )}
              </div>
            </div>
          )}

          {result.course.additionalDescription && (
            <div>
              <div className="text-xs text-gray-500 uppercase mb-2">ADDITIONAL DESCRIPTION</div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {result.course.additionalDescription}
              </p>
            </div>
          )}

          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>Created: {result.course.createdDate}</span>
              <span>Modified: {result.course.modifiedDate}</span>
            </div>

            {result.course.isPublic && (
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Public URL</span>
              </div>
            )}

            <button className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
              Know more
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-white">
      <div className={`w-full bg-white transition-all duration-300 
        ${selectedResult ? 'pr-[600px]' : ''}`}>
        <div className="max-w-4xl mx-auto px-6">
          {!showResults && (
            <>
              <h1 className="text-3xl font-semibold text-center mb-3 pt-48">
                Enter a query to retrieve relevant courses
              </h1>
              <p className="text-center mb-12 text-3xl font-semibold">
                and their relevance scores
              </p>
            </>
          )}

          <div className="flex gap-3 py-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center justify-center h-11 w-11 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 relative"
              >
                <Filter className="h-5 w-5" />
                {selectedLanguages.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-orange-500 text-white text-xs rounded-full">
                    {selectedLanguages.length}
                  </span>
                )}
              </button>

              {isFilterOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-3 z-50">
                  <div className="px-4 pb-2 text-sm font-medium text-gray-500 uppercase">
                    SELECT AUDIO LANGUAGE
                  </div>
                  <div className="space-y-1">
                    {['American English', 'Spanish'].map((language) => (
                      <button
                        key={language}
                        onClick={() => handleLanguageToggle(language)}
                        className="w-full flex items-center px-4 py-2 hover:bg-gray-50"
                      >
                        <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center
                          ${selectedLanguages.includes(language) 
                            ? 'border-orange-500 bg-orange-500' 
                            : 'border-gray-300'}`}
                        >
                          {selectedLanguages.includes(language) && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{language}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 flex gap-3">
              <input
                type="text"
                placeholder="Write your query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-11 px-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.trim()}
                className={`px-6 h-11 rounded-xl font-medium flex items-center gap-2 transition-colors
                  ${isLoading 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-orange-500 text-white hover:bg-orange-600'}`}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-xl">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className={`transition-all duration-300 ${selectedResult ? 'pr-[600px]' : ''}`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          {showResults && searchResults.map((result) => (
            <ResultCard 
              key={result.course.id} 
              result={result} 
              onClick={() => setSelectedResult(result)}
            />
          ))}

          {showResults && searchResults.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-500">
              No courses found matching your query.
            </div>
          )}
        </div>
      </div>

      {selectedResult && (
        <div className="fixed top-0 right-0 w-[600px] h-screen p-4">
          <DetailView 
            result={selectedResult} 
            onClose={() => setSelectedResult(null)}
          />
        </div>
      )}
    </main>
  )
}