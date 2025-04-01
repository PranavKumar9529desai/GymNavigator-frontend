"use client";

import { useEffect } from "react";

interface RoleStorageManagerProps {
  role: string;
}

export default function RoleStorageManager({ role }: RoleStorageManagerProps) {
  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  return null;
} 