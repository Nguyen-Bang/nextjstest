import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardStats as DashboardStatsProps } from "@/lib/types";

export function DashboardStats({
  notebookCount,
  lastAccessedNotebook,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Notebooks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{notebookCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Last Accessed
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lastAccessedNotebook ? (
            <p className="text-3xl font-bold">{lastAccessedNotebook.name}</p>
          ) : (
            <p className="text-muted-foreground">
              No notebooks yet — create your first one
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
