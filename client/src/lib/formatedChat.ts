import { IChat } from '@/types';
import getNameshortcut from './NameShortcut';

const formatedChat = (data: any, session: any): IChat[] => {
  return data.map((item) => {
    if (!item.isGroupchat) {
      const recievers = item.members.filter(
        (member) => member._id !== session.user.id,
      );
      const name = `${recievers[0].firstName} ${recievers[0].lastName}`;
      const shortcut = getNameshortcut(name);

      const updatedMembers = recievers.map((member) => {
        if (member._id !== session.user.id) {
          return {
            ...member,
            profileShortcutName: shortcut,
          };
        }
        return member; // For other members, keep them unchanged
      });
      return {
        ...item,
        name,
        members: updatedMembers,
      };
    }
    const shortcut = getNameshortcut(item.name);
    const updatedMembers = item.members.map((member) => {
      const name = `${member.firstName} ${member.lastName}`;
      const NameShortcut = getNameshortcut(name);
      return { ...member, profileShortcutName: NameShortcut };
    });

    return { ...item, groupShortcut: shortcut, members: updatedMembers };
  });
};

export default formatedChat;
