import { MaterialDetailPage } from "@/features/materials/ui/MaterialDetailPage";
import { MainPage } from "@/pages/MainPage";
import { MaterialPage } from "@/pages/MaterialPage";
import { StatisticsPage } from "@/pages/StatisticsPage";
import { TestDetailPage } from "@/pages/TestDetailPage";
import { TestsPage } from "@/pages/TestsPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/tests/:id" element={<TestDetailPage />} />
        <Route path="/materials" element={<MaterialPage />} />
        <Route path="/materials/:id" element={<MaterialDetailPage />} />
        <Route path="/statistics/users/:id" element={<StatisticsPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  )
}