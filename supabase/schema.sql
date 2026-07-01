-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Events table
create table events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  date date not null,
  time text not null,
  end_time text,
  venue text not null,
  address text,
  city text not null,
  category text not null,
  image_url text,
  organizer_id uuid references auth.users(id),
  organizer_name text,
  status text default 'draft' check (status in ('draft', 'published', 'cancelled')),
  featured boolean default false,
  created_at timestamp with time zone default now()
);

-- Ticket types table
create table ticket_types (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  quantity integer not null,
  quantity_sold integer default 0,
  created_at timestamp with time zone default now()
);

-- Orders table
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  total numeric(10,2) not null,
  status text default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  stripe_session_id text,
  customer_name text,
  customer_email text,
  created_at timestamp with time zone default now()
);

-- Order items table
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  ticket_type_id uuid references ticket_types(id),
  event_id uuid references events(id),
  quantity integer not null,
  price numeric(10,2) not null,
  created_at timestamp with time zone default now()
);

-- Tickets (individual tickets with QR codes)
create table tickets (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  order_item_id uuid references order_items(id),
  ticket_type_id uuid references ticket_types(id),
  event_id uuid references events(id),
  user_id uuid references auth.users(id),
  qr_code text not null,
  used boolean default false,
  used_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Row Level Security
alter table events enable row level security;
alter table ticket_types enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table tickets enable row level security;

-- Events: anyone can read published events
create policy "Public events are viewable by everyone" on events
  for select using (status = 'published');

-- Events: organizers can manage their own events
create policy "Organizers can manage their events" on events
  for all using (auth.uid() = organizer_id);

-- Ticket types: anyone can read
create policy "Ticket types are publicly viewable" on ticket_types
  for select using (true);

-- Orders: users can view their own orders
create policy "Users can view own orders" on orders
  for select using (auth.uid() = user_id);

create policy "Users can create orders" on orders
  for insert with check (auth.uid() = user_id);

-- Tickets: users can view their own tickets
create policy "Users can view own tickets" on tickets
  for select using (auth.uid() = user_id);
