"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Calendar,
  Target,
  TrendingUp,
  Copy,
  Eye,
  Star,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// Mock data for demonstration
const mockDiets = [
  {
    id: 1,
    name: "High Protein Muscle Building",
    description: "Designed for muscle gain with emphasis on protein intake and balanced macronutrients.",
    creator: { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", id: "trainer1" },
    createdDate: "2024-01-15",
    status: "active",
    category: "Muscle Building",
    totalCalories: 2800,
    macros: { protein: 35, carbs: 40, fats: 25 },
    assignedMembers: 12,
    successRate: 87,
    rating: 4.8,
    tags: ["High Protein", "Muscle Gain", "Advanced"],
    hasAccess: true,
    isFavorite: true,
  },
  {
    id: 2,
    name: "Keto Fat Loss Plan",
    description: "Low-carb, high-fat ketogenic diet plan for rapid fat loss and metabolic improvement.",
    creator: { name: "Mike Chen", avatar: "/placeholder.svg?height=32&width=32", id: "trainer2" },
    createdDate: "2024-01-10",
    status: "active",
    category: "Weight Loss",
    totalCalories: 1800,
    macros: { protein: 25, carbs: 5, fats: 70 },
    assignedMembers: 8,
    successRate: 92,
    rating: 4.9,
    tags: ["Keto", "Fat Loss", "Low Carb"],
    hasAccess: false,
    isFavorite: false,
  },
  {
    id: 3,
    name: "Balanced Maintenance Diet",
    description: "Well-rounded nutrition plan for maintaining current weight and overall health.",
    creator: { name: "Emily Davis", avatar: "/placeholder.svg?height=32&width=32", id: "trainer3" },
    createdDate: "2024-01-08",
    status: "draft",
    category: "Maintenance",
    totalCalories: 2200,
    macros: { protein: 30, carbs: 45, fats: 25 },
    assignedMembers: 5,
    successRate: 78,
    rating: 4.5,
    tags: ["Balanced", "Maintenance", "Beginner"],
    hasAccess: true,
    isFavorite: false,
  },
  {
    id: 4,
    name: "Vegan Performance Diet",
    description: "Plant-based nutrition optimized for athletic performance and recovery.",
    creator: { name: "Alex Rodriguez", avatar: "/placeholder.svg?height=32&width=32", id: "trainer4" },
    createdDate: "2024-01-05",
    status: "active",
    category: "Performance",
    totalCalories: 2600,
    macros: { protein: 20, carbs: 55, fats: 25 },
    assignedMembers: 15,
    successRate: 85,
    rating: 4.7,
    tags: ["Vegan", "Performance", "Plant-Based"],
    hasAccess: true,
    isFavorite: true,
  },
]

const currentTrainerId = "trainer1" // This would come from your auth context

export default function DietManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState("grid")

  const filteredDiets = mockDiets.filter((diet) => {
    const matchesSearch =
      diet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diet.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || diet.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || diet.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = ["all", ...Array.from(new Set(mockDiets.map((diet) => diet.category)))]
  const statuses = ["all", "active", "draft", "archived"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const MacroBar = ({ label, percentage, color }: { label: string; percentage: number; color: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  )

  const DietCard = ({ diet }: { diet: (typeof mockDiets)[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg leading-tight">{diet.name}</CardTitle>
              {diet.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
            </div>
            <Badge className={getStatusColor(diet.status)} variant="secondary">
              {diet.status}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={!diet.hasAccess} className={!diet.hasAccess ? "opacity-50" : ""}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Diet
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!diet.hasAccess}
                className={`${!diet.hasAccess ? "opacity-50" : ""} text-red-600 focus:text-red-600`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Diet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{diet.description}</p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{diet.totalCalories}</span>
            <span className="text-muted-foreground">kcal</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{diet.assignedMembers}</span>
            <span className="text-muted-foreground">members</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{diet.successRate}%</span>
            <span className="text-muted-foreground">success</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Macronutrients</h4>
          <div className="grid grid-cols-3 gap-3">
            <MacroBar label="Protein" percentage={diet.macros.protein} color="blue" />
            <MacroBar label="Carbs" percentage={diet.macros.carbs} color="green" />
            <MacroBar label="Fats" percentage={diet.macros.fats} color="orange" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={diet.creator.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {diet.creator.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{diet.creator.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{diet.createdDate}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {diet.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" disabled={!diet.hasAccess} className="flex-1 bg-transparent">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!diet.hasAccess}
            className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Diet Management</h1>
          <p className="text-muted-foreground">Manage and monitor all diet plans in your gym</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Diet
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Diets</p>
                <p className="text-2xl font-bold">{mockDiets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">{mockDiets.reduce((sum, diet) => sum + diet.assignedMembers, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round(mockDiets.reduce((sum, diet) => sum + diet.successRate, 0) / mockDiets.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {(mockDiets.reduce((sum, diet) => sum + diet.rating, 0) / mockDiets.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search diets by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Diet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiets.map((diet) => (
          <DietCard key={diet.id} diet={diet} />
        ))}
      </div>

      {filteredDiets.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No diets found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or create a new diet plan.</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Diet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
