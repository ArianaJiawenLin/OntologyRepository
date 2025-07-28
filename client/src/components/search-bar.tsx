import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchFilter: string;
  onFilterChange: (filter: string) => void;
  category: string;
}

export default function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  searchFilter, 
  onFilterChange, 
  category 
}: SearchBarProps) {
  
  const getFilterOptions = () => {
    if (category === "scene-graphs") {
      return [
        { value: "all", label: "All Formats" },
        { value: "image", label: "PNG Images" },
        { value: "json", label: "JSON SDGs" },
        { value: "text", label: "TXT Files" },
        { value: "ontology", label: "OWL Files" },
      ];
    } else {
      return [
        { value: "all", label: "All Content" },
        { value: "scenarios", label: "Scenarios" },
        { value: "text", label: "Questions" },
        { value: "ontology", label: "Ontologies" },
        { value: "other", label: "Solutions" },
      ];
    }
  };

  const getPlaceholder = () => {
    if (category === "scene-graphs") {
      return "Search datasets, solutions, files...";
    } else {
      return "Search robot scenarios, solutions, ontologies...";
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder={getPlaceholder()}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={searchFilter} onValueChange={onFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getFilterOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
