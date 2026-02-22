import { useState } from 'react';
import { useData, Payment } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Plus, Check, Download } from 'lucide-react';

export function Payments() {
  const { payments, boarders, addPayment, updatePaymentStatus, updatePaymentWithFile, getBoarderName } = useData();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'ADMIN';

  const [isAdding, setIsAdding] = useState(false);
  const [newPayment, setNewPayment] = useState<Omit<Payment, 'id'>>({
    boarderId: user?.boarderId || '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    method: 'Cash',
    description: '',
  });
  
  const filteredPayments = isAdmin
    ? payments
    : payments.filter(p => p.boarderId === user?.boarderId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate payment process
    const status = newPayment.method === 'E-Wallet' ? 'Pending' : 'Pending'; // E-Wallet also pending until proof uploaded
    
    addPayment({ 
        ...newPayment, 
        status,
        description: newPayment.description || `Payment via ${newPayment.method}`
    });
    
    setIsAdding(false);
    // Reset form
    setNewPayment({
      boarderId: user?.boarderId || '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      method: 'Cash',
      description: '',
    });
    
    alert(`${newPayment.method === 'E-Wallet' ? 'E-Wallet' : 'Cash'} payment request submitted. Please provide proof of payment.`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, paymentId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      updatePaymentWithFile(paymentId, base64, file.name);
      alert('Payment proof uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadProof = (fileProof: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileProof;
    link.download = fileName || 'payment-proof';
    link.click();
  };

  const handlePrint = () => {
      window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <h1 className="text-2xl font-bold text-slate-900">
            {isAdmin ? 'All Payments' : 'My Payments'}
        </h1>
        <div className="flex space-x-2">
            <button
                onClick={handlePrint}
                className="inline-flex items-center rounded-md bg-slate-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-700"
            >
                Print Receipt
            </button>
            <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            {isAdmin ? 'Record Payment' : 'Pay Now'}
            </button>
        </div>
      </div>

      {isAdding && (
        <div className="rounded-lg bg-white p-6 shadow no-print">
          <h3 className="mb-4 text-lg font-medium">
              {isAdmin ? 'Record Payment' : 'Make a Payment'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
             {isAdmin ? (
                <select
                    className="rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={newPayment.boarderId}
                    onChange={(e) => setNewPayment({ ...newPayment, boarderId: e.target.value })}
                    required
                >
                    <option value="">Select Boarder</option>
                    {boarders.map((boarder) => (
                        <option key={boarder.id} value={boarder.id}>
                        {boarder.name}
                        </option>
                    ))}
                </select>
             ) : (
                 <div className="text-sm font-medium text-slate-700 py-2">
                     Boarder: {user?.name}
                 </div>
             )}
            
            <input
              type="number"
              placeholder="Amount"
              className="rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
              min="0"
              required
            />
            
            <select
                className="rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={newPayment.method}
                onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value as any })}
            >
                <option value="Cash">Cash</option>
                <option value="E-Wallet">E-Wallet (GCash/Maya)</option>
            </select>

            <input
              type="text"
              placeholder="Description (e.g. Oct Rent)"
              className="rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={newPayment.description}
              onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
            />
            
            <div className="col-span-full flex justify-end space-x-2">
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
                {isAdmin ? 'Save' : 'Pay'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow print:shadow-none">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Boarder
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Amount
              </th>
               <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Method
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Proof
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Status
              </th>
              {isAdmin && (
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 no-print">
                      Actions
                  </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredPayments.slice().reverse().map((payment) => (
              <tr key={payment.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {payment.date}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                  {getBoarderName(payment.boarderId)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  ₱{payment.amount.toLocaleString()}
                </td>
                 <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {payment.method}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {payment.description}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {payment.fileProof ? (
                    <button
                      onClick={() => handleDownloadProof(payment.fileProof!, payment.fileName || 'proof')}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                      title="Download Proof"
                    >
                      <Download className="h-4 w-4" />
                      <span className="text-xs">{payment.fileName?.substring(0, 15) || 'File'}</span>
                    </button>
                  ) : (
                    <>
                      {!isAdmin && (
                        <label className="text-indigo-600 hover:text-indigo-900 cursor-pointer text-sm">
                          Upload
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(e, payment.id)}
                            className="hidden"
                            accept="image/*,.pdf"
                          />
                        </label>
                      )}
                    </>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      payment.status === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                {isAdmin && (
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium no-print">
                        {payment.status === 'Pending' && (
                            <button 
                                onClick={() => updatePaymentStatus(payment.id, 'Paid')}
                                className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-green-700" 
                                title="Confirm Payment"
                            >
                                <Check className="h-4 w-4 mr-1" />
                                Mark as Paid
                            </button>
                        )}
                        {payment.status === 'Paid' && (
                            <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-xs font-medium text-green-800">
                                ✓ Confirmed
                            </span>
                        )}
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
