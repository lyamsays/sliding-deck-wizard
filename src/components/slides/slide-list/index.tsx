import React from 'react'
import { Slide } from '@/types/deck'
import SlideGrid from './SlideGrid'
import SlideHeader from './SlideHeader'
import ExportToImage from '../ExportToImage'
import { motion } from 'framer-motion'

interface SlideListProps {
  editedSlides: Slide[]
  viewMode: 'outline' | 'slide'
  setViewMode: (mode: 'outline' | 'slide') => void
  deckTitle: string
  setDeckTitle: (title: string) => void
  handleSave: () => void
  handleSlideUpdate: (index: number, updatedSlide: Slide) => void
  handleRemoveImage: (index: number) => void
  handleDownloadSlides: () => void
  isSaving: boolean
}

const SlideList: React.FC<SlideListProps> = ({
  editedSlides,
  viewMode,
  setViewMode,
  deckTitle,
  setDeckTitle,
  handleSave,
  handleSlideUpdate,
  handleRemoveImage,
  handleDownloadSlides,
  isSaving,
}) => {
  if (editedSlides.length === 0) return null

  return (
    <motion.div
      className="mt-12 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <SlideHeader
        deckTitle={deckTitle}
        setDeckTitle={setDeckTitle}
        viewMode={viewMode}
        setViewMode={setViewMode}
        handleSave={handleSave}
        handleDownloadSlides={handleDownloadSlides}
        isSaving={isSaving}
        slideCount={editedSlides.length}
        ExportComponent={<ExportToImage slides={editedSlides} deckTitle={deckTitle} />}
      />

      <SlideGrid
        editedSlides={editedSlides}
        viewMode={viewMode}
        handleSlideUpdate={handleSlideUpdate}
        handleRemoveImage={handleRemoveImage}
      />
    </motion.div>
  )
}

export default SlideList
