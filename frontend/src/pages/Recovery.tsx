import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle, Button } from "../components/ui";

export function Recovery() {
  const [issues, setIssues] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [preview, setPreview] = useState<any>(null);

  const load = () => {
    api.get("/compliance/recovery/plan").then((r) => setIssues(r.data)).catch(() => {});
    api.get("/compliance/recovery/trend").then((r) => setTrend(r.data)).catch(() => {});
  };
  useEffect(load, []);

  const doPreview = async (issueId: string) => {
    const r = await api.post("/compliance/recovery/normalise-preview", { issue_id: issueId, proposed: { quota: "NRI", social_category: "General" } });
    setPreview(r.data);
  };

  const doApply = async (actionId: string) => {
    await api.post(`/compliance/recovery/apply/${actionId}`, {});
    load();
  };

  const doRevert = async (actionId: string) => {
    await api.post(`/compliance/recovery/revert/${actionId}`, {});
    load();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Data Quality Recovery Planner</h2>
      <Card>
        <CardHeader><CardTitle>Prioritised Issues (transparent scoring)</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr><th className="px-2 py-1 text-left">Type</th><th className="px-2 py-1 text-left">Severity</th><th className="px-2 py-1 text-left">Priority</th><th className="px-2 py-1 text-left">Reason</th><th className="px-2 py-1 text-left">Action</th></tr>
            </thead>
            <tbody>
              {issues.map((i: any) => (
                <tr key={i.id} className="border-t">
                  <td className="px-2 py-1">{i.type}</td>
                  <td className="px-2 py-1">{i.severity}</td>
                  <td className="px-2 py-1 font-bold">{i.priority}</td>
                  <td className="px-2 py-1 text-xs">{i.reason}</td>
                  <td className="px-2 py-1">
                    <Button size="sm" onClick={() => doPreview(i.id)}>Preview Fix</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-2">Priority = severity (10/20/30) + downstream impact (×5, max 40) + urgency (0/10/20). No black-box score.</p>
        </CardContent>
      </Card>
      {preview && (
        <Card>
          <CardHeader><CardTitle>Reversible Normalisation Preview</CardTitle></CardHeader>
          <CardContent>
            <pre className="bg-slate-50 p-3 rounded text-xs">{JSON.stringify(preview, null, 2)}</pre>
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={() => doApply(preview.action_id)}>Apply</Button>
              <Button size="sm" variant="outline" onClick={() => doRevert(preview.action_id)}>Revert</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader><CardTitle>Resolved Issues Trend</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="px-2 py-1 text-left">Date</th><th className="px-2 py-1 text-left">Resolved</th></tr></thead>
            <tbody>
              {trend.map((t: any, i: number) => (
                <tr key={i} className="border-t"><td className="px-2 py-1">{t.date}</td><td className="px-2 py-1">{t.resolved}</td></tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}