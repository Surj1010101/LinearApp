const Insights: React.FC = () => (
  <div className="gap-16" style={{ paddingTop: '20px' }}>
    <h1>Insights</h1>

    <div className="card">
      <h2>AI Recommendations</h2>
      <p style={{ marginTop: '8px' }}>Personalised exercise routines, stress management tips, and nutrition guidance adapted to your work patterns will appear here.</p>
    </div>

    <div className="card">
      <h2>Wellbeing Trends</h2>
      <p style={{ marginTop: '8px' }}>Graphs showing your mood, stress levels, and check-in history over time.</p>
    </div>

    <div className="card">
      <h2>Work Pattern Analysis</h2>
      <p style={{ marginTop: '8px' }}>Insights into how your home vs office days, screen time, and workload affect your wellbeing.</p>
    </div>
  </div>
);

export default Insights;
