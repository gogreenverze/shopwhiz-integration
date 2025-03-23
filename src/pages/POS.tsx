
import POSInterface from "@/components/pos/POSInterface";

const POS = () => {
  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
        <p className="text-muted-foreground">
          Process transactions, manage orders, and create receipts.
        </p>
      </div>
      
      <POSInterface />
    </div>
  );
};

export default POS;
