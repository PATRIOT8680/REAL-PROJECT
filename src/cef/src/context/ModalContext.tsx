import { createContext, FC, ReactNode, useState } from "react";

interface IModalData {
  title: string,
  content: ReactNode,
  isOpen: boolean
}

export interface IModalContext {
  openModal: (title: string, content: ReactNode) => void,
  closeModal: () => void,
  modalData: IModalData
}

export const ModalContext = createContext<IModalContext | undefined>(undefined)

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [modalData, setModalData] = useState<IModalData>({
    title: '',
    content: null,
    isOpen: false,
  })

  const openModal = (title: string, content: ReactNode) => {
    setModalData({
      title: title,
      content: content,
      isOpen: true
    })
  }

  const closeModal = () => {
    setModalData(prev => ({
      ...prev,
      isOpen: false
    }))
  }

  return (
      <ModalContext.Provider value={{ openModal, closeModal, modalData }}>
        { children }
      </ModalContext.Provider>
  )
}