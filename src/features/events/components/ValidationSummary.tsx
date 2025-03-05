import React from 'react';
import type { FieldErrors } from 'react-hook-form';

type ValidationSummaryProps = {
  errors: FieldErrors;
};

export function ValidationSummary({ errors }: ValidationSummaryProps) {
  const formatErrorPath = (path: string): string => {
    return path.split('.').map((part, index, array) => {
      if (/^\d+$/.test(part) && index > 0 && index < array.length - 1) {
        const num = parseInt(part) + 1;
        const prefix = array[index - 1] || '';
        const singular = prefix.endsWith('s') ? prefix.slice(0, -1) : prefix;
        return `${singular.charAt(0).toUpperCase()}${singular.slice(1)} ${num}`;
      }
      return index > array.findIndex(p => /^\d+$/.test(p)) ? part : '';
    }).filter(Boolean).join(' ').trim();
  };

  const collectErrors = (obj: Record<string, unknown>, path = ''): {path: string, message: string}[] => {
    return Object.entries(obj).flatMap(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      
      // Handle special case for quota errors, which might have a different structure
      if (key === 'quotas' && typeof value === 'object' && value !== null) {
        if ('message' in value && value.message) {
          return [{ path: 'Quotas', message: String(value.message) }];
        }
        
        // If it's an array error
        if (Array.isArray(value) || (typeof value === 'object' && Object.keys(value).some(k => /^\d+$/.test(k)))) {
          return collectErrors(value as Record<string, unknown>, currentPath);
        }
      }
      
      if (key === 'eventId' && currentPath.includes('quota')) return [];
      
      if (value && typeof value === 'object' && 'message' in value && value.message) {
        const formattedPath = formatErrorPath(currentPath);
        return formattedPath ? [{ path: formattedPath, message: String(value.message) }] : [];
      }
      
      if (value && typeof value === 'object') {
        return collectErrors(value as Record<string, unknown>, currentPath);
      }
      
      return [];
    });
  };
  
  const allErrors = collectErrors(errors as Record<string, unknown>)
    .filter(error => error.path.trim() !== '');
  
  if (allErrors.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 rounded-lg bg-red-50 p-4 shadow-lg">
      <div className="flex flex-col">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 w-full">
          <h3 className="text-sm font-medium text-red-800">Please correct the following errors:</h3>
          <div className="mt-2 max-h-60 overflow-y-auto text-sm text-red-700">
            <ul className="list-disc space-y-1 pl-5">
              {allErrors.map((error, index) => (
                <li key={index} className="break-words">
                  <span className="font-medium">{error.path}:</span> {error.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
