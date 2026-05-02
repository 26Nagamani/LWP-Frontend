import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-56 h-screen bg-gray-50 border-r p-3">
      <nav className="flex flex-col gap-2">
        <NavItem label="LWP" to="/admin/topic" />
      </nav>
    </aside>
  );
}

type NavItemProps = {
  label: string;
  to: string;
};

const NavItem = ({ label, to }: NavItemProps) => {
  const { pathname } = useLocation();

  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        const active = isActive || pathname.startsWith("/admin/");
        return `px-4 py-2 rounded-md text-sm font-medium transition
          ${active
            ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
            : "text-gray-700 hover:bg-gray-100"
          }`;
      }}
    >
      {label}
    </NavLink>
  );
};