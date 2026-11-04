// src/App.js - Cấu hình routing chính của Cookio
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CreateRecipePage from './pages/CreateRecipePage';
import ProfilePage from './pages/ProfilePage';
import SavedRecipesPage from './pages/SavedRecipesPage';
import MyRecipesPage from './pages/MyRecipesPage';
import SmartFridgePage from './pages/SmartFridgePage';
import KitchenTipsPage from './pages/KitchenTipsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRecipes from './pages/admin/AdminRecipes';
import AdminUsers from './pages/admin/AdminUsers';
import AdminComments from './pages/admin/AdminComments';
import './App.css';

// Component bảo vệ route yêu cầu đăng nhập
function PrivateRoute({ children }) {
  const token = localStorage.getItem('cookio_token');
  return token ? children : <Navigate to="/" replace />;
}

// Component bảo vệ route chỉ dành cho admin
function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('cookio_user') || '{}');
  const token = localStorage.getItem('cookio_token');
  return token && user.role === 'ADMIN' ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Trang chủ */}
              <Route path="/" element={<HomePage />} />

              {/* Chi tiết công thức */}
              <Route path="/recipes/:id" element={<RecipeDetailPage />} />

              {/* Tạo công thức mới - yêu cầu đăng nhập */}
              <Route path="/recipes/create" element={
                <PrivateRoute><CreateRecipePage /></PrivateRoute>
              } />

              {/* Chỉnh sửa công thức */}
              <Route path="/recipes/:id/edit" element={
                <PrivateRoute><CreateRecipePage /></PrivateRoute>
              } />

              {/* Trang cá nhân */}
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/profile" element={
                <PrivateRoute><ProfilePage /></PrivateRoute>
              } />

              {/* Công thức đã lưu */}
              <Route path="/saved" element={
                <PrivateRoute><SavedRecipesPage /></PrivateRoute>
              } />

              {/* Công thức của tôi */}
              <Route path="/my-recipes" element={
                <PrivateRoute><MyRecipesPage /></PrivateRoute>
              } />

              {/* Tủ lạnh thông minh */}
              <Route path="/smart-fridge" element={<SmartFridgePage />} />

              {/* Mẹo nấu ăn */}
              <Route path="/kitchen-tips" element={<KitchenTipsPage />} />

              {/* Admin - quản trị viên */}
              <Route path="/admin" element={
                <AdminRoute><AdminDashboard /></AdminRoute>
              } />
              <Route path="/admin/recipes" element={
                <AdminRoute><AdminRecipes /></AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute><AdminUsers /></AdminRoute>
              } />
              <Route path="/admin/comments" element={
                <AdminRoute><AdminComments /></AdminRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
