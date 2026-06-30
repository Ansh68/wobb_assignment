import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";

function App() {
  return (
    <TooltipProvider delayDuration={400}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/profile/:username" element={<ProfileDetailPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2500,
          style: {
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 500,
          },
        }}
      />
    </TooltipProvider>
  );
}

export default App;
