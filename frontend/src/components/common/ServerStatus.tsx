import { useEffect } from 'react';
import { useServerStore } from '@/stores/serverStore';
import { Activity, Users, Clock } from 'lucide-react';
import serverService from '@/services/server.service';

export default function ServerStatus() {
  const { status, fetchStatus } = useServerStore();

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [fetchStatus]);

  if (!status) return null;

  return (
    <div className="glass rounded-xl p-6 border border-wow-ice/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Server Status</h3>
        <div className="flex items-center space-x-2">
          <span className={status.online ? 'status-online' : 'status-offline'} />
          <span className="text-sm text-gray-300">
            {status.online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-wow-ice" />
            <span className="text-gray-300">Players Online</span>
          </div>
          <span className="text-white font-semibold">
            {status.playersOnline} / {status.maxPlayers}
          </span>
        </div>

        <div className="w-full bg-wow-slate rounded-full h-2">
          <div
            className="bg-gradient-to-r from-wow-ice to-wow-ice-light h-2 rounded-full transition-all duration-500"
            style={{ width: `${(status.playersOnline / status.maxPlayers) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-wow-ice" />
            <span className="text-gray-300">Uptime</span>
          </div>
          <span className="text-white font-semibold">
            {serverService.formatUptime(status.uptime)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-wow-ice" />
            <span className="text-gray-300">Version</span>
          </div>
          <span className="text-white font-semibold">{status.version}</span>
        </div>
      </div>
    </div>
  );
}