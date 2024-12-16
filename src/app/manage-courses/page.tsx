'use client'

import Image from "next/image"
import { Paperclip, ChevronDown, Check } from "lucide-react"
import { useState } from "react"
import Link from 'next/link'

export default function ManageCourses() {
  const [file, setFile] = useState<File | null>(null)
  const [selectedAction, setSelectedAction] = useState<string>("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isConfirmChecked, setIsConfirmChecked] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [itemCount] = useState(45) // Mock count for demo

  const actions = [
    "Add new data",
    "Update existing data",
    "Delete data"
  ]

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
  }

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
  }

  const getSuccessMessage = (action: string) => {
    switch (action) {
      case "Add new data":
        return "New Data Added";
      case "Update existing data":
        return "Existing Data Updated";
      case "Delete data":
        return `${itemCount} Items Deleted Successfully`;
      default:
        return "";
    }
  }

  const getConfirmationMessage = (action: string) => {
    switch (action) {
      case "Add new data":
        return `Are you sure you want to add "${itemCount} new items" ?`;
      case "Update existing data":
        return `Are you sure you want to update "${itemCount} items" ?`;
      case "Delete data":
        return `Are you sure you want to delete "${itemCount} items will be deleted" ?`;
      default:
        return "";
    }
  }

  const getConfirmButtonText = (action: string) => {
    switch (action) {
      case "Add new data":
        return "Save, Proceed";
      case "Update existing data":
        return "Update, Proceed";
      case "Delete data":
        return "Delete, Confirm";
      default:
        return "";
    }
  }

  const handleActionSelect = (action: string) => {
    setSelectedAction(action)
    setIsDropdownOpen(false)
    setFile(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleSubmit = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirm = () => {
    if (isConfirmChecked) {
      setShowConfirmDialog(false)
      setShowSuccess(true)
      setTimeout(() => {
        resetForm()
      }, 3000)
    }
  }

  const resetForm = () => {
    setFile(null)
    setSelectedAction("")
    setIsConfirmChecked(false)
    setShowSuccess(false)
    setIsDropdownOpen(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-16">
      {showSuccess ? (
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
      ) : (
        <>
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
        </>
      )}

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
                {getConfirmButtonText(selectedAction)}
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}