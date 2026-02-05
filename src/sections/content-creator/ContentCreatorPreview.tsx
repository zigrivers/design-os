import { useState } from 'react'
import { ContentCreator } from './components'
import data from '@/../product/sections/content-creator/data.json'
import type {
  AvailableVoiceClone,
  PlatformConfig,
  ContentTemplate,
  CurrentSession,
  ContentProperties,
  GeneratedContent,
  ContentVariation,
  QuickFeedbackOption,
} from '@/../product/sections/content-creator/types'

export default function ContentCreatorPreview() {
  // Initialize state from sample data
  const [voiceClones] = useState<AvailableVoiceClone[]>(
    data.availableVoiceClones as AvailableVoiceClone[]
  )
  const [platforms] = useState<PlatformConfig[]>(data.platforms as PlatformConfig[])
  const [templates, setTemplates] = useState<ContentTemplate[]>(
    data.contentTemplates as ContentTemplate[]
  )
  const [generatedContent] = useState<GeneratedContent[]>(
    data.generatedContent as unknown as GeneratedContent[]
  )
  const [contentVariations] = useState<Record<string, ContentVariation[]>>(
    data.contentVariations as Record<string, ContentVariation[]>
  )
  const [quickFeedbackOptions] = useState<QuickFeedbackOption[]>(
    data.quickFeedbackOptions as QuickFeedbackOption[]
  )

  // Current session state
  const [currentSession, setCurrentSession] = useState<CurrentSession>({
    voiceCloneId: data.currentSession.voiceCloneId,
    input: data.currentSession.input,
    inputCharacterCount: data.currentSession.inputCharacterCount,
    properties: data.currentSession.properties as ContentProperties,
    generateVariations: data.currentSession.generateVariations,
    status: data.currentSession.status as CurrentSession['status'],
    lastSavedAt: data.currentSession.lastSavedAt,
  })

  const handleSelectVoiceClone = (id: string) => {
    setCurrentSession((prev) => ({
      ...prev,
      voiceCloneId: id,
    }))
  }

  const handleUpdateInput = (value: string) => {
    setCurrentSession((prev) => ({
      ...prev,
      input: value,
      inputCharacterCount: value.length,
      lastSavedAt: new Date().toISOString(),
    }))
  }

  const handleUpdateProperties = (updates: Partial<ContentProperties>) => {
    setCurrentSession((prev) => ({
      ...prev,
      properties: {
        ...prev.properties,
        ...updates,
      },
    }))
  }

  const handleGenerate = () => {
    setCurrentSession((prev) => ({
      ...prev,
      status: 'generating',
    }))
    // Simulate generation
    setTimeout(() => {
      setCurrentSession((prev) => ({
        ...prev,
        status: 'ready',
      }))
      alert('Content generated! (In a real app, this would show the Results View)')
    }, 2000)
  }

  const handleToggleVariations = (enabled: boolean) => {
    setCurrentSession((prev) => ({
      ...prev,
      generateVariations: enabled,
    }))
  }

  const handleSaveTemplate = (name: string, description: string) => {
    const newTemplate: ContentTemplate = {
      id: `tpl-${Date.now()}`,
      name,
      description,
      properties: { ...currentSession.properties },
      isDefault: false,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTemplates((prev) => [newTemplate, ...prev])
  }

  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setCurrentSession((prev) => ({
        ...prev,
        properties: { ...template.properties },
      }))
    }
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId))
  }

  return (
    <ContentCreator
      availableVoiceClones={voiceClones}
      platforms={platforms}
      contentTemplates={templates}
      currentSession={currentSession}
      generatedContent={generatedContent}
      contentVariations={contentVariations}
      quickFeedbackOptions={quickFeedbackOptions}
      onSelectVoiceClone={handleSelectVoiceClone}
      onUpdateInput={handleUpdateInput}
      onUpdateProperties={handleUpdateProperties}
      onGenerate={handleGenerate}
      onToggleVariations={handleToggleVariations}
      onSaveTemplate={handleSaveTemplate}
      onLoadTemplate={handleLoadTemplate}
      onDeleteTemplate={handleDeleteTemplate}
    />
  )
}
