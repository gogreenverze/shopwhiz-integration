
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockProducts } from "@/data/mockData";
import { useFormatters } from "@/utils/formatters";

const ProductsReportChart = () => {
  const { formatCurrency } = useFormatters();
  
  // Define a default sold value for products that don't have it
  const topProducts = [...mockProducts]
    .sort((a, b) => {
      // Calculate sales value based on price (assume 10 sold if none specified)
      const aSold = 'sold' in a ? (a.sold as number) : 10;
      const bSold = 'sold' in b ? (b.sold as number) : 10;
      return b.price * bSold - a.price * aSold;
    })
    .slice(0, 10)
    .map(product => {
      const soldQuantity = 'sold' in product ? (product.sold as number) : 10;
      return {
        name: product.name.length > 20 ? product.name.slice(0, 20) + '...' : product.name,
        value: product.price * soldQuantity
      };
    });

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={topProducts}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
          <XAxis 
            type="number"
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCurrency(value)}
            className="text-muted-foreground"
          />
          <YAxis 
            type="category"
            dataKey="name" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            width={150}
            className="text-muted-foreground"
          />
          <Tooltip 
            formatter={(value) => formatCurrency(value as number)}
            labelFormatter={(label) => `Product: ${label}`}
          />
          <Bar 
            dataKey="value" 
            name="Sales Value" 
            fill="#3b82f6" 
            radius={[0, 4, 4, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductsReportChart;
