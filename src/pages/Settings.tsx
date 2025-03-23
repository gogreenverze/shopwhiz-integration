
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Settings = () => {
  const [storeInfo, setStoreInfo] = useState({
    name: "My Shop",
    email: "contact@myshop.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, CA 12345",
    taxRate: "8.0",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailReceipts: true,
    lowStockAlerts: true,
    dailySalesReport: false,
    customerActivity: true,
  });

  const [integrations, setIntegrations] = useState({
    whatsapp: false,
    emailMarketing: false,
    accounting: false,
    ecommerce: false,
  });

  const handleStoreInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: keyof typeof notificationSettings, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleIntegrationChange = (key: keyof typeof integrations, value: boolean) => {
    setIntegrations((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and configure your store preferences.
        </p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Update your store details and business information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={storeInfo.name}
                    onChange={handleStoreInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={storeInfo.email}
                    onChange={handleStoreInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={storeInfo.phone}
                    onChange={handleStoreInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    value={storeInfo.taxRate}
                    onChange={handleStoreInfoChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Store Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={storeInfo.address}
                    onChange={handleStoreInfoChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Receipt Customization</CardTitle>
              <CardDescription>
                Customize the appearance and content of customer receipts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="header">Receipt Header</Label>
                  <Input id="header" placeholder="Thank you for shopping with us!" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footer">Receipt Footer</Label>
                  <Input id="footer" placeholder="Visit us again soon!" />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="logo-toggle">Show Store Logo</Label>
                  <Switch id="logo-toggle" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="contact-toggle">Show Contact Information</Label>
                  <Switch id="contact-toggle" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="barcode-toggle">Include Barcode</Label>
                  <Switch id="barcode-toggle" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Customize when and how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Receipts</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email receipts to customers after purchase
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailReceipts}
                    onCheckedChange={(value) =>
                      handleNotificationChange("emailReceipts", value)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when product inventory is running low
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(value) =>
                      handleNotificationChange("lowStockAlerts", value)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Sales Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive daily summary of sales and transactions
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.dailySalesReport}
                    onCheckedChange={(value) =>
                      handleNotificationChange("dailySalesReport", value)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Customer Activity</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new customers and registrations
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.customerActivity}
                    onCheckedChange={(value) =>
                      handleNotificationChange("customerActivity", value)
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveChanges}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Integrations & Services</CardTitle>
              <CardDescription>
                Connect your POS with external services and platforms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">WhatsApp Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Connect with customers via WhatsApp for notifications and support
                    </p>
                  </div>
                  <Switch
                    checked={integrations.whatsapp}
                    onCheckedChange={(value) =>
                      handleIntegrationChange("whatsapp", value)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Connect with email marketing platforms for campaigns
                    </p>
                  </div>
                  <Switch
                    checked={integrations.emailMarketing}
                    onCheckedChange={(value) =>
                      handleIntegrationChange("emailMarketing", value)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Accounting Software</Label>
                    <p className="text-sm text-muted-foreground">
                      Sync sales data with your accounting system
                    </p>
                  </div>
                  <Switch
                    checked={integrations.accounting}
                    onCheckedChange={(value) =>
                      handleIntegrationChange("accounting", value)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">E-commerce Platform</Label>
                    <p className="text-sm text-muted-foreground">
                      Connect your online store with your POS system
                    </p>
                  </div>
                  <Switch
                    checked={integrations.ecommerce}
                    onCheckedChange={(value) =>
                      handleIntegrationChange("ecommerce", value)
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveChanges}>Save Integrations</Button>
            </CardFooter>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Manage API keys and access to your POS data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex space-x-2">
                  <Input
                    id="api-key"
                    readOnly
                    value="••••••••••••••••••••••••••••••"
                    className="font-mono"
                  />
                  <Button variant="outline" onClick={() => toast.info("API key copied to clipboard")}>
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This key provides access to your store's API. Keep it secure.
                </p>
              </div>

              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => toast.info("API key regenerated")}
                >
                  Regenerate API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your POS interface.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme-selector">Color Theme</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  {["Default", "Ocean", "Sunset", "Forest", "Monochrome", "Custom"].map(
                    (theme) => (
                      <div
                        key={theme}
                        className={`border rounded-md p-3 cursor-pointer transition-all ${
                          theme === "Default"
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => toast.info(`Theme changed to ${theme}`)}
                      >
                        <div className="text-center">{theme}</div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode-toggle">Dark Mode</Label>
                  <Switch id="dark-mode-toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations-toggle">Enable Animations</Label>
                  <Switch id="animations-toggle" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-toggle">Compact Mode</Label>
                  <Switch id="compact-toggle" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveChanges}>Save Theme</Button>
            </CardFooter>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>
                Set your preferred language, currency and date formats.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full rounded-md border border-border bg-background px-3 py-2"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    className="w-full rounded-md border border-border bg-background px-3 py-2"
                  >
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                    <option value="JPY">Japanese Yen (¥)</option>
                    <option value="CAD">Canadian Dollar (C$)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <select
                    id="dateFormat"
                    className="w-full rounded-md border border-border bg-background px-3 py-2"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <select
                    id="timeFormat"
                    className="w-full rounded-md border border-border bg-background px-3 py-2"
                  >
                    <option value="12">12 Hour (AM/PM)</option>
                    <option value="24">24 Hour</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveChanges}>Save Localization</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
