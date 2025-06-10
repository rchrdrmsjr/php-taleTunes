// import RoomAudiobookUploadModal from '@/components/room-audiobook-upload-modal';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { useToast } from '@/components/ui/use-toast';
// import RoomLayout from '@/layouts/RoomLayout';
// import { Audiobook, Room, User } from '@/types';

// import { Head } from '@inertiajs/react';
// import { formatDistanceToNow } from 'date-fns';
// import React from 'react';

// interface Props {
//     room: Room;
//     audiobooks: (Audiobook & { user: User })[];
// }

// export default function RoomAudiobooks({ room, audiobooks }: Props) {
//     const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
//     const { toast } = useToast();

//     return (
//         <RoomLayout room={room}>
//             <Head title={`${room.name} - Audiobooks`} />

//             <div className="container mx-auto px-4 py-8">
//                 <div className="mb-8 flex items-center justify-between">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900">Room Audiobooks</h1>
//                         <p className="mt-2 text-gray-600">Browse and listen to audiobooks shared in this room</p>
//                     </div>
//                     <Button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-2">
//                         <PlusIcon className="h-5 w-5" />
//                         Add Audiobook
//                     </Button>
//                 </div>

//                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//                     {audiobooks.map((audiobook) => (
//                         <Card key={audiobook.id} className="flex flex-col">
//                             <CardHeader>
//                                 <div className="aspect-w-16 aspect-h-9 mb-4">
//                                     <img
//                                         src={JSON.parse(audiobook.cover_image)[0]}
//                                         alt={audiobook.title}
//                                         className="h-full w-full rounded-lg object-cover"
//                                     />
//                                 </div>
//                                 <CardTitle className="line-clamp-2">{audiobook.title}</CardTitle>
//                                 <CardDescription className="line-clamp-2">{audiobook.description}</CardDescription>
//                             </CardHeader>
//                             <CardContent className="flex-grow">
//                                 <div className="mb-4 flex flex-wrap gap-2">
//                                     <Badge variant="secondary">{audiobook.category}</Badge>
//                                     <Badge variant="outline">Added {formatDistanceToNow(new Date(audiobook.created_at), { addSuffix: true })}</Badge>
//                                 </div>
//                                 <p className="text-sm text-gray-500">Added by {audiobook.user.name}</p>
//                             </CardContent>
//                             <CardFooter>
//                                 <Button
//                                     variant="outline"
//                                     className="w-full"
//                                     onClick={() => {
//                                         // TODO: Implement audiobook playback
//                                         toast({
//                                             title: 'Coming soon',
//                                             description: 'Audiobook playback will be available soon!',
//                                         });
//                                     }}
//                                 >
//                                     Play Audiobook
//                                 </Button>
//                             </CardFooter>
//                         </Card>
//                     ))}
//                 </div>

//                 {audiobooks.length === 0 && (
//                     <div className="py-12 text-center">
//                         <h3 className="text-lg font-medium text-gray-900">No audiobooks yet</h3>
//                         <p className="mt-2 text-gray-500">Be the first to add an audiobook to this room!</p>
//                     </div>
//                 )}
//             </div>

//             <RoomAudiobookUploadModal room={room} isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
//         </RoomLayout>
//     );
// }
