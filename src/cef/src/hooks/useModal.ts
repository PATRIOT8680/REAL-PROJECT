import { useContext, createContext, useState, ReactNode, FC } from "react";
import { ModalContext } from "../context/ModalContext.tsx";

export const useModal = () => {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }

  return context
}