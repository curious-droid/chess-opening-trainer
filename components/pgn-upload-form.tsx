'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { UploadFormData } from '@/types/chess'
import { Input } from '@/components/ui/input'
import { useRef } from 'react'

const formSchema = z.object({
  pgn: z.string().min(1, 'PGN is required'),
  playerColor: z.enum(['w', 'b'])
})

type FormData = z.infer<typeof formSchema>

interface PgnUploadFormProps {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSubmit: (data: UploadFormData) => void
  onChange?: (data: Partial<UploadFormData>) => void
}

export function PgnUploadForm({ onChange }: PgnUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pgn: '',
      playerColor: 'w'
    }
  })

  const handleFieldChange = (name: keyof FormData, value: string) => {
    if (onChange) {
      onChange({ [name]: value })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      form.setValue('pgn', text)
      handleFieldChange('pgn', text)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch {
      console.error('Error reading file')
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="pgn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PGN</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Paste your PGN here..."
                    className="h-32"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleFieldChange('pgn', e.target.value)
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".pgn"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload PGN File
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="playerColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Play as</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value)
                    handleFieldChange('playerColor', value)
                  }}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="w" id="white" />
                    <label htmlFor="white">White</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="b" id="black" />
                    <label htmlFor="black">Black</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
} 