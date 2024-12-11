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

  const openings = [
    {
      name: "Ruy Lopez",
      pgn: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2"
    },
    {
      name: "Sicilian Defense",
      pgn: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 10. O-O-O"
    },
    {
      name: "Nimzo-Indian",
      pgn: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. Nf3 c5 7. O-O dxc4 8. Bxc4 Nbd7 9. Qe2 b6 10. Rd1"
    }
  ]

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
                    className="h-28"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleFieldChange('pgn', e.target.value)
                    }}
                  />
                  <div className="flex items-center gap-2">
                    {openings.map((opening) => (
                      <Button
                        key={opening.name}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-100 border-blue-300 text-blue-700"
                        onClick={() => {
                          form.setValue('pgn', opening.pgn)
                          handleFieldChange('pgn', opening.pgn)
                        }}
                      >
                        {opening.name}
                      </Button>
                    ))}
                  </div>
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
            <FormItem className="space-y-0">
              <div className="flex items-center gap-4">
                <FormLabel className="shrink-0">Play as</FormLabel>
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
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
} 