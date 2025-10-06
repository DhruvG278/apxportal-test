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
  Menu,
  X,
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
  const [menuOpen, setMenuOpen] = useState(false);

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
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const tabs = [
    { name: "Enquiries", href: "/enquiries", icon: Users },
    { name: "Applications", href: "/applications", icon: FileText },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="px-4 py-3 flex justify-between items-center md:px-8">
          <div className="flex items-center gap-2">
            <School className="w-6 h-6 text-blue-600" />
            <h1 className="font-semibold text-lg md:text-xl truncate">
              {loading
                ? "Loading School..."
                : school?.Name || "School Dashboard"}
            </h1>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* DESKTOP CONTACTS + LOGOUT */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            {school?.Email && (
              <span className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-blue-500" />
                {school.Email}
              </span>
            )}
            {school?.Phone && (
              <span className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-blue-500" />
                {school.Phone}
              </span>
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
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {menuOpen && (
          <div className="md:hidden border-t bg-white px-4 pb-4 space-y-3 animate-slideDown">
            {school?.Email && (
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Mail className="w-4 h-4 text-blue-500" />
                {school.Email}
              </div>
            )}
            {school?.Phone && (
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Phone className="w-4 h-4 text-blue-500" />
                {school.Phone}
              </div>
            )}
            {school?.Website && (
              <a
                href={school.Website}
                target="_blank"
                className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
              >
                <MapPin className="w-4 h-4" />
                Website
              </a>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-red-600 hover:bg-red-50 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </header>

      {/* EXTRA SCHOOL INFO */}
      {school && (
        <section className="px-4 md:px-8 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Referent</p>
            <p className="font-medium">
              {school.School_Referent_name || "N/A"}
            </p>
            <p className="text-xs text-gray-400">
              {school.School_Referent_email || ""}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Programs Offered</p>
            <p className="font-medium">
              {school.Programs_Offered?.join(", ") || "N/A"}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Boarding</p>
            <p className="font-medium">
              {school.Have_A_Boarding || "Not Mentioned"}
            </p>
          </div>
        </section>
      )}

      {/* NAVIGATION TABS */}
      <nav className="flex flex-wrap border-b bg-white">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium flex-1 transition-all ${
                isActive
                  ? "bg-blue-600 text-white border-b-2 border-blue-700"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </Link>
          );
        })}
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
