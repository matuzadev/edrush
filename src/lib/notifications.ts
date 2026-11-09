import { db } from '@/lib/db';
import { notifications } from '@/db/schema';

export type NotificationType = 'friend_request' | 'friend_accepted' | 'achievement' | 'admin_message';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  relatedId?: string;
}

export async function createNotification(params: CreateNotificationParams): Promise<void> {
  const now = new Date().toISOString();
  await db.insert(notifications).values({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    body: params.body,
    read: 0,
    related_id: params.relatedId ?? null,
    criado_em: now,
  });
}
