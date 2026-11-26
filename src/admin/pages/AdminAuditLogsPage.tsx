import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AuditLog } from '../types';
import {
  STORAGE_KEYS,
  INITIAL_AUDIT_LOGS,
  loadFromStorage,
} from '../mockData';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  User,
  Shield,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Globe,
  RefreshCw,
} from 'lucide-react';

const HEADING_FONT = "'Poppins', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";

export const AdminAuditLogsPage: React.FC = () => {
  const { user, isSuperAdmin } = useAdminAuth();

  const [logs, setLogs] = useState<AuditLog[]>(() =>
    loadFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionCategoryFilter, setActionCategoryFilter] = useState('ALL');

  const refreshLogs = () => {
    setLogs(loadFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS));
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Admin User', 'Role', 'Action', 'Target & Detail', 'IP Address'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.userName.replace(/"/g, '""')}"`,
      l.userRole,
      l.action,
      `"${l.target.replace(/"/g, '""')}"`,
      l.ipAddress || '127.0.0.1',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nkomazi_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filteredLogs = logs.filter((log) => {
    const matchesRole = roleFilter === 'ALL' || log.userRole === roleFilter;

    let matchesCategory = true;
    if (actionCategoryFilter !== 'ALL') {
      const act = log.action.toUpperCase();
      if (actionCategoryFilter === 'CREATE') matchesCategory = act.includes('CREATE') || act.includes('ADD') || act.includes('POST');
      else if (actionCategoryFilter === 'UPDATE') matchesCategory = act.includes('UPDATE') || act.includes('EDIT') || act.includes('TOGGLE');
      else if (actionCategoryFilter === 'DELETE') matchesCategory = act.includes('DELETE') || act.includes('REMOVE');
      else if (actionCategoryFilter === 'APPROVE') matchesCategory = act.includes('APPROV') || act.includes('REJECT');
      else if (actionCategoryFilter === 'LOGIN') matchesCategory = act.includes('LOGIN') || act.includes('LOGOUT') || act.includes('SESSION');
    }

    const matchesSearch =
      searchQuery === '' ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesCategory && matchesSearch;
  });

  const totalSuperAdminActions = logs.filter((l) => l.userRole === 'SUPER_ADMIN').length;
  const totalApprovalActions = logs.filter((l) => l.action.toUpperCase().includes('APPROV') || l.action.toUpperCase().includes('REJECT')).length;
  const totalDeletionActions = logs.filter((l) => l.action.toUpperCase().includes('DELETE') || l.action.toUpperCase().includes('REMOVE')).length;

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('DELETE') || act.includes('REMOVE') || act.includes('REJECT')) {
 return 'bg-red-50 text-red-700 ';
    }
    if (act.includes('APPROV') || act.includes('CREATE') || act.includes('ADD')) {
 return 'bg-emerald-50 text-emerald-700 ';
    }
    if (act.includes('UPDATE') || act.includes('EDIT') || act.includes('TOGGLE')) {
 return 'bg-amber-50 text-amber-700 ';
    }
 return 'bg-blue-50 text-blue-700 ';
  };

  return (
    <div className="space-y-6" style={{ fontFamily: BODY_FONT }}>
      {/* Header Banner */}
 <div className="bg-gradient-to-r from-[#023A23] via-[#044c2f] to-[#023A23] p-6 sm:p-8 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#F2AE37] text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck size={16} />
            Governance, AGSA &amp; POPIA Compliance Trail
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2"
            style={{ fontFamily: HEADING_FONT }}
          >
            Audit Trail &amp; System Event Logs
          </h1>
          <p className="text-emerald-100/80 text-sm max-w-2xl leading-relaxed">
            Immutable, cryptographically anchored audit record of all administrative modifications, publication authorizations, and dual-control sign-offs.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button
            onClick={refreshLogs}
 className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Refresh Log Stream"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={handleExportCSV}
 className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#28B674] hover:bg-[#20925c] text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-emerald-900/40 hover:scale-[1.02]"
          >
            <Download size={16} />
            <span>Export Audit Pack (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Total Audited Events
          </div>
          <div className="text-2xl font-bold text-[#023A23]" style={{ fontFamily: HEADING_FONT }}>
            {logs.length}
          </div>
        </div>
 <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Super Admin Authorizations
          </div>
          <div className="text-2xl font-bold text-[#28B674]" style={{ fontFamily: HEADING_FONT }}>
            {totalSuperAdminActions}
          </div>
        </div>
 <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Dual-Control Approvals
          </div>
          <div className="text-2xl font-bold text-[#F2AE37]" style={{ fontFamily: HEADING_FONT }}>
            {totalApprovalActions}
          </div>
        </div>
 <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Protected Deletions Executed
          </div>
          <div className="text-2xl font-bold text-[#e87326]" style={{ fontFamily: HEADING_FONT }}>
            {totalDeletionActions}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
 <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search audit trail by user, action type, target item, or IP address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#28B674] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter by Admin Role"
 className="px-3 py-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28B674] text-gray-700"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Administrator</option>
              <option value="STANDARD_ADMIN">Standard Administrator</option>
            </select>

            <select
              value={actionCategoryFilter}
              onChange={(e) => setActionCategoryFilter(e.target.value)}
              aria-label="Filter by Action Type"
 className="px-3 py-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28B674] text-gray-700"
            >
              <option value="ALL">All Action Categories</option>
              <option value="CREATE">Creation &amp; Publishing</option>
              <option value="UPDATE">Edits &amp; Updates</option>
              <option value="DELETE">Deletions &amp; Removals</option>
              <option value="APPROVE">Dual-Control Sign-offs</option>
              <option value="LOGIN">Security &amp; Sessions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
 <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <Activity size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No audit events match your search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
 <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Timestamp &amp; Host</th>
                  <th className="py-3.5 px-4">Administrative User</th>
                  <th className="py-3.5 px-4">Action Event</th>
                  <th className="py-3.5 px-4">Target Entity &amp; Audit Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-xs">
                {filteredLogs.map((log) => (
 <tr key={log.id} className="hover:bg-gray-50/75 transition-colors">
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                        <Clock size={13} className="text-gray-400" />
                        <span>{log.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                        <Globe size={11} />
                        <span>IP: {log.ipAddress || '196.25.1.42'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap" style={{ fontFamily: BODY_FONT }}>
                      <div className="font-semibold text-gray-900">{log.userName}</div>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase ${
                          log.userRole === 'SUPER_ADMIN'
 ? 'bg-amber-100 text-amber-800'
 : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {log.userRole.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border ${getActionBadge(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="py-4 px-4" style={{ fontFamily: BODY_FONT }}>
                      <div className="text-xs text-gray-700 leading-relaxed font-medium">
                        {log.target}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                        Audit ID: {log.id}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
