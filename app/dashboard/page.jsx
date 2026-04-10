"use client";

import Dashboard from "@/components/PageSections/Dashboard";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    );
}