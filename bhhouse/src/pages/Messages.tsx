import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Send, User } from 'lucide-react';

export function Messages() {
  const { messages, sendMessage, boarders, getBoarderName } = useData();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'ADMIN';
  
  // If admin, which boarder is selected?
  const [selectedBoarderId, setSelectedBoarderId] = useState<string | null>(null);

  // Filter messages for current view
  const currentMessages = useMemo(() => {
    if (isAdmin && !selectedBoarderId) return [];
    
    const partnerId = isAdmin ? selectedBoarderId : user?.boarderId;
    
    if (!partnerId) return [];

    return messages.filter(m => 
        (m.senderId === partnerId && m.receiverId === 'admin') ||
        (m.senderId === 'admin' && m.receiverId === partnerId)
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [messages, isAdmin, selectedBoarderId, user?.boarderId]);

  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (isAdmin) {
        if (!selectedBoarderId) return;
        sendMessage({
            senderId: 'admin',
            receiverId: selectedBoarderId,
            content: newMessage,
        });
    } else {
        if (!user?.boarderId) return;
        sendMessage({
            senderId: user.boarderId,
            receiverId: 'admin',
            content: newMessage,
        });
    }
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4">
      {/* Sidebar for Admin to select Boarder */}
      {isAdmin && (
        <div className="w-1/3 overflow-y-auto rounded-lg bg-white shadow">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-lg font-medium text-slate-900">Conversations</h2>
          </div>
          <ul className="divide-y divide-slate-200">
            {boarders.map((boarder) => (
              <li 
                key={boarder.id} 
                className={`cursor-pointer px-4 py-3 hover:bg-slate-50 ${selectedBoarderId === boarder.id ? 'bg-indigo-50' : ''}`}
                onClick={() => setSelectedBoarderId(boarder.id)}
              >
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <User className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-slate-900">{boarder.name}</p>
                        <p className="text-xs text-slate-500">Room {boarder.roomId}</p>
                    </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat Area */}
      <div className={`flex flex-1 flex-col overflow-hidden rounded-lg bg-white shadow ${!isAdmin ? 'w-full' : ''}`}>
        {!isAdmin || selectedBoarderId ? (
            <>
                <div className="border-b border-slate-200 px-6 py-4">
                    <h3 className="text-lg font-medium text-slate-900">
                        {isAdmin ? `Chat with ${getBoarderName(selectedBoarderId!)}` : 'Chat with Admin'}
                    </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {currentMessages.length === 0 && (
                        <p className="text-center text-sm text-slate-500">No messages yet.</p>
                    )}
                    {currentMessages.map((msg) => {
                        const isMe = msg.senderId === (isAdmin ? 'admin' : user?.boarderId);
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs rounded-lg px-4 py-2 ${
                                    isMe ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-900'
                                }`}>
                                    <p className="text-sm">{msg.content}</p>
                                    <p className={`text-xs mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-500'}`}>
                                        {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="border-t border-slate-200 p-4">
                    <form onSubmit={handleSend} className="flex space-x-2">
                        <input
                            type="text"
                            className="flex-1 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </>
        ) : (
            <div className="flex h-full items-center justify-center text-slate-500">
                Select a boarder to start chatting
            </div>
        )}
      </div>
    </div>
  );
}
