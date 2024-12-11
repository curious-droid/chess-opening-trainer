import { Button } from '@/components/ui/button'
import { PgnUploadForm } from '@/components/pgn-upload-form'
import { UploadFormData } from '@/types/chess'

interface LoadOpeningCardProps {
  onPgnChange: (data: Partial<UploadFormData>) => void
  onStartTraining: () => void
  isPgnValid: boolean
}

export function LoadOpeningCard({ 
  onPgnChange, 
  onStartTraining, 
  isPgnValid 
}: LoadOpeningCardProps) {
  return (
    <div className="rounded-xl bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100">
      <div className="p-6 space-y-6">
        <div className="rounded-xl bg-gray-50/80 p-6 border border-gray-100">
          <ul className="space-y-3">
            {[
              'Upload or paste a PGN file of the opening you want to practice',
              'Choose which color you want to play as',
              'You get 3 attempts for each move',
              'After 3 wrong attempts, the correct move will be shown',
              'Practice until you can complete the opening without mistakes!'
            ].map((text, i) => (
              <li key={i} className="flex gap-3 items-start text-sm text-gray-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-medium text-gray-600 border border-gray-200 shadow-sm">
                  {i + 1}
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <PgnUploadForm 
            onSubmit={() => {}} 
            onChange={onPgnChange}
          />
          <Button 
            onClick={onStartTraining}
            disabled={!isPgnValid}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Training
          </Button>
        </div>
      </div>
    </div>
  )
} 