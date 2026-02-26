import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";

describe("DashboardStats", () => {
  it("renders notebook count and last-accessed notebook name", () => {
    render(
      <DashboardStats
        notebookCount={3}
        lastAccessedNotebook={{ id: "1", name: "Work" }}
      />
    );

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("renders empty state when notebookCount is 0 and no last accessed", () => {
    render(
      <DashboardStats notebookCount={0} lastAccessedNotebook={null} />
    );

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(
      screen.getByText(/no notebooks yet|create your first/i)
    ).toBeInTheDocument();
  });
});
