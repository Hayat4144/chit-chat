import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icons } from '@/components/Icons';

interface NextPrevButtonsProps {
  activeTab: string;
  setactivetab: (value: string) => void;
}
export default function NextPrevButtons({
  activeTab,
  setactivetab,
}: NextPrevButtonsProps) {
  const changeTab = () => {
    activeTab === 'members'
      ? setactivetab('createGroup')
      : setactivetab('members');
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className={'absolute bottom-5 left-[50%]'}>
          <Button
            className="rounded-full"
            variant="secondary"
            size="icon"
            onClick={changeTab}
          >
            {activeTab !== 'members' ? (
              <Icons.chevronLeft size={17} />
            ) : (
              <Icons.chevronRight size={17} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {activeTab !== 'members' ? <p>Previous</p> : <p>Next</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
