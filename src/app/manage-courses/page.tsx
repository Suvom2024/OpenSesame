'use client'

import Image from "next/image"
import { Paperclip, ChevronDown, Check, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import Link from 'next/link'

interface TaskResponse {
  task_id: string;
  status: string;
  code: number;
  error: string;
}

interface TaskStatus {
  status: string;
  progress: number;
  total: number;
  code: number;
  error: string;
}

export default function ManageCourses() {
  const [file, setFile] = useState<File | null>(null)
  const [selectedAction, setSelectedAction] = useState<string>("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isConfirmChecked, setIsConfirmChecked] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [taskId, setTaskId] = useState<string>("")
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null)

  const actions = [
    "Add new data",
    "Update existing data",
    "Delete data"
  ]

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('File upload failed');
      
      const data = await response.json();
      return data.filePath;
    } catch (error) {
      throw new Error('Failed to upload file');
    }
  };

  const pollTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch(`/task_status/${taskId}`);
      if (!response.ok) throw new Error('Failed to fetch task status');
      
      const data: TaskStatus = await response.json();
      setTaskStatus(data);
      
      if (data.status === 'completed') {
        setShowSuccess(true);
        setIsLoading(false);
      } else if (data.status === 'failed') {
        setErrorMessage(data.error || 'Task failed');
        setIsLoading(false);
      } else {
        // Continue polling if task is still in progress
        setTimeout(() => pollTaskStatus(taskId), 2000);
      }
    } catch (error) {
      setErrorMessage('Failed to check task status');
      setIsLoading(false);
    }
  };

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
    setIsDropdownOpen(false);
    setFile(null);
    setErrorMessage("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrorMessage("");
    }
  };

  const handleSubmit = () => {
    if (!file || !selectedAction) return;
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    if (!isConfirmChecked || !file) return;
    
    setShowConfirmDialog(false);
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // Upload the file first
      const filePath = await uploadFile(file);
      
      // Determine which API endpoint to use
      const endpoint = selectedAction === "Delete data" 
        ? '/remove_courses_using_csv'
        : '/add_update_courses_using_csv';
      
      // Prepare the request body based on the action
      const requestBody = selectedAction === "Delete data"
        ? {
            csv_path: filePath,
            column_name: 'id' // Assuming 'id' is the column containing GUIDs
          }
        : {
            csv_path: filePath
          };
      
      // Make the API call
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Operation failed');
      }
      
      const data: TaskResponse = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.error || 'Operation failed');
      }

      setTaskId(data.task_id);
      pollTaskStatus(data.task_id);
      
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Operation failed');
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSelectedAction("");
    setIsConfirmChecked(false);
    setShowSuccess(false);
    setIsDropdownOpen(false);
    setErrorMessage("");
    setTaskId("");
    setTaskStatus(null);
  };

  const getWarningStyles = (action: string) => {
    switch (action) {
      case "Add new data":
        return "bg-green-50 text-green-800";
      case "Update existing data":
        return "bg-blue-50 text-blue-800";
      case "Delete data":
        return "bg-red-50 text-red-800";
      default:
        return "";
    }
  };

  const getWarningMessage = (action: string) => {
    switch (action) {
      case "Add new data":
        return "You have selected Add new data \"Id's within your csv files will be added in database\"";
      case "Update existing data":
        return "You have selected Update \"Id's within your csv files will be Updated in database\"";
      case "Delete data":
        return "You have selected delete \"Id's within your csv files will be deleted from database\"";
      default:
        return "";
    }
  };

  const getSuccessMessage = (action: string) => {
    const count = taskStatus?.progress || 0;
    switch (action) {
      case "Add new data":
        return `${count} New Items Added Successfully`;
      case "Update existing data":
        return `${count} Items Updated Successfully`;
      case "Delete data":
        return `${count} Items Deleted Successfully`;
      default:
        return "";
    }
  };

  const getConfirmationMessage = (action: string) => {
    switch (action) {
      case "Add new data":
        return "Are you sure you want to add these items?";
      case "Update existing data":
        return "Are you sure you want to update these items?";
      case "Delete data":
        return "Are you sure you want to delete these items?";
      default:
        return "";
    }
  };

  const CircularProgress = ({ progress, total }: { progress: number; total: number }) => {
    const percentage = total > 0 ? (progress / total) * 100 : 0;
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

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
          <span className="text-lg font-medium">{Math.round(percentage)}%</span>
        </div>
      </div>
    );
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
          Processing - {selectedAction}
        </div>
        <div className="text-gray-600 mb-8">
          Please wait while we process your request...
        </div>
        {taskStatus && (
          <>
            <CircularProgress progress={taskStatus.progress} total={taskStatus.total} />
            <div className="mt-4 text-sm text-gray-600">
              Processed: {taskStatus.progress} / {taskStatus.total}
            </div>
          </>
        )}
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="text-center animate-fadeIn">
        <div className="relative">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl p-8 mb-6 max-w-md mx-auto">
          <h2 className="text-2xl font-medium mb-2 text-gray-800">
            {getSuccessMessage(selectedAction)}
          </h2>
          <Link 
            href="/"
            className="mt-4 text-gray-600 hover:text-gray-800 font-medium inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-16">
      <div className="mb-8">
        <Image
          src="/course_search.svg"
          alt="Manage Courses Illustration"
          width={380}
          height={250}
          priority
          className="mx-auto"
        />
      </div>
      
      <h1 className="text-2xl font-medium mb-3">
        Manage Courses
      </h1>
      
      <p className="text-gray-600 mb-6 text-center">
        <span className="inline-block">Update, Add and Delete Courses, manage courses allows you to</span>
        <br />
        <span className="inline-block">manage the data</span>
      </p>

      <div className="w-full max-w-xl px-4 space-y-4">
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 text-red-800 bg-red-50 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        <div className="relative">
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-white text-left cursor-pointer"
          >
            <span className="text-gray-500 text-sm px-2">
              {selectedAction || "Select a action want to perform"}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
          
          {isDropdownOpen && (
            <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {actions.map((action) => (
                <div
                  key={action}
                  onClick={() => handleActionSelect(action)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                >
                  {action}
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedAction && file && (
          <div className={`px-4 py-3 rounded-lg text-sm ${getWarningStyles(selectedAction)}`}>
            {getWarningMessage(selectedAction)}
          </div>
        )}

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
                onChange={handleFileSelect}
                className="sr-only"
              />
              <span className="inline-flex px-4 py-2 text-sm font-medium text-[#E85C2B] bg-[#FFF5F2] rounded-md hover:bg-[#FFE8E2] cursor-pointer">
                Choose File
              </span>
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!file || !selectedAction}
          className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors
            ${file && selectedAction
              ? 'text-white bg-[#E85C2B] hover:bg-[#D64E21]'
              : 'text-gray-400 bg-gray-100'
            }`}
        >
          Submit
        </button>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-medium mb-2">
              {getConfirmationMessage(selectedAction)}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Please confirm the action by enabling
            </p>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="confirm"
                checked={isConfirmChecked}
                onChange={(e) => setIsConfirmChecked(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="confirm" className="text-sm text-gray-600">
                I understand this action cannot be undone
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  isConfirmChecked
                    ? 'text-white bg-[#E85C2B] hover:bg-[#D64E21]'
                    : 'text-gray-400 bg-gray-100'
                }`}
                disabled={!isConfirmChecked}
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setIsConfirmChecked(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}