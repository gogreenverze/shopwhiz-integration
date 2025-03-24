
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  className?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  isLoading?: boolean;
}

const DashboardCard = ({
  title,
  value,
  icon,
  trend,
  className,
  subtitle,
  footer,
  isLoading = false,
}: DashboardCardProps) => {
  return (
    <Card className={cn("overflow-hidden glass-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-primary/10 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-full bg-muted animate-pulse rounded-md"></div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        
        {trend !== undefined && !isLoading && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs font-medium",
                trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {trend > 0 ? "+" : trend < 0 ? "" : ""}
              {trend}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">vs last period</span>
          </div>
        )}
        
        {footer && (
          <div className="mt-3 pt-3 border-t border-border text-sm">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
