"use client"

import { RotateCcw } from "lucide-react"
import { useStore } from "@tanstack/react-form"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useTypedAppFormContext } from "@/hooks/use-app-form"

import { sliders } from "@/features/text-to-speech/data/sliders"
import { ttsFormOptions } from "@/features/text-to-speech/components/text-to-speech-form"
import { VoiceSelector } from "./voice-selector"

export function SettingsPanelSettings() {
  const form = useTypedAppFormContext(ttsFormOptions)
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting)

  const handleResetSliders = () => {
    sliders.forEach((slider) => {
      form.setFieldValue(slider.id, slider.defaultValue)
    })
  }

  return (
    <>
      {/* Voice Style Dropdown Section */}
      <div className="border-b border-dashed p-4">
        <VoiceSelector />
      </div>

      {/* Voice Adjustments Section */}
      <div className="p-4 flex-1">
        <div className="mb-4 flex items-center justify-between">
          <FieldLabel>Adjustments</FieldLabel>
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetSliders}
            disabled={isSubmitting}
            className="gap-2">
            <RotateCcw className="size-3" />
            Reset
          </Button>
        </div>
        <FieldGroup className="gap-8">
          {sliders.map((slider) => (
            <form.Field
              key={slider.id}
              name={slider.id}>
              {(field) => (
                <Field>
                  <FieldLabel>{slider.label}</FieldLabel>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {slider.leftLabel}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {slider.rightLabel}
                    </span>
                  </div>
                  <Slider
                    value={[field.state.value]}
                    onValueChange={(value) =>
                      field.handleChange(Array.isArray(value) ? value[0] : value)
                    }
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    disabled={isSubmitting}
                    className="**:data-[slot=slider-thumb]:size-3 **:data-[slot=slider-thumb]:bg-foreground **:data-[slot=slider-track]:h-1"
                  />
                </Field>
              )}
            </form.Field>
          ))}
        </FieldGroup>
      </div>
    </>
  )
}
