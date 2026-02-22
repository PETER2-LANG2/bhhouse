import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Users, BedDouble, Banknote, AlertCircle, MessageSquare } from 'lucide-react';

export function Dashboard() {
  const { rooms, boarders, payments, reports, messages } = useData();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'ADMIN';

  if (isAdmin) {
      const totalRooms = rooms.length;
      const availableRooms = rooms.filter(r => r.status === 'Available').length;
      const totalBoarders = boarders.length;
      const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
      const openReports = reports.filter(r => r.status === 'Open').length;

      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3">
                  <BedDouble className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-500">Rooms</p>
                  <p className="text-2xl font-semibold text-slate-900">{availableRooms} / {totalRooms}</p>
                  <p className="text-xs text-slate-500">Available</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md bg-green-500 p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-500">Boarders</p>
                  <p className="text-2xl font-semibold text-slate-900">{totalBoarders}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md bg-yellow-500 p-3">
                  <Banknote className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-500">Revenue</p>
                  <p className="text-2xl font-semibold text-slate-900">₱{totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md bg-red-500 p-3">
                        <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-slate-500">Issues</p>
                        <p className="text-2xl font-semibold text-slate-900">{openReports}</p>
                        <p className="text-xs text-slate-500">Open Reports</p>
                    </div>
                </div>
            </div>
          </div>
          
           <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg bg-white shadow">
                    <div className="border-b border-slate-200 px-6 py-4">
                        <h3 className="text-lg font-medium leading-6 text-slate-900">Recent Activity</h3>
                    </div>
                    <ul className="divide-y divide-slate-200">
                         {payments.slice(-3).reverse().map(p => (
                             <li key={p.id} className="px-6 py-4">
                                 <div className="flex justify-between">
                                     <span className="text-sm text-slate-900">Payment received</span>
                                     <span className="text-sm text-slate-500">{p.date}</span>
                                 </div>
                                 <p className="text-xs text-slate-500">₱{p.amount} via {p.method}</p>
                             </li>
                         ))}
                    </ul>
                </div>
           </div>
        </div>
      );
  } else {
      // Tenant Dashboard
      const myBoarder = boarders.find(b => b.id === user?.boarderId);
      const myRoom = rooms.find(r => r.id === myBoarder?.roomId);
      const myPayments = payments.filter(p => p.boarderId === user?.boarderId);
      const pendingAmount = myPayments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
      const recentMessages = messages.filter(m => m.receiverId === user?.boarderId).slice(-3).reverse();

      return (
          <div className="space-y-6">
              <h1 className="text-2xl font-bold text-slate-900">Welcome, {myBoarder?.name}</h1>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="rounded-lg bg-white p-6 shadow">
                      <div className="flex flex-col">
                          <p className="text-sm font-medium text-slate-500">Current Due</p>
                          <p className={`text-3xl font-bold ${pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              ₱{pendingAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                              {pendingAmount > 0 ? 'Please settle your balance.' : 'You are up to date!'}
                          </p>
                      </div>
                  </div>
                  
                  <div className="rounded-lg bg-white p-6 shadow">
                      <div className="flex flex-col">
                          <p className="text-sm font-medium text-slate-500">My Room</p>
                          <p className="text-3xl font-bold text-slate-900">
                              {myRoom?.number || 'N/A'}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                              Monthly Rent: ₱{myRoom?.price.toLocaleString()}
                          </p>
                      </div>
                  </div>

                  <div className="rounded-lg bg-white p-6 shadow">
                       <div className="flex flex-col">
                          <p className="text-sm font-medium text-slate-500">Move-in Date</p>
                          <p className="text-xl font-bold text-slate-900">
                              {myBoarder?.moveInDate}
                          </p>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="rounded-lg bg-white shadow">
                      <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                          <h3 className="text-lg font-medium leading-6 text-slate-900">Recent Messages from Admin</h3>
                          <MessageSquare className="h-5 w-5 text-slate-400" />
                      </div>
                      <ul className="divide-y divide-slate-200">
                          {recentMessages.length === 0 && (
                              <li className="px-6 py-4 text-sm text-slate-500">No recent messages.</li>
                          )}
                          {recentMessages.map(msg => (
                              <li key={msg.id} className="px-6 py-4">
                                  <p className="text-sm text-slate-900">{msg.content}</p>
                                  <p className="text-xs text-slate-500 mt-1">
                                      {new Date(msg.date).toLocaleDateString()}
                                  </p>
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>
      );
  }
}
