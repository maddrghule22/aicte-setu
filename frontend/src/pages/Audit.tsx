import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui";

export function Audit() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => { api.get("/audit/logs?limit=100").then((r) => setLogs(r.data)).catch(() => {}); }, []);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Audit Log</h2>
      <Card>
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-x-auto rounded-xl border">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="bg-slate-100 sticky top-0">
                <tr><th className="px-2 py-1 text-left">Time</th><th className="px-2 py-1 text-left">Actor</th><th className="px-2 py-1 text-left">Role</th><th className="px-2 py-1 text-left">Action</th><th className="px-2 py-1 text-left">Entity</th><th className="px-2 py-1 text-left">Details</th></tr>
              </thead>
              <tbody>
                {logs.map((l: any) => (
                  <tr key={l.id} className="border-t">
                    <td className="px-2 py-1 text-xs">{l.created_at}</td>
                    <td className="px-2 py-1">{l.actor}</td>
                    <td className="px-2 py-1">{l.role}</td>
                    <td className="px-2 py-1">{l.action}</td>
                    <td className="px-2 py-1 text-xs">{l.entity_type}/{l.entity_id}</td>
                    <td className="px-2 py-1 text-xs max-w-xs truncate">{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}