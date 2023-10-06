import React, { Fragment, useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/button';
import { LoaderIcon } from 'lucide-react';
import removeParticipants from '@/service/removeparticipants';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

export default function RemoveParticipant({ id }: { id: string }) {
  const [open, setopen] = useState(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const session = useSession();
  const params = useParams();

  const onSubmit = async () => {
    setisLoading(true);
    const { data, error } = await removeParticipants(
      session.data.user.token,
      [id],
      params.id as string,
    );
    setisLoading(false);
    if (error) return toast({ title: error, variant: 'destructive' });
    toast({ title: '1 participant has been removed successfully.' });
    setopen(false);
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AlertDialog open={open} onOpenChange={setopen}>
            <AlertDialogTrigger>
              <Icons.trash size={25} className="text-red-700 pr-2 text-xl" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove the
                  participants from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button disabled={isLoading} onClick={onSubmit}>
                  {isLoading ? (
                    <Fragment>
                      <LoaderIcon size={18} className="animate-spin" />
                      <span className="ml-2">please wait</span>
                    </Fragment>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TooltipTrigger>
        <TooltipContent>Remove participants </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
