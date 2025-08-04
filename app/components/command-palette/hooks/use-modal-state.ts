import { useState } from "react"

export const useModalState = (controlledIsOpen?: boolean, onOpenChange?: (open: boolean) => void) => {
	const [internalIsOpen, setInternalIsOpen] = useState(false)

	const isOpen = controlledIsOpen ?? internalIsOpen

	const setIsOpen = (open: boolean) => {
		if (onOpenChange) {
			onOpenChange(open)
		} else {
			setInternalIsOpen(open)
		}
	}

	const openModal = () => setIsOpen(true)
	const closeModal = () => setIsOpen(false)

	return { isOpen, openModal, closeModal }
}
