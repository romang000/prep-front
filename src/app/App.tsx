import { MaterialDetailPage } from "@/features/materials/ui/MaterialDetailPage";
import { MainPage } from "@/pages/MainPage";
import { MaterialSubtopicsPage } from "@/pages/MaterialSubtopicsPage";
import { MaterialTopicsPage } from "@/pages/MaterialTopicsPage";
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
        <Route path="/materials" element={<MaterialTopicsPage />} />
        <Route path="/materials/topics/:topic" element={<MaterialSubtopicsPage />} />
        <Route path="/materials/:materialId/files/:fileId" element={<MaterialDetailPage />} />
        <Route path="/statistics/users/:id" element={<StatisticsPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  )
}