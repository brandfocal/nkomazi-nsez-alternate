import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminUser, AdminRole, AuditLog } from '../types';
import {
  STORAGE_KEYS,
  INITIAL_USERS,
  loadFromStorage,
  saveToStorage,
  createAuditLog,
} from '../mockData';
import {
  Users,
  Shield,
  ShieldCheck,
  UserPlus,
  Mail,
  Building2,
  Lock,
  Search,
  X,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { user, isSuperAdmin } = useAdminAuth();

  const [users, setUsers] = useState<AdminUser[]>(() =>
    loadFromStorage<AdminUser[]>(STORAGE_KEYS.USERS, INITIAL_USERS)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDepartment, setNewDepartment] = useState('Investment Promotion');
  const [newRole, setNewRole] = useState<AdminRole>('STANDARD_ADMIN');

  const updateUsers = (newUsers: AdminUser[], actionDetail: string) => {
    setUsers(newUsers);
    saveToStorage(STORAGE_KEYS.USERS, newUsers);

    const logs = loadFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const newLog = createAuditLog(
      user?.name || 'Super Admin',
      user?.role || 'SUPER_ADMIN',
      'USER_MANAGEMENT',
      'User',
      actionDetail
    );
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  };

  const handleToggleStatus = (targetUser: AdminUser) => {
    if (!isSuperAdmin) {
      alert('Only Super Administrators can modify account status.');
      return;
    }
    if (targetUser.id === user?.id) {
      alert('You cannot deactivate your own active session.');
      return;
    }

    const currentStatus = targetUser.status || 'ACTIVE';
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = users.map((u) =>
      u.id === targetUser.id ? { ...u, status: newStatus as 'ACTIVE' | 'INACTIVE' } : u
    );

    updateUsers(
      updated,
      `${newStatus === 'ACTIVE' ? 'Activated' : 'Suspended'} user account for ${targetUser.name} (${targetUser.email})`
    );
  };

  const handleToggleRole = (targetUser: AdminUser) => {
    if (!isSuperAdmin) {
      alert('Only Super Administrators can modify role privileges.');
      return;
    }
    if (targetUser.id === user?.id) {
      alert('You cannot modify your own administrative role.');
      return;
    }

    const newRole: AdminRole = targetUser.role === 'SUPER_ADMIN' ? 'STANDARD_ADMIN' : 'SUPER_ADMIN';
    const updated = users.map((u) =>
      u.id === targetUser.id ? { ...u, role: newRole } : u
    );

    updateUsers(
      updated,
      `Changed role for ${targetUser.name} to ${newRole}`
    );
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name: newName,
      email: newEmail,
      department: newDepartment,
      role: newRole,
      status: 'ACTIVE',
      lastLogin: 'Never logged in',
    };

    updateUsers([newUser, ...users], `Invited new administrator ${newName} (${newRole})`);
    setIsInviteModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            User Accounts & Role Permissions
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage administrative personnel, role allocations, and POPIA-compliant authentication access.
          </p>
        </div>

        {isSuperAdmin ? (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#023A23] text-white hover:bg-[#023A23]/90 font-medium text-sm transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Invite Administrator
          </button>
        ) : (
          <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            User creation restricted to Super Admin
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
          />
        </div>
        <div className="text-xs text-gray-500 hidden md:block">
          Showing <strong>{filteredUsers.length}</strong> active & registered staff
        </div>
      </div>

      {/* User Roster Cards / Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">RBAC Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => {
                const userStatus = u.status || 'ACTIVE';
                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#023A23] text-[#F2AE37] font-bold text-xs flex items-center justify-center shrink-0">
                          {u.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                            {u.name}
                            {u.id === user?.id && (
                              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-normal">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        {u.department}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {u.role === 'SUPER_ADMIN' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#023A23] text-[#F2AE37]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Super Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          <Shield className="w-3.5 h-3.5 text-gray-400" />
                          Standard Admin
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {userStatus === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {u.lastLogin || 'Never logged in'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isSuperAdmin && u.id !== user?.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleRole(u)}
                            className="text-xs text-gray-600 hover:text-[#023A23] px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            Switch to {u.role === 'SUPER_ADMIN' ? 'Standard' : 'Super'}
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`text-xs px-2 py-1 rounded border transition-colors ${
                              userStatus === 'ACTIVE'
                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {userStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          {u.id === user?.id ? 'Current session' : 'Protected'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-900 font-heading text-lg">
                Invite Administrative User
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bongani Mkhize"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. b.mkhize@nkomazisez.co.za"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                >
                  <option value="Investment Promotion">Investment Promotion</option>
                  <option value="Supply Chain & Procurement">Supply Chain & Procurement</option>
                  <option value="Enterprise & OSS Desk">Enterprise & OSS Desk</option>
                  <option value="Executive Management">Executive Management</option>
                  <option value="Legal & Compliance">Legal & Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Assigned Privilege Level *
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#023A23]/20 focus:border-[#023A23]"
                >
                  <option value="STANDARD_ADMIN">Standard Admin (Requires dual-control for deletions)</option>
                  <option value="SUPER_ADMIN">Super Admin (Full CRUD + Sign-off authority)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#023A23] hover:bg-[#023A23]/90 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Send Invite & Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
