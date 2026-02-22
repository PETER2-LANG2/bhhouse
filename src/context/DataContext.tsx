import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Room {
  id: string;
  number: string;
  capacity: number;
  price: number;
  status: 'Available' | 'Full' | 'Maintenance';
}

export interface Boarder {
  id: string;
  name: string;
  contact: string;
  roomId: string;
  moveInDate: string;
  status: 'Active' | 'Moved Out';
}

export interface Payment {
  id: string;
  boarderId: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending'; // 'Pending' for cash requests or upcoming bills
  method: 'Cash' | 'E-Wallet' | 'System'; // System for auto-generated bills
  description: string;
  fileProof?: string; // Base64 encoded file for e-wallet proofs
  fileName?: string; // Original file name
}

export interface Report {
  id: string;
  boarderId: string;
  type: 'Maintenance' | 'Complaint' | 'Request';
  description: string;
  date: string;
  status: 'Open' | 'Resolved';
  fileProof?: string; // Base64 encoded file
  fileName?: string; // Original file name
}

export interface Message {
  id: string;
  senderId: string; // 'admin' or boarderId
  receiverId: string; // 'admin' or boarderId
  content: string;
  date: string;
  read: boolean;
  fileProof?: string; // Base64 encoded file
  fileName?: string; // Original file name
}

export interface UserAccount {
  username: string;
  password: string; // Plain text for demo purposes
  role: 'ADMIN' | 'TENANT';
  boarderId?: string; // If role is TENANT
  profilePicture?: string; // Base64 encoded image
}

interface DataContextType {
  rooms: Room[];
  boarders: Boarder[];
  payments: Payment[];
  reports: Report[];
  messages: Message[];
  users: UserAccount[]; // Manage login credentials
  
  // Room Ops
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;

  // Boarder Ops
  addBoarder: (boarder: Omit<Boarder, 'id'>) => void;
  updateBoarder: (id: string, boarder: Partial<Boarder>) => void;
  deleteBoarder: (id: string) => void;

  // Payment Ops
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePaymentStatus: (id: string, status: 'Paid' | 'Pending') => void;
  updatePaymentWithFile: (id: string, fileProof: string, fileName: string) => void;
  generateMonthlyBill: (boarderId: string) => void;

  // Report Ops
  addReport: (report: Omit<Report, 'id' | 'status' | 'date'>) => void;
  updateReportStatus: (id: string, status: 'Resolved') => void;
  updateReportWithFile: (id: string, fileProof: string, fileName: string) => void;

  // Message Ops
  sendMessage: (msg: Omit<Message, 'id' | 'date' | 'read'>) => void;
  markMessageRead: (id: string) => void;
  updateMessageWithFile: (id: string, fileProof: string, fileName: string) => void;

  // User Ops
  createTenantAccount: (boarderId: string, username: string, password: string) => void;
  getTenantAccount: (boarderId: string) => UserAccount | undefined;
  updateUserAccount: (username: string, updates: Partial<UserAccount>) => void;
  updateUserPassword: (username: string, newPassword: string) => void;
  updateUserUsername: (oldUsername: string, newUsername: string) => void;
  updateUserProfilePicture: (username: string, profilePicture: string) => void;

