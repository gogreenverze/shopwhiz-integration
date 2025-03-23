
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency, currencies } from "@/contexts/CurrencyContext";
import { useTheme, themes } from "@/contexts/ThemeContext";
import { Copy, RefreshCw } from "lucide-react";

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { 
    theme, 
    setTheme,
    isDarkMode,
    toggleDarkMode,
    isCompactMode,
    toggleCompactMode,
    areAnimationsEnabled,
    toggleAnimations
  } = useTheme();

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

  const [receiptSettings, setReceiptSettings] = useState({
    header: "Thank you for shopping with us!",
    footer: "Visit us again soon!",
    showLogo: true,
    showContact: true,
    includeBarcode: true
  });

  const [apiKey, setApiKey] = useState("sk_7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p");
  const [maskedApiKey, setMaskedApiKey] = useState("••••••••••••••••••••••••••••••");

  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12");

  const handleStoreInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: keyof typeof notificationSettings, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));
    toast.success(t("settings.success.saved"));
  };

  const handleIntegrationChange = (key: keyof typeof integrations, value: boolean) => {
    setIntegrations((prev) => ({ ...prev, [key]: value }));
    toast.success(t("settings.success.saved"));
  };

  const handleReceiptChange = (key: keyof typeof receiptSettings, value: string | boolean) => {
    setReceiptSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = () => {
    toast.success(t("settings.success.saved"));
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.info(t("settings.success.copied"));
  };

  const handleRegenerateApiKey = () => {
    // Generate a random API key
    const newApiKey = 'sk_' + Array.from({ length: 30 }, () => 
      '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]
    ).join('');
    
    setApiKey(newApiKey);
    toast.info(t("settings.success.regenerated"));
  };

  const handleThemeChange = (themeName: string) => {
    const selectedTheme = themes.find(t => t.name === themeName);
    if (selectedTheme) {
      setTheme(selectedTheme);
      // Fixed error: Removed the extra argument here
      toast.info(t("settings.success.themeChanged"));
    }
  };

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any);
    toast.success(t("settings.success.saved"));
  };

  const handleCurrencyChange = (currencyCode: string) => {
    const selected = currencies.find(c => c.code === currencyCode);
    if (selected) {
      setCurrency(selected);
      toast.success(t("settings.success.saved"));
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-muted-foreground">
          {t("settings.description")}
        </p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="store">{t("settings.tabs.store")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("settings.tabs.notifications")}</TabsTrigger>
          <TabsTrigger value="integrations">{t("settings.tabs.integrations")}</TabsTrigger>
          <TabsTrigger value="appearance">{t("settings.tabs.appearance")}</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t("settings.store.info")}</CardTitle>
              <CardDescription>
                {t("settings.store.info.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("settings.store.name")}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={storeInfo.name}
                    onChange={handleStoreInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("settings.store.email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={storeInfo.email}
                    onChange={handleStoreInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("settings.store.phone")}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={storeInfo.phone}
                    onChange={handleStoreInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">{t("settings.store.taxRate")}</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    value={storeInfo.taxRate}
                    onChange={handleStoreInfoChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">{t("settings.store.address")}</Label>
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
              <Button onClick={handleSaveChanges}>{t("settings.store.saveChanges")}</Button>
            </CardFooter>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t("settings.receipt.title")}</CardTitle>
              <CardDescription>
                {t("settings.receipt.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="header">{t("settings.receipt.header")}</Label>
                  <Input 
                    id="header" 
                    value={receiptSettings.header}
                    onChange={(e) => handleReceiptChange("header", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footer">{t("settings.receipt.footer")}</Label>
                  <Input 
                    id="footer" 
                    value={receiptSettings.footer}
                    onChange={(e) => handleReceiptChange("footer", e.target.value)}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="logo-toggle">{t("settings.receipt.showLogo")}</Label>
                  <Switch 
                    id="logo-toggle" 
                    checked={receiptSettings.showLogo}
                    onCheckedChange={(checked) => handleReceiptChange("showLogo", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="contact-toggle">{t("settings.receipt.showContact")}</Label>
                  <Switch 
                    id="contact-toggle" 
                    checked={receiptSettings.showContact}
                    onCheckedChange={(checked) => handleReceiptChange("showContact", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="barcode-toggle">{t("settings.receipt.includeBarcode")}</Label>
                  <Switch 
                    id="barcode-toggle" 
                    checked={receiptSettings.includeBarcode}
                    onCheckedChange={(checked) => handleReceiptChange("includeBarcode", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveChanges}>{t("settings.store.saveChanges")}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t("settings.notifications.title")}</CardTitle>
              <CardDescription>
                {t("settings.notifications.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t("settings.notifications.emailReceipts")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.notifications.emailReceipts.description")}
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
                    <Label>{t("settings.notifications.lowStock")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.notifications.lowStock.description")}
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
                    <Label>{t("settings.notifications.dailyReports")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.notifications.dailyReports.description")}
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
                    <Label>{t("settings.notifications.customerActivity")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.notifications.customerActivity.description")}
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
              <Button onClick={handleSaveChanges}>{t("settings.notifications.savePreferences")}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t("settings.integrations.title")}</CardTitle>
              <CardDescription>
                {t("settings.integrations.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t("settings.integrations.whatsapp")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.integrations.whatsapp.description")}
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
                    <Label className="text-base">{t("settings.integrations.email")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.integrations.email.description")}
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
                    <Label className="text-base">{t("settings.integrations.accounting")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.integrations.accounting.description")}
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
                    <Label className="text-base">{t("settings.integrations.ecommerce")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.integrations.ecommerce.description")}
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
              <Button onClick={handleSaveChanges}>{t("settings.integrations.saveIntegrations")}</Button>
            </CardFooter>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t("settings.api.title")}</CardTitle>
              <CardDescription>
                {t("settings.api.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">{t("settings.api.key")}</Label>
                <div className="flex space-x-2">
                  <Input
                    id="api-key"
                    readOnly
                    value={maskedApiKey}
                    className="font-mono"
                  />
                  <Button variant="outline" onClick={handleCopyApiKey}>
                    <Copy className="w-4 h-4 mr-2" />
                    {t("settings.api.copy")}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("settings.api.note")}
                </p>
              </div>

              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleRegenerateApiKey}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t("settings.api.regenerate")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t("settings.appearance.title")}</CardTitle>
              <CardDescription>
                {t("settings.appearance.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme-selector">{t("settings.appearance.theme")}</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  {themes.map((themeOption) => (
                    <div
                      key={themeOption.name}
                      className={`border rounded-md p-3 cursor-pointer transition-all ${
                        themeOption.name === theme.name
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => handleThemeChange(themeOption.name)}
                    >
                      <div className="text-center capitalize">{themeOption.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode-toggle">{t("settings.appearance.darkMode")}</Label>
                  <Switch 
                    id="dark-mode-toggle" 
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations-toggle">{t("settings.appearance.animations")}</Label>
                  <Switch 
                    id="animations-toggle" 
                    checked={areAnimationsEnabled}
                    onCheckedChange={toggleAnimations}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-toggle">{t("settings.appearance.compact")}</Label>
                  <Switch 
                    id="compact-toggle" 
                    checked={isCompactMode}
                    onCheckedChange={toggleCompactMode}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveChanges}>{t("settings.appearance.saveTheme")}</Button>
            </CardFooter>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t("settings.localization.title")}</CardTitle>
              <CardDescription>
                {t("settings.localization.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">{t("settings.localization.language")}</Label>
                  <Select
                    value={language}
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">{t("settings.localization.currency")}</Label>
                  <Select
                    value={currency.code}
                    onValueChange={handleCurrencyChange}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(curr => (
                        <SelectItem key={curr.code} value={curr.code}>
                          {curr.name} ({curr.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">{t("settings.localization.dateFormat")}</Label>
                  <Select
                    value={dateFormat}
                    onValueChange={setDateFormat}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">{t("settings.localization.timeFormat")}</Label>
                  <Select
                    value={timeFormat}
                    onValueChange={setTimeFormat}
                  >
                    <SelectTrigger id="timeFormat">
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 Hour (AM/PM)</SelectItem>
                      <SelectItem value="24">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveChanges}>{t("settings.localization.saveLocalization")}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
