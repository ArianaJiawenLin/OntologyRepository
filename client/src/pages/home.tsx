import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChartGantt, 
  Database, 
  Settings, 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  ExternalLink,
  Brain,
  CircleHelp,
  FileCode,
  Image as ImageIcon,
  Bot,
  Menu
} from "lucide-react";
import ImageGallery from "@/components/image-gallery";
import FileUpload from "@/components/file-upload";
import SearchBar from "@/components/search-bar";
import { File, Reasoner, Scenario } from "@shared/schema";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<"scene-graphs" | "robot-world">("scene-graphs");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");

  const { data: files = [], refetch: refetchFiles } = useQuery<File[]>({
    queryKey: ["/api/files", { category: activeCategory, search: searchQuery || undefined }],
  });

  const { data: reasoners = [] } = useQuery<Reasoner[]>({
    queryKey: ["/api/reasoners", { category: activeCategory }],
  });

  const { data: scenarios = [] } = useQuery<Scenario[]>({
    queryKey: ["/api/scenarios", { category: activeCategory, search: searchQuery || undefined }],
  });

  const getFilesBySection = (section: string, fileType?: string) => {
    return files.filter(file => {
      const sectionMatch = file.section === section;
      const typeMatch = !fileType || file.fileType === fileType;
      const searchMatch = !searchQuery || 
        file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.filename.toLowerCase().includes(searchQuery.toLowerCase());
      
      return sectionMatch && typeMatch && searchMatch;
    });
  };

  const handleFileUpload = () => {
    refetchFiles();
  };

  const handleDownload = (fileId: string) => {
    window.open(`/api/files/${fileId}/download`, '_blank');
  };

  const showSearchBar = !(activeCategory === "scene-graphs");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <ChartGantt className="text-primary text-2xl" />
              <h1 className="text-xl font-semibold text-foreground">Ontology Repository</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">About</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </nav>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Navigation */}
        <div className="mb-8">
          <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as "scene-graphs" | "robot-world")}>
            <TabsList>
              <TabsTrigger value="scene-graphs">Scene Description Graphs</TabsTrigger>
              <TabsTrigger value="robot-world">Bot Meets World</TabsTrigger>
            </TabsList>

            {/* Search Bar */}
            {showSearchBar && (
              <div className="mt-6">
                <SearchBar 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  searchFilter={searchFilter}
                  onFilterChange={setSearchFilter}
                  category={activeCategory}
                />
              </div>
            )}

            {/* Scene Description Graphs */}
            <TabsContent value="scene-graphs" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Specification Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="text-primary mr-3" />
                      Specification
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Research questions and requirements</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Core Research Questions</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          How can scene description graphs represent spatial relationships between objects?
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          What ontological structures best capture visual scene semantics?
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          How do we bridge computer vision outputs with formal knowledge representation?
                        </li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Requirements</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Support for OWL and FOL formats</li>
                        <li>• Graph-based representation compatibility</li>
                        <li>• TPTP reasoner integration</li>
                        <li>• Scalable to large image datasets</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Dataset Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Database className="text-primary mr-3" />
                        Dataset
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Images, graphs, and metadata</p>
                    </div>
                    <FileUpload 
                      category="scene-graphs" 
                      section="dataset" 
                      onUpload={handleFileUpload}
                    />
                  </CardHeader>
                  <CardContent>
                    {/* Image Gallery */}
                    <div className="mb-6">
                      <h4 className="font-medium text-foreground mb-3">Image Gallery</h4>
                      <ImageGallery files={getFilesBySection("dataset", "image")} />
                    </div>

                    {/* Other Files */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Scene Description Graphs (JSON)</h4>
                        <div className="space-y-2">
                          {getFilesBySection("dataset", "json").map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex items-center">
                                <FileCode className="text-accent mr-3 h-4 w-4" />
                                <span className="text-sm">{file.originalName}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownload(file.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-3">Questions & Metadata</h4>
                        <div className="space-y-2">
                          {getFilesBySection("dataset", "text").map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex items-center">
                                <FileText className="text-secondary mr-3 h-4 w-4" />
                                <span className="text-sm">{file.originalName}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownload(file.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Solution Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="text-primary mr-3" />
                      Solution
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Ontologies and reasoning tools</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Ontology Files */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Ontology Files</h4>
                      <div className="space-y-2">
                        {getFilesBySection("solution", "ontology").map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center">
                              <ChartGantt className="text-green-600 mr-3 h-4 w-4" />
                              <div>
                                <span className="text-sm font-medium">{file.originalName}</span>
                                <p className="text-xs text-muted-foreground">
                                  {file.originalName.endsWith('.owl') ? 'OWL Format' : 'FOL Format'}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownload(file.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* TPTP Reasoner Links */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">TPTP Reasoners</h4>
                      <div className="space-y-2">
                        {reasoners.map((reasoner) => (
                          <a 
                            key={reasoner.id}
                            href={reasoner.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-950/30 transition-colors"
                          >
                            <div className="flex items-center">
                              <Brain className="text-purple-600 mr-3 h-4 w-4" />
                              <div>
                                <span className="text-sm font-medium">{reasoner.name}</span>
                                <p className="text-xs text-muted-foreground">{reasoner.description}</p>
                              </div>
                            </div>
                            <ExternalLink className="text-purple-600 h-4 w-4" />
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Input/Output Files */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Input/Output Files</h4>
                      <div className="space-y-2">
                        {getFilesBySection("solution", "tptp").map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center">
                              <FileText className="text-muted-foreground mr-3 h-4 w-4" />
                              <span className="text-sm">{file.originalName}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDownload(file.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Bot Meets World */}
            <TabsContent value="robot-world" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Specification Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="text-primary mr-3" />
                      Specification
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Bot interaction scenarios</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Scenario Overview</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Robots operating in real-world environments encounter complex situations requiring commonsense reasoning and adaptation.
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Navigation and obstacle avoidance</li>
                        <li>• Human-robot interaction protocols</li>
                        <li>• Task planning and execution</li>
                        <li>• Environmental adaptation</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Key Challenges</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Dynamic environment modeling</li>
                        <li>• Uncertainty handling</li>
                        <li>• Multi-modal sensor fusion</li>
                        <li>• Real-time decision making</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Success Metrics</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Task completion rate</li>
                        <li>• Safety compliance</li>
                        <li>• Efficiency measures</li>
                        <li>• User satisfaction</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Dataset Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Database className="text-primary mr-3" />
                        Dataset
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Scenarios and test cases</p>
                    </div>
                    <FileUpload 
                      category="robot-world" 
                      section="dataset" 
                      onUpload={handleFileUpload}
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Text Scenarios */}
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Text Scenarios</h4>
                        <div className="space-y-3">
                          {scenarios.map((scenario) => (
                            <div key={scenario.id} className="bg-muted rounded-lg p-4 border-l-4 border-primary">
                              <h5 className="font-medium text-sm mb-2">{scenario.title}</h5>
                              <p className="text-sm text-muted-foreground">
                                {scenario.description}
                              </p>
                              <div className="flex justify-between items-center mt-3">
                                <span className="text-xs text-muted-foreground">
                                  Created: {new Date(scenario.createdAt).toLocaleDateString()}
                                </span>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Questions */}
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Test Questions</h4>
                        <div className="space-y-2">
                          {getFilesBySection("dataset", "text").map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                              <div className="flex items-center">
                                <CircleHelp className="text-yellow-600 mr-3 h-4 w-4" />
                                <span className="text-sm">{file.originalName}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownload(file.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Metadata</h4>
                        <div className="bg-muted rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Total Scenarios:</span>
                              <span className="font-medium ml-2">{scenarios.length}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Question Sets:</span>
                              <span className="font-medium ml-2">{getFilesBySection("dataset", "text").length}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Last Updated:</span>
                              <span className="font-medium ml-2">
                                {scenarios.length > 0 ? new Date(Math.max(...scenarios.map(s => new Date(s.createdAt).getTime()))).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Version:</span>
                              <span className="font-medium ml-2">2.1.0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Solution Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="text-primary mr-3" />
                      Solution
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Reasoning frameworks and tools</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Ontology Files */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Bot Ontologies</h4>
                      <div className="space-y-2">
                        {getFilesBySection("solution", "ontology").map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center">
                              <ChartGantt className="text-green-600 mr-3 h-4 w-4" />
                              <div>
                                <span className="text-sm font-medium">{file.originalName}</span>
                                <p className="text-xs text-muted-foreground">
                                  {file.originalName.includes('action') ? 'Action and behavior ontology' : 
                                   file.originalName.includes('environment') ? 'Environmental reasoning' : 
                                   'Social interaction protocols'}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownload(file.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* TPTP Reasoners */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Available Reasoners</h4>
                      <div className="space-y-2">
                        {reasoners.map((reasoner) => (
                          <a 
                            key={reasoner.id}
                            href={reasoner.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-950/30 transition-colors"
                          >
                            <div className="flex items-center">
                              <Brain className="text-orange-600 mr-3 h-4 w-4" />
                              <div>
                                <span className="text-sm font-medium">{reasoner.name}</span>
                                <p className="text-xs text-muted-foreground">{reasoner.description}</p>
                              </div>
                            </div>
                            <ExternalLink className="text-orange-600 h-4 w-4" />
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Results and Analysis */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Analysis Results</h4>
                      <div className="space-y-2">
                        {getFilesBySection("solution", "other").map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center">
                              <FileText className="text-muted-foreground mr-3 h-4 w-4" />
                              <span className="text-sm">{file.originalName}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDownload(file.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
