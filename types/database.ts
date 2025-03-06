export interface Owner {
  id: string;
  name: string | null;
  location: string | null;
  age: string | null;
  image_url: string | null;
  instagram_url: string | null;
  x_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string | null;
  hobby?: Hobby[];
  job: string | null;
  connection: string | null;
  youtube_url: string | null;
}

export interface Hobby {
  id: string;
  owner_id: string | null;
  owner_hobby: string | null;
  created_at: string;
}

export interface Book {
  id: string;
  owner_id: string | null;
  isbn: string | null;
  title: string | null;
  author: string | null;
  thumbnail: string | null;
  price: string | null;
  description: string | null;
  created_at: string;
  updated_at: string | null;
  owner?: Owner;
}

export type Event = {
  id: string;
  created_at: string;
  name: string;
  data: string;
  price: number;
  location: string;
  description: string;
  status: string;
  thumbnail_url?: string | null;
  event_images?: EventImage[];
};

export interface EventImage {
  id: string;
  event_id: string | null;
  image_url: string | null;
  created_at: string;
} 