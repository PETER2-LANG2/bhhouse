import { useState } from 'react';
import { useData, Report } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Plus, CheckCircle, Clock, Upload, Download } from 'lucide-react';

export function Reports() {
  const { reports, addReport, updateReportStatus, updateReportWithFile, getBoarderName } = useData();
  const { user } = useAuth();
  
  const [isAdding, setIsAdding] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<{ reportId: string; file: File } | null>(null);
  const [newReport, setNewReport] = useState<Omit<Report, 'id' | 'status' | 'date'>>({
    boarderId: user?.boarderId || '',
    type: 'Maintenance',
    description: '',
  });

  const isAdmin = user?.role === 'ADMIN';

  // Filter reports: Admin sees all, Tenant sees own
  const visibleReports = isAdmin 
    ? reports 
    : reports.filter(r => r.boarderId === user?.boarderId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.boarderId) return;
    addReport({ ...newReport, boarderId: user.boarderId });
    setIsAdding(false);
    setNewReport({ boarderId: user.boarderId, type: 'Maintenance', description: '' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fileToUpload) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target?.result as string;
      updateReportWithFile(fileToUpload.reportId, fileData, file.name);
      setFileToUpload(null);
      alert('File uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const downloadFile = (report: Report) => {
    if (!report.fileProof || !report.fileName) return;
    const link = document.createElement('a');
    link.href = report.fileProof;
    link.download = report.fileName;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
            {isAdmin ? 'All Reports' : 'My Reports'}
        </h1>
        {!isAdmin && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            New Report
          </button>
        )}
      </div>

      {isAdding && !isAdmin && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium">Submit New Report</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">Type</label>
                <select
                    className="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    value={newReport.type}
                    onChange={(e) => setNewReport({ ...newReport, type: e.target.value as any })}
                >
                <option value="Maintenance">Maintenance</option>
                <option value="Complaint">Complaint</option>
                <option value="Request">Request</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    rows={4}
                    value={newReport.description}
                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                    required
                />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-md bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {fileToUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-medium">Upload File for Report</h3>
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-500"
            />
            <button
              onClick={() => setFileToUpload(null)}
              className="mt-4 rounded-md bg-slate-200 px-4 py-2 text-sm hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <ul className="divide-y divide-slate-200">
          {visibleReports.length === 0 && (
              <li className="px-6 py-4 text-center text-sm text-slate-500">No reports found.</li>
          )}
          {visibleReports.slice().reverse().map((report) => (
            <li key={report.id} className="px-6 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        report.type === 'Maintenance' ? 'bg-orange-100 text-orange-800' :
                        report.type === 'Complaint' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {report.type}
                      </span>
                      <span className="text-xs text-slate-500">{report.date}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {report.status === 'Resolved' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                      <span className={`ml-2 text-sm font-medium ${
                          report.status === 'Resolved' ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                          {report.status}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-900">{report.description}</p>
                {isAdmin && (
                    <p className="text-xs text-indigo-600">From: {getBoarderName(report.boarderId)}</p>
                )}
                <div className="flex items-center space-x-2 pt-2">
                  {report.fileName ? (
                    <button
                      onClick={() => downloadFile(report)}
                      className="inline-flex items-center rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-700 hover:bg-green-200"
                    >
                      <Download className="mr-1 h-4 w-4" />
                      {report.fileName}
                    </button>
                  ) : !isAdmin && report.status === 'Open' ? (
                    <button
                      onClick={() => setFileToUpload({ reportId: report.id, file: new File([], '') })}
                      className="inline-flex items-center rounded-md bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
                    >
                      <Upload className="mr-1 h-4 w-4" />
                      Add File
                    </button>
                  ) : null}
                  {isAdmin && report.status === 'Open' && (
                      <button
                        onClick={() => updateReportStatus(report.id, 'Resolved')}
                        className="ml-auto text-sm text-indigo-600 hover:text-indigo-900"
                      >
                          Mark Resolved
                      </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
