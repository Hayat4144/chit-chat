import React, { Fragment, useEffect, useState } from 'react';
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from '../ui/tooltip';
import { Button } from '../ui/button';
import { Icons } from '../Icons';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useParams } from 'next/navigation';
import uploadAttachment from '@/service/uploadAttachement';
import { useSession } from 'next-auth/react';
import { toast } from '../ui/use-toast';
import { Message } from '@/types';
import AttachementLoading from './AttachementLoading';

interface uploadedImages {
  image_preview: {
    url: string | ArrayBuffer;
    id: string;
  };
  image_as_file: File;
}

interface AttachmentPreviewModalProps {
  data: uploadedImages[];
  setModalOpen: (value: boolean) => void;
  isGroupchat: boolean;
  isImageloaded: boolean;
  setmessages: (data: Message[]) => void;
  setuploadImages: (dat: []) => void;
}

export default function AttachmentPreviewModal({
  data,
  isImageloaded,
  setuploadImages,
  isGroupchat,
  setModalOpen,
  setmessages,
}: AttachmentPreviewModalProps) {
  const [images, setimages] = useState<uploadedImages[]>([]);
  const [current_imageIndex, setcurrent_imageIndex] = useState<number>(0);
  const [messgevalue, setmessgevalue] = useState('');
  const { id } = useParams();
  const session = useSession();
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (data.length > 0) {
      setcurrent_imageIndex(0);
      setimages(data);
    }
  }, [data]);

  const onSubmit = async () => {
    setisLoading(true);
    if (images.length < 1) {
      setisLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append('images', images[0].image_as_file);
    formData.append('chatId', id as string);
    formData.append('isGroupchat', isGroupchat as any);
    formData.append('message', messgevalue);
    const { data, error } = await uploadAttachment(
      session.data.user.token,
      formData,
    );
    setisLoading(false);
    setuploadImages([]);
    if (error) {
      toast({ title: error, variant: 'destructive' });
      return;
    }
    if (!isGroupchat) {
      setmessages(data);
    }
    setModalOpen(false);
  };

  return (
    <div className="absolute w-full z-50 bg-background h-full flex flex-col">
      <div className="h-[69px] sticky w-full top-0 z-30 border-b flex items-center space-x-2 md:space-x-5 px-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="rounded-full h-8 w-8"
                variant="ghost"
                size="icon"
              >
                <Icons.close size={17} onClick={() => setModalOpen(false)} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Go Back</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <h1 className="text-xl">Attachment preview</h1>
      </div>
      {isImageloaded ? (
        <AttachementLoading />
      ) : !isImageloaded && images.length > 0 ? (
        <Fragment>
          <div className="px-10 my-2 flex items-center flex-1">
            <AspectRatio ratio={16 / 8} className="my-0">
              <Image
                src={images[current_imageIndex].image_preview.url as string}
                alt="no image preview is available"
                fill
                className="rounded-md object-fill "
              />
            </AspectRatio>
          </div>
          <div className="px-5 flex items-center space-x-2">
            {images.map((item, index) => (
              <Image
                src={item.image_preview.url as string}
                width={80}
                key={item.image_preview.id}
                height={80}
                onClick={() => setcurrent_imageIndex(index)}
                alt="pic"
                className={`rounded-md object-cover cursor-pointer ${
                  index === current_imageIndex
                    ? 'border-2 border-accent-foreground'
                    : ''
                }`}
              />
            ))}
          </div>
          <div className="sticky bottom-0 bg-background z-50 h-24 md:h-20  px-2 py-2">
            <form
              className="flex items-center py-2 md:space-x-5 space-x-2"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <Input
                placeholder="Write your message here"
                value={messgevalue}
                onChange={(e) => setmessgevalue(e.target.value)}
              />
              <Button className="w-10 h-10" size="icon" variant="secondary">
                {isLoading ? (
                  <Icons.loader size={18} className="animate-spin" />
                ) : (
                  <Icons.send size={18} />
                )}
              </Button>
            </form>
          </div>
        </Fragment>
      ) : null}
    </div>
  );
}
