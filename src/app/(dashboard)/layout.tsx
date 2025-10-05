"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  School,
  Mail,
  MapPin,
  Phone,
  Users,
  FileText,
  LogOut,
} from "lucide-react";

interface SchoolInfo {
  id: string;
  Name: string;
  Email: string;
  City: string;
  Country: string;
  Website?: string;
  Phone?: string;
  Facebook_URL?: string;
  Instagram?: string;
  LinkedIn?: string;
  School_Referent_name?: string;
  School_Referent_email?: string;
  Sector?: string;
  Have_A_Boarding?: string;
  Partnered_School?: string;
  Type_of_School_Multi_Select?: string[];
  Programs_Offered?: string[];
  Official_Govt_Website_Listed?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [school, setSchool] = useState<SchoolInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/zoho/schoolInfo");
        const json = await res.json();
        setSchool(json.data);
      } catch (err) {
        console.error("Error fetching school info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchool();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/zoho/logout", { method: "GET" });
      router.push("/login"); // redirect to login page after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const tabs = [
    { name: "Enquiries", href: "/enquiries", icon: Users },
    { name: "Applications", href: "/applications", icon: FileText },
  ];

  return (
    <div className="min-h-screen flex-col">
      {/* 🧭 Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <School className="w-6 h-6 text-blue-500" />
              {loading
                ? "Loading School..."
                : school?.Name || "School Dashboard"}
            </h1>
            {school?.Sector && (
              <p className="text-sm text-gray-500 mt-1">
                {school.Sector} School • {school.City}, {school.Country}
              </p>
            )}
          </div>

          {/* 📋 Key Info + Logout */}
          <div className="flex flex-wrap gap-4 items-center text-sm">
            {school?.Email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                {school.Email}
              </div>
            )}
            {school?.Phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" />
                {school.Phone}
              </div>
            )}
            {school?.Website && (
              <a
                href={school.Website}
                target="_blank"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <MapPin className="w-4 h-4" />
                Website
              </a>
            )}

            {/* 🔒 Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1 border rounded text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* 🏫 Extra Info */}
        {school && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg">
              <p className="text-gray-500">Referent</p>
              <p className="font-medium">
                {school.School_Referent_name || "N/A"}
              </p>
              <p className="text-xs text-gray-400">
                {school.School_Referent_email || ""}
              </p>
            </div>
            <div className="p-3 rounded-lg">
              <p className="text-gray-500">Programs Offered</p>
              <p className="font-medium">
                {school.Programs_Offered?.join(", ") || "N/A"}
              </p>
            </div>
            <div className="p-3 rounded-lg">
              <p className="text-gray-500">Boarding</p>
              <p className="font-medium">
                {school.Have_A_Boarding || "Not Mentioned"}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* 🧭 Tabs */}
      <nav className="flex border-b px-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
                isActive
                  ? "border-secondary text-white bg-primary "
                  : "border-transparent text-gray-600 hover:text-primary hover:border-secondary hover:bg-secondary/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </Link>
          );
        })}
      </nav>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
