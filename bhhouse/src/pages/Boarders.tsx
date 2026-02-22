import { useState } from 'react';
import { useData, Boarder } from '@/context/DataContext';
import { Plus, Trash2, Key, UserCheck, Edit2 } from 'lucide-react';

export function Boarders() {
  const { boarders, rooms, addBoarder, deleteBoarder, getRoomNumber, createTenantAccount, getTenantAccount, updateUserPassword, updateUserUsername } = useData();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newBoarder, setNewBoarder] = useState<Omit<Boarder, 'id'>>({
    name: '',
    contact: '',
    roomId: '',
    moveInDate: '',
    status: 'Active',
  });

  // State for creating account
  const [creatingAccountFor, setCreatingAccountFor] = useState<string | null>(null);
  const [accountForm, setAccountForm] = useState({ username: '', password: '' });

  // State for editing account
  const [editingAccountFor, setEditingAccountFor] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ username: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBoarder(newBoarder);
    setIsAdding(false);
    setNewBoarder({ name: '', contact: '', roomId: '', moveInDate: '', status: 'Active' });
  };

  const handleCreateAccount = (e: React.FormEvent) => {
      e.preventDefault();
      if (!creatingAccountFor) return;
      createTenantAccount(creatingAccountFor, accountForm.username, accountForm.password);
      setCreatingAccountFor(null);
      setAccountForm({ username: '', password: '' });
      alert("Account created successfully!");
  };

  const handleEditAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccountFor) return;
    
    const currentAccount = getTenantAccount(editingAccountFor);
    if (!currentAccount) return;

    // If username changed, update it
    if (editForm.username !== currentAccount.username) {
      updateUserUsername(currentAccount.username, editForm.username);
    }

    // If password changed, update it
    if (editForm.password !== currentAccount.password) {
      updateUserPassword(editForm.username || currentAccount.username, editForm.password);
    }

    setEditingAccountFor(null);
    setEditForm({ username: '', password: '' });
    alert("Account updated successfully!");
  };

  const openEditModal = (boarderId: string) => {
    const account = getTenantAccount(boarderId);
    if (account) {
      setEditingAccountFor(boarderId);
      setEditForm({ username: account.username, password: account.password });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Boarders</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Boarder
        </button>
      </div>

      {/* Add Boarder Form */}
      {isAdding && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium">Add New Boarder</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <input
              type="text"
              placeholder="Name"
              className="rounded-md border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              value={newBoarder.name}
              onChange={(e) => setNewBoarder({ ...newBoarder, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Contact Number"
              className="rounded-md border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              value={newBoarder.contact}
              onChange={(e) => setNewBoarder({ ...newBoarder, contact: e.target.value })}
              required
            />
             <select
              className="rounded-md border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              value={newBoarder.roomId}
              onChange={(e) => setNewBoarder({ ...newBoarder, roomId: e.target.value })}
              required
            >
              <option value="">Select Room (Available Only)</option>
              {rooms.filter(room => room.status === 'Available').map((room) => {
                const occupants = boarders.filter(b => b.roomId === room.id).length;
                const availableSpots = room.capacity - occupants;
                return (
                  <option key={room.id} value={room.id}>
                    Room {room.number} - ₱{room.price} ({availableSpots}/{room.capacity} available)
                  </option>
                );
              })}
            </select>
            <input
              type="date"
              className="rounded-md border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              value={newBoarder.moveInDate}
              onChange={(e) => setNewBoarder({ ...newBoarder, moveInDate: e.target.value })}
              required
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
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Account Modal/Form Overlay */}
      {creatingAccountFor && (
          <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
                  <h3 className="text-lg font-medium mb-4">Create Account for {boarders.find(b => b.id === creatingAccountFor)?.name}</h3>
                  <form onSubmit={handleCreateAccount} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Username"
                        className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                        value={accountForm.username}
                        onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
                        required
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                        value={accountForm.password}
                        onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                        required
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => { setCreatingAccountFor(null); setAccountForm({username:'', password:''}); }}
                            className="rounded-md bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                        >
                            Create
                        </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Edit Account Modal */}
      {editingAccountFor && (
          <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
                  <h3 className="text-lg font-medium mb-4">Edit Account for {boarders.find(b => b.id === editingAccountFor)?.name}</h3>
                  <form onSubmit={handleEditAccount} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Username"
                        className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Password"
                        className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        required
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => { setEditingAccountFor(null); setEditForm({username:'', password:''}); }}
                            className="rounded-md bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                        >
                            Update
                        </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Room
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Move In Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {boarders.map((boarder) => {
              const hasAccount = !!getTenantAccount(boarder.id);
              return (
                <tr key={boarder.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                    {boarder.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    {boarder.contact}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    Room {getRoomNumber(boarder.roomId)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    {boarder.moveInDate}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        boarder.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {boarder.status}
                    </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                            {hasAccount ? (
                                <>
                                  <button
                                    onClick={() => openEditModal(boarder.id)}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="Edit Account"
                                  >
                                    <Edit2 className="h-5 w-5" />
                                  </button>
                                  <span title="Account Active" className="text-green-600">
                                    <UserCheck className="h-5 w-5" />
                                  </span>
                                </>
                            ) : (
                                <button
                                    onClick={() => setCreatingAccountFor(boarder.id)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                    title="Create Account"
                                >
                                    <Key className="h-5 w-5" />
                                </button>
                            )}
                            <button
                                onClick={() => deleteBoarder(boarder.id)}
                                className="text-red-600 hover:text-red-900"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
