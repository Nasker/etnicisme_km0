import { getCollection, type CollectionEntry } from 'astro:content';

export type Exhibit = CollectionEntry<'exhibits'>;
export type Room = CollectionEntry<'rooms'>;
export type Person = CollectionEntry<'people'>;

export interface ExhibitView {
  entry: Exhibit;
  room: Room;
  personSlug: string;
}

const dateFmt = new Intl.DateTimeFormat('ca-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatDate(date: Date): string {
  return dateFmt.format(date);
}

export function year(date: Date): number {
  return date.getFullYear();
}

export async function getRoomsSorted(): Promise<Room[]> {
  const rooms = await getCollection('rooms');
  return rooms.sort((a, b) => a.data.order - b.data.order);
}

/** All exhibits joined with their room, sorted by exhibit id ascending. */
export async function getExhibitViews(): Promise<ExhibitView[]> {
  const [exhibits, rooms] = await Promise.all([
    getCollection('exhibits'),
    getCollection('rooms'),
  ]);
  const roomMap = new Map(rooms.map((r) => [r.id, r]));

  return exhibits
    .sort((a, b) => a.data.id.localeCompare(b.data.id))
    .map((entry) => {
      const room = roomMap.get(entry.data.room.id);
      if (!room) {
        throw new Error(
          `Exhibit ${entry.data.id} references unknown room "${entry.data.room.id}".`
        );
      }
      return { entry, room, personSlug: entry.data.person.slug.id };
    });
}
