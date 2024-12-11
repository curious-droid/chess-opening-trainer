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
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <h3 className="font-medium mb-2">Load Opening</h3>
      <div className="space-y-4">
        <div className="rounded-lg bg-muted p-4 mb-4">
          <h4 className="font-medium mb-2">Instructions</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Upload or paste a PGN file of the opening you want to practice</li>
            <li>• Choose which color you want to play as</li>
            <li>• You get 3 attempts for each move</li>
            <li>• After 3 wrong attempts, the correct move will be shown</li>
            <li>• Practice until you can complete the opening without mistakes!</li>
          </ul>
        </div>
        <PgnUploadForm 
          onSubmit={() => {}} 
          onChange={onPgnChange}
        />
        <Button 
          onClick={onStartTraining}
          disabled={!isPgnValid}
          className="w-full"
        >
          Start Training
        </Button>
      </div>
    </div>
  )
} 