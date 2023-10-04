import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import createGroup from '@/service/createGroup';
import { IUser } from '@/types';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

interface CreategroupTabProps {
  seletecusers: IUser[];
}

export default function CreategroupTab({ seletecusers }: CreategroupTabProps) {
  const [name, setname] = useState('');
  const session = useSession();
  const onSubmit = async () => {
    if (!name || name.length < 2) return;
    const members = seletecusers.map((item) => item._id);
    const CreategroupData = {
      name,
      members,
    };
    const { data, error } = await createGroup(
      session.data.user.token,
      CreategroupData,
    );
    if (error) return toast({ title: error, variant: 'destructive' });
    toast({ title: data });
  };
  return (
    <div className="flex flex-col">
      <form
        className="flex-col flex space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex-col flex space-y-2">
          <Label>Group Name</Label>
          <Input
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder="Enter your group name"
          />
        </div>
        <Button className="w-full" variant="secondary">
          Submit
        </Button>
      </form>
    </div>
  );
}
