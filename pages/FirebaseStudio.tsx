
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProgressHistory } from '../services/storageService';
import { ProgressEntry } from '../types';

const FirebaseStudio = () => {
  const { user } = useAuth();
  const [progressHistory, setProgressHistory] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        setLoading(true);
        const history = await getProgressHistory(user.uid);
        setProgressHistory(history);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Firebase Studio</h1>
        <p className="text-slate-500 dark:text-slate-400">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Firebase Studio</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Viewing data for user: <span className="font-mono text-indigo-600 dark:text-indigo-400">{user?.uid}</span>
      </p>

      {progressHistory.length === 0 ? (
        <p>No progress history found for this user.</p>
      ) : (
        <div className="space-y-8">
          {progressHistory.map((entry) => (
            <div key={entry.entry_id} className="bg-white dark:bg-slate-900 shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Assessment from {new Date(entry.timestamp).toLocaleString()}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">User Input</h3>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-xs overflow-auto">
                    {JSON.stringify(entry.progress_payload.inputs, null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Prediction Result</h3>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-xs overflow-auto">
                    {JSON.stringify(entry.progress_payload.result, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FirebaseStudio;
