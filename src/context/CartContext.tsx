'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { CartItem } from '@/types'

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (ticketTypeId: string) => void
  updateQuantity: (ticketTypeId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('quello_cart')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('quello_cart', JSON.stringify(items))
  }, [items])

  function addItem(newItem: CartItem) {
    setItems(prev => {
      const existing = prev.find(i => i.ticket_type_id === newItem.ticket_type_id)
      if (existing) {
        return prev.map(i =>
          i.ticket_type_id === newItem.ticket_type_id
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        )
      }
      return [...prev, newItem]
    })
  }

  function removeItem(ticketTypeId: string) {
    setItems(prev => prev.filter(i => i.ticket_type_id !== ticketTypeId))
  }

  function updateQuantity(ticketTypeId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(ticketTypeId)
      return
    }
    setItems(prev =>
      prev.map(i => i.ticket_type_id === ticketTypeId ? { ...i, quantity } : i)
    )
  }

  function clearCart() {
    setItems([])
    localStorage.removeItem('quello_cart')
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
