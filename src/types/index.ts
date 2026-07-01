export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  end_time?: string
  venue: string
  address: string
  city: string
  category: string
  image_url: string
  organizer_id?: string
  organizer_name?: string
  status: 'draft' | 'published' | 'cancelled'
  featured?: boolean
  ticket_types?: TicketType[]
}

export interface TicketType {
  id: string
  event_id: string
  name: string
  description?: string
  price: number
  quantity: number
  quantity_sold: number
}

export interface CartItem {
  ticket_type_id: string
  ticket_type_name: string
  event_id: string
  event_title: string
  event_date: string
  event_venue: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  user_id: string
  event_id: string
  total: number
  status: 'pending' | 'paid' | 'cancelled'
  stripe_session_id?: string
  created_at: string
  event?: Event
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  ticket_type_id: string
  quantity: number
  price: number
  ticket_type?: TicketType
}

export interface Ticket {
  id: string
  order_id: string
  ticket_type_id: string
  user_id: string
  qr_code: string
  used: boolean
  created_at: string
  event_title?: string
  event_date?: string
  event_venue?: string
  ticket_type_name?: string
  price?: number
}

export interface User {
  id: string
  email: string
  name?: string
  role?: 'user' | 'organizer' | 'admin'
}
