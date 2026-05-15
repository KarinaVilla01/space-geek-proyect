import { z } from 'zod'

export const socialEntryFormSchema = z.object({
  platform: z.enum(['youtube', 'instagram', 'x']),
  url: z.string().trim().url('La URL no es válida'),
  external_id: z.string().trim().optional().or(z.literal('')),
  title: z.string().trim().optional().or(z.literal('')),
  description: z.string().trim().max(500, 'La descripción es demasiado larga').optional().or(z.literal('')),
  image_url: z.string().trim().optional().or(z.literal('')),
  published_at: z.string().trim().optional().or(z.literal('')),
  priority: z.string().trim().optional().or(z.literal('')),
  active: z.string().trim().optional().or(z.literal('')),
})
