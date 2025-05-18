import LogsTable from "./components/LogsTable";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto py-6 px-4">
          <h1
            className="text-3xl font-bold text-gray-900 text-center"
            dir="rtl"
          >
            سجل الاستلام و التسليم المركبات
          </h1>
        </div>
      </header>
      <main>
        <div className="container mx-auto py-8">
          <div className="bg-white rounded-lg shadow-lg">
            <LogsTable />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
