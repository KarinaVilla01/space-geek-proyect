export type PostStatus = 'draft' | 'published' | 'archived'

export interface PostSection {
  id: string
  slug: string
  label: string
  sort_order: number
  created_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content_html: string
  cover_image_path: string | null
  status: PostStatus
  post_type: string
  published_at: string | null
  author_id: string | null
  created_at: string
  updated_at: string
}

export interface CreatePostInput {
  title: string
  slug: string
  excerpt?: string | null
  content_html: string
  cover_image_path?: string | null
  status?: PostStatus
  post_type: string
  published_at?: string | null
  author_id?: string | null
}

export interface UpdatePostInput {
  title?: string
  slug?: string
  excerpt?: string | null
  content_html?: string
  cover_image_path?: string | null
  status?: PostStatus
  post_type?: string
  published_at?: string | null
  author_id?: string | null
}