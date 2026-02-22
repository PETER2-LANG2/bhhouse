import { useState } from 'react';
import { useData, Room } from '@/context/DataContext';
import { Plus, Trash2 } from 'lucide-react';

export function Rooms() {
  const { rooms, addRoom, deleteRoom } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [newRoom, setNewRoom] = useState<Omit<Room, 'id'>>({
    number: '',
    capacity: 1,
    price: 0,
    status: 'Available',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRoom(newRoom);
    setIsAdding(false);
    setNewRoom({ number: '', capacity: 1, price: 0, status: 'Available' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Rooms</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Room
        </button>
      </div>

      {isAdding && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium">Add New Room</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <input
              type="text"
              placeholder="Room Number"
              className="rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={newRoom.number}
              onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Capacity"
              className="rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={newRoom.capacity}
              onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
              min="1"
              required
            />
            <input
              type="number"
              placeholder="Price"
              className="rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={newRoom.price}
              onChange={(e) => setNewRoom({ ...newRoom, price: Number(e.target.value) })}
              min="0"
              required
            />
             <select
              className="rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={newRoom.status}
              onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value as any })}
            >
              <option value="Available">Available</option>
              <option value="Full">Full</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <div className="flex items-center space-x-2">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-md bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Room Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Capacity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Price
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
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                  {room.number}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {room.capacity}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  ₱{room.price.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      room.status === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : room.status === 'Full'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {room.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => deleteRoom(room.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
