const History: React.FC = () => (
  <div className="gap-16" style={{ paddingTop: '20px' }}>
    <h1>History</h1>

    <div className="card">
      <h2>Check-in Log</h2>
      <p style={{ marginTop: '8px' }}>Your past daily check-ins (mood, work setting, stress level) will appear here.</p>
    </div>

    <div className="card">
      <h2>Recommendation History</h2>
      <p style={{ marginTop: '8px' }}>Previously generated AI recommendations and exercises.</p>
    </div>
  </div>
);

export default History;
