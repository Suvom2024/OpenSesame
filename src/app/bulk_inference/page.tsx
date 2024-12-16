'use client'

import Image from "next/image"
import { Paperclip, Info, Plus, Trash2,Download  } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'

interface TableRow {
  id: number;
  columnName: string;
  customName: string;
  isPrimaryKey: boolean;
}

export default function BulkInference() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showTable, setShowTable] = useState(false)
  const router = useRouter()
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [rows, setRows] = useState<TableRow[]>([
    { id: 1, columnName: 'Custom Name', customName: 'Custom Name', isPrimaryKey: false },
    { id: 2, columnName: 'Custom Name', customName: 'Custom Name', isPrimaryKey: false },
  ])
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsLoading(false);
              setShowTable(true);
            }, 500);
            return 100;
          }
          return prev + 5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleTableSubmit = () => {
    // Simulate processing
    setTimeout(() => {
      setShowSuccess(true);
      // Redirect after 5 seconds
      setTimeout(() => {
        router.push('/bulk-inference'); // or wherever you want to redirect
      }, 5000);
    }, 2000);
  };

  const handleDownload = () => {
    // Implement your download logic here
    console.log('Downloading file...');
  };
  const handleSubmit = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const handleAddRow = () => {
    setRows(prev => [
      ...prev,
      {
        id: prev.length + 1,
        columnName: 'Custom Name',
        customName: 'Custom Name',
        isPrimaryKey: false
      }
    ]);
  };

  const CircularProgress = ({ progress }: { progress: number }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative w-20 h-20">
        <svg className="transform -rotate-90 w-20 h-20">
          <circle
            className="text-gray-200"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
          <circle
            className="text-[#E85C2B]"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-medium">{progress}%</span>
        </div>
      </div>
    );
  };

  const handleDeleteRow = (id: number) => {
    setRows(prev => prev.filter(row => row.id !== id));
  };

  const handlePrimaryKeyChange = (id: number) => {
    setRows(prev => prev.map(row => ({
      ...row,
      isPrimaryKey: row.id === id ? true : false
    })));
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top
    });
    setShowTooltip(true);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
        <Image
          src="/loading.svg"
          alt="Loading"
          width={300}
          height={250}
          priority
        />
        <div className="text-2xl font-medium mb-3">
          Processing - Data uploading
        </div>
        <div className="text-gray-600 mb-8">
          After processing, the file will be downloaded automatically
        </div>
        <CircularProgress progress={progress} />
      </div>
    );
  }
  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <h1 className="text-2xl font-semibold mb-20">Bulk Inference</h1>
        
        <div className="bg-[#F0FDF4] rounded-2xl p-8 max-w-md w-full text-center relative mb-8">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            File Created Successfully
          </h2>
          
          <button
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E85C2B] text-white rounded-lg hover:bg-[#D64E21] transition-colors font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Download File
          </button>
        </div>

        <a
          href="/bulk-inference"
          onClick={(e) => {
            e.preventDefault();
            router.push('/bulk-inference');
          }}
          className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
        >
          Back to Home
        </a>
      </div>
    );
  }
  if (showTable) {
    return (
      <div className="p-8 max-w-5xl mx-auto relative">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold mb-8">Bulk Inference</h1>
          
          <div className="inline-flex items-center justify-center gap-3 bg-white rounded-full border border-gray-200 shadow-sm px-6 py-3 hover:border-orange-200 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <Paperclip className="h-5 w-5 text-gray-400 group-hover:text-[#E85C2B] transition-colors" />
              <span className="text-gray-600 text-sm">Select a file (only CSV files)</span>
            </div>
            <div className="h-4 w-px bg-gray-200 mx-2"></div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setIsLoading(true);
                  setProgress(0);
                }}
                className="sr-only"
              />
              <span className="text-sm font-medium text-[#E85C2B] hover:text-[#D64E21] transition-colors">
                Replace
              </span>
            </label>
          </div>
        </div>
        
        <div className="mb-4 flex items-center gap-2">
          <span className="text-base font-medium text-gray-700">Input text template</span>
          <span className="text-sm text-gray-500">(Columns are editable)</span>
        </div>

        <div className="relative">
          {/* Removed overflow-hidden to allow delete button to be visible */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-visible transition-all duration-200 hover:shadow-md">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="w-1/3 px-6 py-4 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Column Name</span>
                      <Info 
                        className="w-4 h-4 text-gray-400 hover:text-[#E85C2B] transition-colors cursor-pointer" 
                      />
                    </div>
                  </th>
                  <th className="w-1/3 px-6 py-4 transition-colors border-l border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Custom Name</span>
                      <Info 
                        className="w-4 h-4 text-gray-400 hover:text-[#E85C2B] transition-colors cursor-pointer"
                      />
                    </div>
                  </th>
                  <th className="w-1/3 px-6 py-4 transition-colors border-l border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Pick Key</span>
                      <Info 
                        className="w-4 h-4 text-gray-400 hover:text-[#E85C2B] transition-colors cursor-pointer"
                        onMouseEnter={(e) => handleInfoClick(e)}
                        onMouseLeave={() => setShowTooltip(false)}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr 
                    key={row.id} 
                    className="group relative hover:bg-gray-50/50 transition-colors cursor-default"
                  >
                    <td className="px-6 py-4 border-b border-gray-100">
                      <input
                        type="text"
                        value={row.columnName}
                        onChange={(e) => {
                          const newRows = [...rows];
                          newRows[index].columnName = e.target.value;
                          setRows(newRows);
                        }}
                        className="w-full text-sm text-gray-800 bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-gray-400"
                        placeholder="Custom Name"
                      />
                    </td>
                    <td className="px-6 py-4 border-b border-l border-gray-100">
                      <input
                        type="text"
                        value={row.customName}
                        onChange={(e) => {
                          const newRows = [...rows];
                          newRows[index].customName = e.target.value;
                          setRows(newRows);
                        }}
                        className="w-full text-sm text-gray-800 bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-gray-400"
                        placeholder="Custom Name"
                      />
                    </td>
                    <td className="px-6 py-4 border-b border-l border-gray-100">
                      <div className="relative group/checkbox">
                        {row.isPrimaryKey ? (
                          <div 
                            className="w-4 h-4 rounded bg-[#E85C2B] flex items-center justify-center cursor-pointer"
                            onClick={() => handlePrimaryKeyChange(row.id)}
                          >
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 hover:border-[#E85C2B] cursor-pointer transition-colors"
                            onClick={() => handlePrimaryKeyChange(row.id)}
                          />
                        )}
                      </div>
                    </td>

                    {/* Delete Icon Positioned Outside the Table Row */}
                    <td className="w-0 p-0 relative">
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-400 hover:text-red-500 z-10"
                        aria-label={`Delete row ${row.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showTooltip && (
            <div 
              className="fixed bg-gray-900/95 text-white text-sm px-4 py-2.5 rounded-lg shadow-xl z-50 backdrop-blur-sm"
              style={{ top: tooltipPosition.y, left: tooltipPosition.x }}
            >
              By selecting a check mark you are marking that specific item as a Unique Key
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleAddRow}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add new Row
            </button>
            <button
              onClick={handleTableSubmit}
              className="px-8 py-2.5 text-sm font-medium text-white bg-[#E85C2B] hover:bg-[#D64E21] rounded-lg transition-colors"
            >
              Submit
            </button>
          </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen -mt-16">
        <div className="mb-8">
          <Image
            src="/bulk_inference.svg"
            alt="Bulk Inference Illustration"
            width={300}
            height={250}
            priority
            className="mx-auto"
          />
        </div>
        
        <h1 className="text-2xl font-medium mb-3">
          Bulk Inference - Upload your Data
        </h1>
        
        <p className="text-gray-600 mb-6">
          Please make sure you are uploading the correct format of document,
          <br />
          <span className="inline-flex gap-1 justify-center">
            we have a sample document here
            <a href="#" className="text-[#E85C2B] hover:underline">
              click to download
            </a>
          </span>
        </p>

        <div className="w-full max-w-xl px-4">
          <div className="relative">
            <div className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center gap-2 flex-1 px-2">
                <Paperclip className="h-5 w-5 text-gray-400" />
                <span className="text-gray-500 text-sm">
                  {file ? file.name : "Select a file (only CSV files)"}
                </span>
              </div>
              <label className="shrink-0">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="sr-only"
                />
                <span className="inline-flex px-4 py-2 text-sm font-medium text-[#E85C2B] bg-[#FFF5F2] rounded-md hover:bg-[#FFF5F2]/80 cursor-pointer">
                  Choose File
                </span>
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file}
            className="w-full mt-4 px-4 py-3 text-sm font-medium text-white bg-[#E85C2B] rounded-lg hover:bg-[#E85C2B]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit
          </button>
        </div>
        
      </div>
    )
}
