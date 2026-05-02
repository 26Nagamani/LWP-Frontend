import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: Props) {
  return (
    <div className="text-sm text-gray-500 mb-6">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index}>
            {isLast ? (
              <span className="text-gray-400">{item.label}</span>
            ) : (
              <Link to={item.path} className="hover:underline text-blue-600">
                {item.label}
              </Link>
            )}
            {!isLast && " > "}
          </span>
        );
      })}
    </div>
  );
}