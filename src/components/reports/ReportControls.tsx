
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, FileText, Table } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface ReportControlsProps {
  reportType: "daily" | "weekly" | "monthly" | "yearly";
  setReportType: (type: "daily" | "weekly" | "monthly" | "yearly") => void;
  selectedMonth: Date | undefined;
  setSelectedMonth: (date: Date | undefined) => void;
  handleGeneratePDF: () => void;
  handleExportCSV: () => void;
}

const ReportControls: React.FC<ReportControlsProps> = ({
  reportType,
  setReportType,
  selectedMonth,
  setSelectedMonth,
  handleGeneratePDF,
  handleExportCSV
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Select
        value={reportType}
        onValueChange={(value: "daily" | "weekly" | "monthly" | "yearly") => setReportType(value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Report Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[160px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedMonth ? format(selectedMonth, 'MMMM yyyy') : <span>Pick a month</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedMonth}
            onSelect={setSelectedMonth}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button variant="outline" onClick={handleGeneratePDF}>
        <FileText className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
      
      <Button variant="outline" onClick={handleExportCSV}>
        <Table className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
};

export default ReportControls;

