import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Package, 
  BarChart3, 
  Users, 
  FileText,
  Boxes,
  TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  const adminFeatures = [
    {
      title: "Manage Orders",
      description: "View and process customer orders",
      icon: <ShoppingBag className="h-6 w-6" />,
      link: "/admin/orders",
      color: "text-blue-500"
    },
    {
      title: "Manage Products",
      description: "Add, edit, and remove products",
      icon: <Package className="h-6 w-6" />,
      link: "/admin/products",
      color: "text-green-500"
    },
    {
      title: "Analytics",
      description: "View sales and performance metrics",
      icon: <BarChart3 className="h-6 w-6" />,
      link: "/admin/analytics",
      color: "text-purple-500"
    },
    {
      title: "Customer Management",
      description: "Manage customer accounts and data",
      icon: <Users className="h-6 w-6" />,
      link: "/admin/customers",
      color: "text-orange-500"
    },
    {
      title: "Inventory",
      description: "Track and manage product stock",
      icon: <Boxes className="h-6 w-6" />,
      link: "/admin/inventory",
      color: "text-pink-500"
    },
    {
      title: "Reports",
      description: "Generate and view business reports",
      icon: <FileText className="h-6 w-6" />,
      link: "/admin/reports",
      color: "text-yellow-500"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your admin control panel
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <p className="text-sm font-medium">Today&apos;s Sales</p>
            </div>
            <p className="text-2xl font-bold mt-2">$1,429</p>
            <p className="text-xs text-muted-foreground mt-1">+12% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-500" />
              <p className="text-sm font-medium">Pending Orders</p>
            </div>
            <p className="text-2xl font-bold mt-2">25</p>
            <p className="text-xs text-muted-foreground mt-1">5 require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              <p className="text-sm font-medium">Low Stock Items</p>
            </div>
            <p className="text-2xl font-bold mt-2">12</p>
            <p className="text-xs text-muted-foreground mt-1">3 out of stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <p className="text-sm font-medium">Active Users</p>
            </div>
            <p className="text-2xl font-bold mt-2">1,429</p>
            <p className="text-xs text-muted-foreground mt-1">+23 this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Features Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {adminFeatures.map((feature) => (
          <Card key={feature.title} className="hover:shadow-lg transition-shadow">
            <Link to={feature.link}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`${feature.color} p-3 rounded-lg bg-background border`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;