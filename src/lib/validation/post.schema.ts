import { z } from 'zod'

export const postStatusSchema = z.enum(['draft', 'published', 'archived'])
export const postTypeSchema = z.enum(['blog', 'news', 'tip'])

export const postFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
    slug: z.string().trim().min(1, 'Slug is required').max(220, 'Slug is too long'),
    excerpt: z.string().trim().max(300, 'Excerpt is too long').optional().or(z.literal('')),
    content_md: z.string().trim().optional().default(''),
    cover_image_url: z.string().trim().optional().or(z.literal('')),
    status: postStatusSchema,
    post_type: postTypeSchema,
  })
  .superRefine((data, ctx) => {
    if (data.status === 'published' && data.content_md.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['content_md'],
        message: 'Content is required to publish a post',
      })
    }
  })

export type PostFormValues = z.infer<typeof postFormSchema>