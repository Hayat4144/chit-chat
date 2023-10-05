import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Button } from '../ui/button';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  addEmoji: (value: any) => void;
}

export default function EmojiPicker({ addEmoji }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Smile size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="mb-6 object-fill w-fit px-0 py-0 border-none"
      >
        <Picker data={data} onEmojiSelect={addEmoji} className={'my-0 mx-0'} />
      </PopoverContent>
    </Popover>
  );
}
