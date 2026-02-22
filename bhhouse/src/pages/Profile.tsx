import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Camera } from 'lucide-react';

export function Profile() {
  const { user, login } = useAuth();
  const { getTenantAccount, updateUserPassword, updateUserUsername, updateUserProfilePicture } = useData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profilePicture, setProfilePicture] = useState<string | undefined>();
  const [imagePreview, setImagePreview] = useState<string | undefined>();

  // Load profile picture on mount
  if (user && user.username) {
    const account = getTenantAccount(user.boarderId || '');
    if (account && account.profilePicture && !profilePicture) {
      setProfilePicture(account.profilePicture);
      setImagePreview(account.profilePicture);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setProfilePicture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.username) return;

    // Validate password
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      if (!formData.password) {
        alert('Please enter your current password to change it!');
        return;
      }
    }

    try {
      const currentAccount = getTenantAccount(user.boarderId || '');
      if (!currentAccount || currentAccount.password !== formData.password) {
        alert('Current password is incorrect!');
        return;
      }

      // Update username if changed
      if (formData.username !== user.username) {
        updateUserUsername(user.username, formData.username);
        // Update local user
        login({
          ...user,
          username: formData.username
        });
      }

      // Update password if changed
      if (formData.newPassword) {
        updateUserPassword(formData.username || user.username, formData.newPassword);
      }

      // Update profile picture if changed
      if (profilePicture && profilePicture !== currentAccount.profilePicture) {
        updateUserProfilePicture(formData.username || user.username, profilePicture);
      }

      setIsEditing(false);
      setFormData({
        username: formData.username || user.username,
        password: '',
        newPassword: '',
        confirmPassword: ''
      });

      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col items-center space-y-6">
          {/* Profile Picture */}
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-12 w-12 text-slate-400" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 cursor-pointer hover:bg-indigo-700">
                <Camera className="h-5 w-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Profile Information */}
          {!isEditing ? (
            <div className="text-center">
              <p className="text-sm text-slate-500">Username</p>
              <p className="text-2xl font-bold text-slate-900">{user?.username}</p>
              <p className="mt-4 text-sm text-slate-500">{user?.name}</p>
              <p className="text-xs text-slate-400 uppercase">{user?.role}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter to confirm changes"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Change Password (Optional)</h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      username: user?.username || '',
                      password: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="rounded-md bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
