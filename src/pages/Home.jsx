import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Laptop, Smartphone, Download, ShoppingBag } from 'lucide-react';

const Home = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-none">
        <CardHeader className="space-y-4">
          <CardTitle className="text-4xl font-bold text-center">
            Welcome to Sollant Store
          </CardTitle>
          <p className="text-xl text-center text-muted-foreground max-w-2xl mx-auto">
            Your one-stop destination for premium electronics and digital products.
            Discover quality, innovation, and excellent service.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
          <Button asChild size="lg">
            <Link to="/electronics" className="flex items-center gap-2">
              <Laptop className="h-5 w-5" />
              Shop Electronics
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/digital" className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Explore Digital
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Categories Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Electronics Category */}
        <Card className="group hover:shadow-lg transition-shadow">
          <Link to="/electronics">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                <Laptop className="h-6 w-6" />
                Electronics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Browse our curated selection of high-quality electronics:
              </p>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Latest smartphones and accessories</li>
                <li>Premium laptops and computers</li>
                <li>Smart home devices</li>
                <li>Audio and entertainment systems</li>
              </ul>
              <div className="flex items-center text-primary">
                Shop Electronics <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* Digital Products Category */}
        <Card className="group hover:shadow-lg transition-shadow">
          <Link to="/digital">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                <Download className="h-6 w-6" />
                Digital Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Instant access to premium digital content:
              </p>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Software licenses and subscriptions</li>
                <li>Digital art and assets</li>
                <li>Online courses and tutorials</li>
                <li>E-books and digital publications</li>
              </ul>
              <div className="flex items-center text-primary">
                Explore Digital Products <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Features Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Why Choose Sollant Store?
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-2">
              {feature.icon}
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const features = [
  {
    icon: <ShoppingBag className="h-8 w-8 text-primary" />,
    title: "Secure Shopping",
    description: "Shop with confidence using our secure payment systems and protected checkout process."
  },
  {
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    title: "Quality Products",
    description: "All products are carefully selected to ensure the highest quality standards."
  },
  {
    icon: <Download className="h-8 w-8 text-primary" />,
    title: "Instant Delivery",
    description: "Get immediate access to digital products and fast shipping for electronics."
  }
];

export default Home; 