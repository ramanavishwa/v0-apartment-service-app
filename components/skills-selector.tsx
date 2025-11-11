"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SkillsSelectorProps {
  selectedSkills: string[]
  onSkillsChange: (skills: string[]) => void
  availableSkills?: string[]
}

const DEFAULT_SKILLS = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Masonry",
  "HVAC",
  "Landscaping",
  "Appliance Repair",
  "Cleaning",
  "General Maintenance",
]

export function SkillsSelector({
  selectedSkills,
  onSkillsChange,
  availableSkills = DEFAULT_SKILLS,
}: SkillsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customSkill, setCustomSkill] = useState("")

  const handleAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      onSkillsChange([...selectedSkills, skill])
    }
    setIsOpen(false)
  }

  const handleRemoveSkill = (skill: string) => {
    onSkillsChange(selectedSkills.filter((s) => s !== skill))
  }

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      onSkillsChange([...selectedSkills, customSkill.trim()])
      setCustomSkill("")
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Expertise Skills</label>

      {/* Selected Skills */}
      <div className="flex flex-wrap gap-2">
        {selectedSkills.map((skill) => (
          <div key={skill} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            <span className="text-sm">{skill}</span>
            <button onClick={() => handleRemoveSkill(skill)} className="hover:text-blue-600">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Skills */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left text-sm hover:bg-gray-50"
          >
            {selectedSkills.length === 0 ? "Add skills..." : "Add more skills..."}
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {availableSkills
                .filter((skill) => !selectedSkills.includes(skill))
                .map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleAddSkill(skill)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-100 text-sm"
                  >
                    {skill}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Skill */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customSkill}
          onChange={(e) => setCustomSkill(e.target.value)}
          placeholder="Add custom skill..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          onKeyPress={(e) => e.key === "Enter" && handleAddCustomSkill()}
        />
        <Button onClick={handleAddCustomSkill} variant="outline" size="sm">
          Add
        </Button>
      </div>
    </div>
  )
}