  // Helpers
  getBoarderName: (id: string) => string;
  getRoomNumber: (id: string) => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Data
const INITIAL_ROOMS: Room[] = [
  { id: '1', number: '101', capacity: 2, price: 3000, status: 'Available' },
  { id: '2', number: '102', capacity: 2, price: 3000, status: 'Full' },
  { id: '3', number: '201', capacity: 4, price: 2500, status: 'Available' },
];

const INITIAL_BOARDERS: Boarder[] = [
  { id: '1', name: 'Juan Dela Cruz', contact: '09123456789', roomId: '2', moveInDate: '2023-01-15', status: 'Active' },
  { id: '2', name: 'Maria Clara', contact: '09987654321', roomId: '2', moveInDate: '2023-02-01', status: 'Active' },
];

const INITIAL_PAYMENTS: Payment[] = [
  { id: '1', boarderId: '1', amount: 3000, date: '2023-10-01', status: 'Paid', method: 'Cash', description: 'October Rent' },
  { id: '2', boarderId: '2', amount: 3000, date: '2023-10-05', status: 'Paid', method: 'E-Wallet', description: 'October Rent' },
];

const INITIAL_USERS: UserAccount[] = [
  { username: 'admin', password: 'admin', role: 'ADMIN' }
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('madaje_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [boarders, setBoarders] = useState<Boarder[]>(() => {
    const saved = localStorage.getItem('madaje_boarders');
    return saved ? JSON.parse(saved) : INITIAL_BOARDERS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('madaje_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('madaje_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('madaje_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('madaje_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Persistence
  useEffect(() => { localStorage.setItem('madaje_rooms', JSON.stringify(rooms)); }, [rooms]);
  useEffect(() => { localStorage.setItem('madaje_boarders', JSON.stringify(boarders)); }, [boarders]);
  useEffect(() => { localStorage.setItem('madaje_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('madaje_reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('madaje_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('madaje_users', JSON.stringify(users)); }, [users]);

  // Operations
  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom = { ...room, id: Math.random().toString(36).substr(2, 9) };
    setRooms([...rooms, newRoom]);
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  const addBoarder = (boarder: Omit<Boarder, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newBoarder = { ...boarder, id };
    const updatedBoarders = [...boarders, newBoarder];
    setBoarders(updatedBoarders);
    
    // Automatically generate first month bill
    const room = rooms.find(r => r.id === boarder.roomId);
    if (room) {
        addPayment({
            boarderId: id,
            amount: room.price,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            method: 'System',
            description: 'First Month Rent (Auto-generated)'
        });
        
        // Check if room is now full
        const occupants = updatedBoarders.filter(b => b.roomId === boarder.roomId).length;
        if (occupants >= room.capacity) {
            updateRoom(boarder.roomId, { status: 'Full' });
        }
    }
  };

  const updateBoarder = (id: string, updates: Partial<Boarder>) => {
    setBoarders(boarders.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBoarder = (id: string) => {
    setBoarders(boarders.filter(b => b.id !== id));
  };

  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment = { ...payment, id: Math.random().toString(36).substr(2, 9) };
    setPayments([...payments, newPayment]);
  };

  const updatePaymentWithFile = (id: string, fileProof: string, fileName: string) => {
    setPayments(payments.map(p => p.id === id ? { ...p, fileProof, fileName } : p));
  };
  
  const updatePaymentStatus = (id: string, status: 'Paid' | 'Pending') => {
      setPayments(payments.map(p => p.id === id ? { ...p, status } : p));
  };

  const generateMonthlyBill = (boarderId: string) => {
      const boarder = boarders.find(b => b.id === boarderId);
      if (!boarder) return;
      const room = rooms.find(r => r.id === boarder.roomId);
      if (!room) return;
      
      addPayment({
          boarderId,
          amount: room.price,
          date: new Date().toISOString().split('T')[0],
          status: 'Pending',
          method: 'System',
          description: `Monthly Rent - ${new Date().toLocaleString('default', { month: 'long' })}`
      });
  };

  const addReport = (report: Omit<Report, 'id' | 'status' | 'date'>) => {
    const newReport: Report = {
        ...report,
        id: Math.random().toString(36).substr(2, 9),
        status: 'Open',
        date: new Date().toISOString().split('T')[0]
    };
    setReports([...reports, newReport]);
  };

  const updateReportStatus = (id: string, status: 'Resolved') => {
      setReports(reports.map(r => r.id === id ? { ...r, status } : r));
  };

  const updateReportWithFile = (id: string, fileProof: string, fileName: string) => {
      setReports(reports.map(r => r.id === id ? { ...r, fileProof, fileName } : r));
  };

  const sendMessage = (msg: Omit<Message, 'id' | 'date' | 'read'>) => {
      const newMsg: Message = {
          ...msg,
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString(),
          read: false
      };
      setMessages([...messages, newMsg]);
  };

  const markMessageRead = (id: string) => {
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const updateMessageWithFile = (id: string, fileProof: string, fileName: string) => {
      setMessages(messages.map(m => m.id === id ? { ...m, fileProof, fileName } : m));
  };

  const createTenantAccount = (boarderId: string, username: string, password: string) => {
      if (users.some(u => u.username === username)) {
          alert("Username already exists!");
          return;
      }
      const newUser: UserAccount = {
          username,
          password,
          role: 'TENANT',
          boarderId
      };
      setUsers([...users, newUser]);
  };

  const getTenantAccount = (boarderId: string) => {
      return users.find(u => u.boarderId === boarderId);
  };

  const updateUserAccount = (username: string, updates: Partial<UserAccount>) => {
    setUsers(users.map(u => u.username === username ? { ...u, ...updates } : u));
  };

  const updateUserPassword = (username: string, newPassword: string) => {
    setUsers(users.map(u => u.username === username ? { ...u, password: newPassword } : u));
  };

  const updateUserUsername = (oldUsername: string, newUsername: string) => {
    if (users.some(u => u.username === newUsername)) {
        alert("Username already exists!");
        return;
    }
    setUsers(users.map(u => u.username === oldUsername ? { ...u, username: newUsername } : u));
  };

  const updateUserProfilePicture = (username: string, profilePicture: string) => {
    setUsers(users.map(u => u.username === username ? { ...u, profilePicture } : u));
  };

  const getBoarderName = (id: string) => boarders.find(b => b.id === id)?.name || 'Unknown';
  const getRoomNumber = (id: string) => rooms.find(r => r.id === id)?.number || 'Unknown';

  return (
    <DataContext.Provider value={{
      rooms, boarders, payments, reports, messages, users,
      addRoom, updateRoom, deleteRoom,
      addBoarder, updateBoarder, deleteBoarder,
      addPayment, updatePaymentStatus, updatePaymentWithFile, generateMonthlyBill,
      addReport, updateReportStatus, updateReportWithFile,
      sendMessage, markMessageRead, updateMessageWithFile,
      createTenantAccount, getTenantAccount, updateUserAccount, updateUserPassword, updateUserUsername, updateUserProfilePicture,
      getBoarderName, getRoomNumber
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
