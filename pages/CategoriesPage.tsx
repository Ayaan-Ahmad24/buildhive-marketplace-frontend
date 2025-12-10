import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import {
  categoryService,
  Category as ApiCategory,
} from "../src/services/categoryService";

interface CategoriesPageProps {
  onNavigate: (page: string) => void;
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
  electronics: <Icons.Electronics className="h-8 w-8 text-orange-500" />,
  cement: <Icons.Cement className="h-8 w-8 text-gray-500" />,
  tiles: <Icons.Marble className="h-8 w-8 text-cyan-500" />,
  tools: <Icons.Tools className="h-8 w-8 text-yellow-500" />,
  metal: <Icons.Metal className="h-8 w-8 text-slate-600" />,
  paint: <Icons.Paint className="h-8 w-8 text-purple-500" />,
  safety: <Icons.Shield className="h-8 w-8 text-green-500" />,
  plumbing: <Icons.Plumbing className="h-8 w-8 text-blue-500" />,
  electrical: <Icons.Electrical className="h-8 w-8 text-yellow-400" />,
  measuring: <Icons.Ruler className="h-8 w-8 text-indigo-500" />,
  default: <Icons.Tools className="h-8 w-8 text-primary" />,
};

// Color mapping for categories
const categoryColors: Record<string, string> = {
  electronics: "bg-orange-50",
  cement: "bg-gray-50",
  tiles: "bg-cyan-50",
  tools: "bg-yellow-50",
  metal: "bg-slate-100",
  paint: "bg-purple-50",
  safety: "bg-green-50",
  plumbing: "bg-blue-50",
  electrical: "bg-yellow-50",
  measuring: "bg-indigo-50",
  default: "bg-primary/10",
};

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  onNavigate,
}) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getActiveCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryIcon = (categoryName: string) => {
    const key = categoryName.toLowerCase().split(" ")[0];
    return categoryIcons[key] || categoryIcons["default"];
  };

  const getCategoryColor = (categoryName: string) => {
    const key = categoryName.toLowerCase().split(" ")[0];
    return categoryColors[key] || categoryColors["default"];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <Icons.AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const staticCategories = [
    {
      id: "1",
      name: "Electronics & Power",
      icon: <Icons.Electronics className="h-8 w-8 text-orange-500" />,
      count: 1240,
      color: "bg-orange-50",
      description: "Drills, saws, grinders, and construction electronics.",
    },
    {
      id: "2",
      name: "Cement & Adhesives",
      icon: <Icons.Cement className="h-8 w-8 text-gray-500" />,
      count: 420,
      color: "bg-gray-50",
      description: "High-quality cement, mortar, grout, and fixatives.",
    },
    {
      id: "3",
      name: "Tiles & Flooring",
      icon: <Icons.Marble className="h-8 w-8 text-cyan-500" />,
      count: 2200,
      color: "bg-cyan-50",
      description: "Ceramic, porcelain, marble tiles, and wooden flooring.",
    },
    {
      id: "4",
      name: "Hand Tools",
      icon: <Icons.Tools className="h-8 w-8 text-yellow-500" />,
      count: 5200,
      color: "bg-yellow-50",
      description: "Hammers, screwdrivers, wrenches, and essential hardware.",
    },
    {
      id: "5",
      name: "Metal & Steel",
      icon: <Icons.Metal className="h-8 w-8 text-slate-600" />,
      count: 850,
      color: "bg-slate-100",
      description: "Rebar, wire mesh, sheets, and structural steel.",
    },
    {
      id: "6",
      name: "Paint & Finishing",
      icon: <Icons.Paint className="h-8 w-8 text-purple-500" />,
      count: 1300,
      color: "bg-purple-50",
      description: "Interior & exterior paints, primers, and brushes.",
    },
    {
      id: "7",
      name: "Safety Equipment",
      icon: <Icons.Shield className="h-8 w-8 text-green-500" />,
      count: 650,
      color: "bg-green-50",
      description: "Helmets, gloves, vests, and protective gear.",
    },
    {
      id: "8",
      name: "Plumbing Supplies",
      icon: <Icons.Plumbing className="h-8 w-8 text-blue-500" />,
      count: 1800,
      color: "bg-blue-50",
      description: "Pipes, fittings, valves, and bathroom fixtures.",
    },
    {
      id: "9",
      name: "Electrical Supplies",
      icon: <Icons.Electrical className="h-8 w-8 text-yellow-400" />,
      count: 2100,
      color: "bg-yellow-50",
      description: "Wires, switches, breakers, and lighting.",
    },
    {
      id: "10",
      name: "Measuring Tools",
      icon: <Icons.Ruler className="h-8 w-8 text-indigo-500" />,
      count: 320,
      color: "bg-indigo-50",
      description: "Tapes, levels, laser meters, and scales.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Browse by Category
          </h1>
          <p className="mx-auto max-w-2xl text-gray-500">
            Explore our extensive range of construction supplies organized for
            your convenience. From heavy machinery to finishing touches, we have
            it all.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/products?categoryId=${cat.id}`)}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg border border-gray-100"
            >
              {cat.image ? (
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden transition-transform group-hover:scale-110">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement?.classList.add(
                        getCategoryColor(cat.name)
                      );
                    }}
                  />
                </div>
              ) : (
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${getCategoryColor(
                    cat.name
                  )} transition-transform group-hover:scale-110`}
                >
                  {getCategoryIcon(cat.name)}
                </div>
              )}

              <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                {cat.name}
              </h3>

              <p className="mb-4 text-sm text-gray-500 line-clamp-2">
                {cat.description || "Browse our selection of quality products"}
              </p>

              <div className="mt-auto flex items-center justify-end border-t border-gray-100 pt-4">
                <span className="flex items-center text-sm font-bold text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2">
                  Explore <Icons.ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-dark px-6 py-12 text-center text-white sm:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Icons.Tools className="h-64 w-64 rotate-12" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
              Can't find what you're looking for?
            </h2>
            <p className="mb-8 text-slate-300">
              Our catalog is constantly updating. Contact our support team for
              custom orders or bulk requirements.
            </p>
            <Button variant="primary" onClick={() => onNavigate("contact")}>
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
