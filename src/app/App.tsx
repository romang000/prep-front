import { MaterialDetailPage } from "@/features/materials/ui/MaterialDetailPage";
import { AuthProvider } from "@/features/auth/model/AuthContext";
import { AdminRoute } from "@/features/auth/ui/AdminRoute";
import { AuthPage } from "@/features/auth/ui/AuthPage";
import { HomeRoute } from "@/features/auth/ui/HomeRoute";
import { ProtectedRoute } from "@/features/auth/ui/ProtectedRoute";
import { MaterialSubtopicsPage } from "@/pages/MaterialSubtopicsPage";
import { MaterialTopicsPage } from "@/pages/MaterialTopicsPage";
import { StatisticsPage } from "@/pages/StatisticsPage";
import { TestDetailPage } from "@/pages/TestDetailPage";
import { TestsPage } from "@/pages/TestsPage";
import { ReadinessPage } from "@/features/readiness/ui/ReadinessPage";
import { ProfilePage } from "@/features/profile/ui/ProfilePage";
import { AdminPage } from "@/features/admin/ui/AdminPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/tests/:id" element={<TestDetailPage />} />
            <Route path="/materials" element={<MaterialTopicsPage />} />
            <Route path="/materials/topics/:topicId" element={<MaterialSubtopicsPage />} />
            <Route path="/materials/:materialId" element={<MaterialDetailPage />} />
            <Route path="/materials/:materialId/files/:fileId" element={<MaterialDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/readiness" element={<ReadinessPage />} />
            <Route path="/statistics/users/:id" element={<StatisticsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
