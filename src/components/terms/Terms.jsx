import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Terms and Services</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Sollant Store, you acknowledge that you have read, understood, and agree to be bound by these Terms and Services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">2. User Accounts</h2>
              <p className="text-muted-foreground">
                You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">3. Purchase and Payment</h2>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>All prices are listed in USD unless otherwise specified</li>
                <li>Payment must be made in full at the time of purchase</li>
                <li>We accept various payment methods including credit cards and PayPal</li>
                <li>Prices and availability are subject to change without notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">4. Shipping and Delivery</h2>
              <p className="text-muted-foreground">
                Delivery times may vary depending on your location and the product type. Digital products will be available for download immediately after payment confirmation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">5. Returns and Refunds</h2>
              <p className="text-muted-foreground">
                Physical products may be returned within 30 days of delivery. Digital products are non-refundable unless specified otherwise.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">6. Privacy Policy</h2>
              <p className="text-muted-foreground">
                We collect and process your personal data in accordance with our Privacy Policy. By using our services, you consent to such processing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">7. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on this website, including text, graphics, logos, and software, is the property of Sollant Store and is protected by intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Sollant Store shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">9. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Continued use of our services after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">10. Contact Information</h2>
              <p className="text-muted-foreground">
                For any questions regarding these terms, please contact us at support@sollantstore.com
              </p>
            </section>

            <div className="mt-8 text-sm text-muted-foreground">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms; 