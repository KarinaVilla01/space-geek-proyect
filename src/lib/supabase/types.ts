export type PostStatus = 'draft' | 'published' | 'archived'
export type PostType = 'blog' | 'news' | 'tip'

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content_html: string
  cover_image_path: string | null
  status: PostStatus
  post_type: PostType
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
  post_type: PostType
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
  post_type?: PostType
  published_at?: string | null
  author_id?: string | null
}