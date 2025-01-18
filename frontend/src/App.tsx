import CustomSidebar from "./components/shared/CustomSidebar"

function App() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://github.com/shadcn.png", // Replace with actual avatar URL
  }

  return (
    <div className="flex h-screen">
      <CustomSidebar user={user} />
      <main className="flex-1 p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Welcome to Your App</h1>
      </main>
    </div>
  )
}

export default App
