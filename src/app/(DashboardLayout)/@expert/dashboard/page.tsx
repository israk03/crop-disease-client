export default function ExpertDashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold font-display text-foreground">
          Expert Dashboard
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Phase F12 content coming here
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["Pending Requests", "Active Consultations", "Rating", "Farmers Helped"].map(
          (label) => (
            <div
              key={label}
              className="bg-card border border-border rounded-xl p-5 shadow-card"
            >
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-3xl font-bold text-foreground mt-1">—</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}