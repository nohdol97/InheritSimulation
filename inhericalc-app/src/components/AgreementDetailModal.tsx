import React from 'react';

interface AgreementDetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export default function AgreementDetailModal({ open, onClose, title, content }: AgreementDetailModalProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto p-4 text-sm text-gray-700 flex-1">
          <pre className="whitespace-pre-wrap font-sans leading-relaxed">{content}</pre>
        </div>
        <div className="p-4 border-t">
          <button 
            onClick={onClose} 
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
} 