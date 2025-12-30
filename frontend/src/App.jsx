import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddDeed from './pages/AddDeed';
import Missions from './pages/Missions';
import PostOffice from './pages/PostOffice';
import TreePage from './pages/TreePage';
import Community from './pages/Community';
import Leaderboard from './pages/Leaderboard';

function App() {
    return (
        <AuthProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/add-deed" element={
                        <ProtectedRoute>
                            <AddDeed />
                        </ProtectedRoute>
                    } />
                    <Route path="/missions" element={
                        <ProtectedRoute>
                            <Missions />
                        </ProtectedRoute>
                    } />
                    <Route path="/post-office" element={
                        <ProtectedRoute>
                            <PostOffice />
                        </ProtectedRoute>
                    } />
                    <Route path="/tree" element={
                        <ProtectedRoute>
                            <TreePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/community" element={<Community />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                </Routes>
            </Layout>
        </AuthProvider>
    );
}

export default App;
